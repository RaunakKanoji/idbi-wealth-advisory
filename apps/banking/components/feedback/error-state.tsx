"use client";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

/** Explicit error UX (F005/F111) — errors never present as endless spinners. */
export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex w-full flex-col items-start gap-3 rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)"
    >
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-sm text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="flex min-h-11 items-center rounded-(--radius-control) bg-primary px-5 text-sm font-semibold text-white active:bg-primary-strong"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
