import Link from "next/link";
import type { WealthHealthScore } from "@idbi/types";

const BAND_LABELS: Record<WealthHealthScore["band"], string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  needs_attention: "Needs attention",
};

/** ResponsiveWealthHealthCard: score ring + text summary (charts never rely on
 *  the visual alone — F117). */
export function WealthHealthCard({ wealthHealth }: { wealthHealth: WealthHealthScore }) {
  const { score, band, summary } = wealthHealth;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <section
      aria-label="Wealth health"
      className="flex items-center gap-4 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
    >
      <svg
        viewBox="0 0 88 88"
        className="h-24 w-24 shrink-0"
        role="img"
        aria-label={`Wealth health score ${score} out of 100 — ${BAND_LABELS[band]}`}
      >
        <circle cx="44" cy="44" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="44" textAnchor="middle" className="fill-ink text-2xl font-bold">
          {score}
        </text>
        <text x="44" y="60" textAnchor="middle" className="fill-muted text-[10px]">
          / 100
        </text>
      </svg>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm font-semibold">
          Wealth health: <span className="text-primary">{BAND_LABELS[band]}</span>
        </p>
        <p className="text-sm text-muted">{summary}</p>
        <Link href="/wealth-health" className="text-sm font-medium text-primary underline-offset-2">
          See what drives this
        </Link>
      </div>
    </section>
  );
}
