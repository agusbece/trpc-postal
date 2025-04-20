import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "../db";

export const userRouter = router({
  // Get all users
  getAll: publicProcedure.query(async () => {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // Get a user by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.user.findUnique({
        where: { id: input.id },
        include: {
          packages: true,
        },
      });
    }),

  // Create a new user
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        role: z.string()
          .refine(val => ["USER", "ADMIN", "DELIVERY_PERSON"].includes(val), {
            message: "Role must be one of: USER, ADMIN, DELIVERY_PERSON"
          })
          .optional()
      })
    )
    .mutation(async ({ input }) => {
      return prisma.user.create({
        data: input,
      });
    }),

  // Update a user
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email().optional(),
        name: z.string().optional(),
        role: z.string()
          .refine(val => ["USER", "ADMIN", "DELIVERY_PERSON"].includes(val), {
            message: "Role must be one of: USER, ADMIN, DELIVERY_PERSON"
          })
          .optional()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.user.update({
        where: { id },
        data,
      });
    }),

  // Delete a user
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.user.delete({
        where: { id: input.id },
      });
    }),
}); 