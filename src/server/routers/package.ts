import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "../db";

export const packageRouter = router({
  // Get all packages
  getAll: publicProcedure.query(async () => {
    return prisma.package.findMany({
      include: {
        sender: true,
        fromAddress: true,
        toAddress: true,
        events: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // Get a package by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.package.findUnique({
        where: { id: input.id },
        include: {
          sender: true,
          fromAddress: true,
          toAddress: true,
          events: true,
        },
      });
    }),

  // Get a package by tracking number
  getByTrackingNumber: publicProcedure
    .input(z.object({ trackingNumber: z.string() }))
    .query(async ({ input }) => {
      return prisma.package.findUnique({
        where: { trackingNumber: input.trackingNumber },
        include: {
          sender: true,
          fromAddress: true,
          toAddress: true,
          events: {
            orderBy: {
              timestamp: "desc",
            },
          },
        },
      });
    }),

  // Create a new package
  create: publicProcedure
    .input(
      z.object({
        trackingNumber: z.string(),
        weight: z.number(),
        description: z.string().optional(),
        senderId: z.string(),
        fromAddressId: z.string(),
        toAddressId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.package.create({
        data: {
          ...input,
          events: {
            create: {
              status: "PENDING",
              description: "Package registered in the system",
            },
          },
        },
      });
    }),

  // Update a package's status
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string().refine(
          (val) => ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'FAILED'].includes(val),
          {
            message: "Status must be one of: PENDING, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED, FAILED"
          }
        ),
        location: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, status, location, description } = input;
      
      // Update package status
      const updatedPackage = await prisma.package.update({
        where: { id },
        data: {
          status,
          // If status is DELIVERED, set deliveredAt timestamp
          ...(status === "DELIVERED" && { deliveredAt: new Date() }),
        },
      });

      // Create tracking event
      await prisma.trackingEvent.create({
        data: {
          packageId: id,
          status,
          location,
          description,
        },
      });

      return updatedPackage;
    }),

  // Delete a package
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // First delete all related tracking events
      await prisma.trackingEvent.deleteMany({
        where: { packageId: input.id },
      });
      
      // Then delete the package
      return prisma.package.delete({
        where: { id: input.id },
      });
    }),
}); 