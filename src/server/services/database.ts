import type { Prisma, PrismaClient } from "@prisma/client";

import prisma, { type PrismaClientSingleton } from "@/server/prisma";

export class DatabaseService {
  constructor(private prisma: PrismaClientSingleton) {}

  async getAllProblems(filters?: Prisma.ProblemFindManyArgs["where"]) {
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
      },
      cacheStrategy: { ttl: 60 * 60 * 24 }, // cache for 24 hours
    });

    return problems;
  }

  async getProblemBySlug(slug: string) {
    const [problem, templates] = await this.prisma.$transaction([
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
            },
          },
        },
        cacheStrategy: {
          // ttl: 24 * 60 * 60, // 24 hours cache strategy.
          ttl: 0, // 0 hours cache strategy (invalidate cache).
        },
      }),
      this.prisma.template.findMany({
        where: {
          problem: {
            slug,
          },
        },
        cacheStrategy: {
          // ttl: 24 * 60 * 60, // 24 hours cache strategy.
          ttl: 0, // 0 hours cache strategy (invalidate cache).
        },
      }),
    ]);

    type TemplateWithStarterFiles = NonNullable<typeof problem>["templates"][0];

    return {
      ...problem,
      problemTemplates: templates as unknown as TemplateWithStarterFiles[],
    };
  }
}

export const databaseService = new DatabaseService(prisma);

export type ProblemWithTemplate = NonNullable<
  Awaited<ReturnType<typeof databaseService.getProblemBySlug>>
>;
