import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Initialize tRPC
const t = initTRPC.create({
  transformer: superjson,
});

// Export the base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware for protected routes (to be expanded later with authentication)
export const middleware = t.middleware; 