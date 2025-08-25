import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query"], // uncomment if you want to see SQL in dev
  });

if (process.env.NODE_ENV !== "production") (globalForPrisma as any).prisma = prisma;
