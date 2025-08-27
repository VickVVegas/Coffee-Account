// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

/**
 * Singleton do Prisma para evitar múltiplas conexões em dev (Next.js hot reload).
 * Em produção, apenas uma instância é criada.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
