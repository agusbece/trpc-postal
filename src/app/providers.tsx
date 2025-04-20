"use client";

import { TRPCProvider } from "./utils/trpc";

export default function Providers({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <TRPCProvider>{children}</TRPCProvider>;
} 