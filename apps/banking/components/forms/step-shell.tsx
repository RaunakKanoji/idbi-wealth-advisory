"use client";

import { useEffect } from "react";
import { ProgressBar } from "@/components/financial/progress-bar";

interface StepShellProps {
  step: number; // 1-based
  total: number;
  title: string;
  children: React.ReactNode;
  onBack: (() => void) | null;
  onContinue: () => void;
  continueLabel?: string;
  busy?: boolean;
  /** Step-level error summary, announced assertively (F109). */
  error?: string | null;
}

/**
 * Mobile step-form chrome (F109): one subject per step, visible progress,
 * back/continue in a sticky keyboard-safe bar, error summary, and a
 * confirmation prompt before the page is abandoned mid-flow.
 */
export function StepShell({
  step,
  total,
  title,
  children,
  onBack,
  onContinue,
  continueLabel = "Continue",
  busy = false,
  error,
}: StepShellProps) {
  // Confirm before abandoning material changes (browser/tab close).
  useEffect(() => {
    if (step === 1) return;
    const guard = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [step]);

  return (
    <div className="flex min-h-full flex-col gap-4 py-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted">
          Step {step} of {total}
        </p>
        <ProgressBar value={(step / total) * 100} label={`Step ${step} of ${total}`} />
      </div>

      <h2 className="text-xl font-bold">{title}</h2>

      <div className="flex flex-1 flex-col gap-4">{children}</div>

      {error ? (
        <p role="alert" className="rounded-(--radius-control) bg-warning-soft px-4 py-3 text-sm text-warning">
          {error}
        </p>
      ) : null}

      <div className="sticky-above-nav z-30 -mx-4 flex gap-2 border-t border-border bg-background px-4 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-12 flex-1 items-center justify-center rounded-(--radius-control) border border-border bg-surface text-sm font-semibold"
          >
            Back
          </button>
        ) : null}
        <button
          type="button"
          onClick={onContinue}
          disabled={busy}
          className="flex min-h-12 flex-[2] items-center justify-center rounded-(--radius-control) bg-primary text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : continueLabel}
        </button>
      </div>
    </div>
  );
}
