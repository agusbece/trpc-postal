import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "../db";

export const addressRouter = router({
  // Get all addresses
  getAll: publicProcedure.query(async () => {
    return prisma.address.findMany();
  }),

  // Get an address by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.address.findUnique({
        where: { id: input.id },
      });
    }),

  // Create a new address
  create: publicProcedure
    .input(
      z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.address.create({
        data: input,
      });
    }),

  // Update an address
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.address.update({
        where: { id },
        data,
      });
    }),

  // Delete an address
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.address.delete({
        where: { id: input.id },
      });
    }),
}); 