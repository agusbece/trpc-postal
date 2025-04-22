'use server';

import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Define the extended client type
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

// Create the prisma client with the adapter extension
function createPrismaClient() {
  const adapter = new PrismaLibSQL({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  return new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  }).$extends({
    client: { driver: adapter }
  });
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

// Initialize Prisma Client with debug logging in development
export const prisma = global.prisma || createPrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
