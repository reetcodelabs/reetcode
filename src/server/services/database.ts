import type { Prisma,PrismaClient } from "@prisma/client";

import { db } from "@/server/db";

export class DatabaseService {
  constructor(private prisma: PrismaClient) {}

  async getAllProblems(filters?: Prisma.ProblemFindManyArgs["where"]) {
    const problems = await this.prisma.problem.findMany({
      where: filters,
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
    });

    return problems;
  }
}

export const databaseService = new DatabaseService(db);
