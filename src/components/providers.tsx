"use client";

import { CartBootstrap } from "@/hooks/useClientCarts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartBootstrap />
      {children}
    </>
  );
}
