import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["info", "error", "query"],
  });
};

export type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
