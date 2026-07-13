"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/feedback/skeleton";
import { useAuth } from "@/providers/auth-provider";

/**
 * Gates all (banking) routes (F007): signed-out users are redirected to sign-in
 * with a return path; no authenticated content flashes while the session resolves.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "signed-out") {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status !== "signed-in") {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-4 px-4 pt-6" aria-busy="true">
        <span className="sr-only">Checking your session</span>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
