import type { File, Prisma, Template } from "@prisma/client";

import prisma, { type PrismaClientSingleton } from "@/server/prisma";

export class DatabaseService {
  constructor(private prisma: PrismaClientSingleton) { }

  async getAllProgressStats(userId: string | undefined) {
    if (!userId) {
      return {
        totalProblems: 0,
        completedProblems: 0,
        percentageCompleted: 0,
      };
    }

    const [totalProblems, completedProblems] = await Promise.all([
      this.prisma.problem.count(),
      this.prisma.solution.groupBy({
        by: ["problemId"],
        where: { userId, NOT: { completedAt: null } },
      }),
    ]);

    return {
      totalProblems,
      completedProblems: completedProblems.length,
      percentageCompleted: Math.floor(
        (completedProblems.length / totalProblems) * 100,
      ),
    };
  }

  async getAllProblems(
    filters?: Prisma.ProblemFindManyArgs["where"],
    selects?: Prisma.ProblemFindManyArgs["select"],
  ) {
    const hasActiveFilters =
      filters &&
      Object.keys(filters).filter(
        (key) => (filters as Record<string, string>)[key] !== undefined,
      ).length > 0;

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

    console.log({ ids: problems.map(problem => problem.id), allSolutions: await this.prisma.solution.findMany() })

    const completedProgresses = await this.prisma.solution.groupBy({
      by: ["problemId"],
      where: { id: { in: problems.map(problem => problem.id) }, NOT: { completedAt: null } },
    })

    console.log({ completedProgresses })

    return problems

    // return problems.map(problem => ({...problem, completedCount: completedProgresses.find(progress => progress.) }));
  }

  async getProblemBySlug(
    slug: string,
    templateName?: string,
    authenticatedUserId?: string,
  ) {
    const [problem, templates, template, completedCount] =
      await this.prisma.$transaction([
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
          },
        }),
        this.prisma.solution.groupBy({
          by: ["problemId"],
          orderBy: {},
          where: { problem: { slug }, NOT: { completedAt: null } },
        }),
      ]);

    const solution = await this.prisma.solution.findFirst({
      where: {
        problemId: problem?.id,
        templateId: template?.id,
        userId: authenticatedUserId,
      },
      include: {
        files: true,
      },
    });

    const completedAt =
      (solution?.completedAt as string | null)?.toString() ?? null;

    return {
      ...problem,
      template,
      solution: {
        ...solution,
        completedAt,
      },
      completedCount: completedCount.length,
      problemTemplates: templates as unknown as TemplateWithStarterFiles[],
    };
  }

  async getSingleProblemSet(slug: string) {
    return this.prisma.problemSet.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        icon: true,
        name: true,
        longDescription: true,
        shortDescription: true,
        slug: true,
        _count: {
          select: {
            problems: true,
          },
        },
      },
    });
  }

  async getAllProblemSets() {
    return this.prisma.problemSet.findMany({
      select: {
        id: true,
        icon: true,
        name: true,
        slug: true,
        shortDescription: true,
        _count: {
          select: {
            problems: true,
          },
        },
      },
    });
  }
}

export const databaseService = new DatabaseService(prisma);

export type SelectedAllProblemSets = NonNullable<
  Awaited<ReturnType<typeof databaseService.getAllProblemSets>>
>;

export type TemplateWithStarterFiles = Template & {
  starterFiles: File[];
  solutionFiles: File[];
};

export type ProblemWithTemplate = NonNullable<
  Awaited<ReturnType<typeof databaseService.getProblemBySlug>>
>;
