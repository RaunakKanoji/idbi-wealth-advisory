"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import { track, useScreenView } from "@/lib/analytics/track";
import { useAuth } from "@/providers/auth-provider";

function safeNextPath(raw: string | null): string {
  // Same-origin relative paths only — never redirect off-site.
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/overview";
}

function SignInScreen() {
  const { status, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  useScreenView("sign_in");

  useEffect(() => {
    if (status === "signed-in") router.replace(next);
  }, [status, next, router]);

  const handleSignIn = () => {
    track(ANALYTICS_EVENTS.signinStarted, {});
    signIn();
    track(ANALYTICS_EVENTS.signinCompleted, {});
    router.replace(next);
  };

  return (
    <main className="safe-top safe-bottom mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-6 px-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold tracking-wide text-primary">IDBI BANK</span>
        <h1 className="text-2xl font-bold">Sign in to Wealth Copilot</h1>
        <p className="readable text-sm text-muted">
          This is the hackathon demo environment — you'll be signed in as Ananya Sharma, a fixture
          customer. No real credentials are used or stored.
        </p>
      </div>
      <button
        type="button"
        onClick={handleSignIn}
        className="flex min-h-12 w-full items-center justify-center rounded-(--radius-control) bg-primary px-6 text-base font-semibold text-white active:bg-primary-strong"
      >
        Continue as Ananya (demo)
      </button>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInScreen />
    </Suspense>
  );
}
