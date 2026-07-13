"use client";

import { useEffect } from "react";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import { ErrorState } from "@/components/feedback/error-state";
import { track } from "@/lib/analytics/track";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    track(ANALYTICS_EVENTS.errorShown, { code: error.digest ?? "unhandled", surface: "root" });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl items-center px-4">
      <ErrorState
        title="Something went wrong"
        message="Your money is safe. Please try again — if this keeps happening, we're already looking into it."
        onRetry={reset}
      />
    </div>
  );
}
