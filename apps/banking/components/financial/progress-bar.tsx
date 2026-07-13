interface ProgressBarProps {
  /** 0–100. */
  value: number;
  label: string;
  /** Bar colour token; meaning is always carried by adjacent text too (F117). */
  tone?: "primary" | "warning";
}

export function ProgressBar({ value, label, tone = "primary" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-border/70"
    >
      <div
        className={tone === "warning" ? "h-full rounded-full bg-warning" : "h-full rounded-full bg-primary"}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
