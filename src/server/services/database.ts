import type { File, Prisma, Template } from "@prisma/client";

import prisma, { type PrismaClientSingleton } from "@/server/prisma";

export class DatabaseService {
  constructor(private prisma: PrismaClientSingleton) {}

  async getAllProblems(
    filters?: Prisma.ProblemFindManyArgs["where"],
    selects?: Prisma.ProblemFindManyArgs["select"],
  ) {
    const hasActiveFilters = filters && Object.keys(filters).length > 0;

    const problems = await this.prisma.problem.findMany({
      where: hasActiveFilters
        ? {
            OR: [filters],
          }
        : undefined,
      select: {
        id: true,
        difficulty: true,
        description: true,
        name: true,
        slug: true,
        careerPath: {
          select: {
            slug: true,
          },
        },
        techStack: true,
        completionDuration: true,
        ...selects,
      },
    });

    return problems;
  }

  async getProblemBySlug(slug: string, templateName?: string, authenticatedUserId?: string) {
    const [problem, templates, template] = await this.prisma.$transaction([
      this.prisma.problem.findFirst({
        where: {
          slug,
        },
        include: {
          templates: {
            where: {
              default: true,
            },
            include: {
              starterFiles: true,
              solutionFiles: true,
            },
          },
          problemSets: true,
        },
      }),
      this.prisma.template.findMany({
        where: {
          problem: {
            slug,
          },
        },
      }),
      this.prisma.template.findFirst({
        where: {
          problem: {
            slug,
          },
          name: templateName,
        },
        include: {
          starterFiles: true,
          solutionFiles: true,
        }
      }),
    ]);

    const solution = await this.prisma.solution.findFirst({
      where: {
        problemId: problem?.id,
        templateId: template?.id,
        userId: authenticatedUserId
      },
      include: {
        files: true
      }
    })

    return {
      ...problem,
      template,
      solution,
      problemTemplates: templates as unknown as TemplateWithStarterFiles[],
    };
  }
}

export const databaseService = new DatabaseService(prisma);

export type TemplateWithStarterFiles = Template & {
  starterFiles: File[];
  solutionFiles: File[];
};

export type ProblemWithTemplate = NonNullable<
  Awaited<ReturnType<typeof databaseService.getProblemBySlug>>
>;
