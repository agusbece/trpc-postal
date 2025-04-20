import { router } from "../trpc";
import { packageRouter } from "./package";
import { userRouter } from "./user";
import { addressRouter } from "./address";

export const appRouter = router({
  package: packageRouter,
  user: userRouter,
  address: addressRouter,
});

export type AppRouter = typeof appRouter; 