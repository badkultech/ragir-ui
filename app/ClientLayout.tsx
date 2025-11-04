"use client";

import { ReduxProvider } from "@/lib/redux-provider";
import HydratedAuth from "@/components/AuthLoader";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <HydratedAuth>
        {children}
        <Toaster />
      </HydratedAuth>
    </ReduxProvider>
  );
}
