import type { AllocationSlice, AssetClass } from "@idbi/types";
import { cn } from "@/lib/utils/cn";

const CLASS_LABELS: Record<AssetClass, string> = {
  equity: "Equity",
  debt: "Debt",
  gold: "Gold",
  cash: "Cash & deposits",
  real_estate: "Real estate",
};

/** Stable per-class colours; meaning is never colour-only — the adjacent bar
 *  list and this chart's legend both carry direct labels and values (F117). */
const CLASS_COLORS: Record<AssetClass, string> = {
  equity: "var(--color-primary)",
  debt: "#2563eb",
  gold: "#b7791f",
  cash: "#64748b",
  real_estate: "var(--color-accent)",
};

/**
 * ResponsivePortfolioChart (F117): the expanded ≥768px view of the allocation.
 * Mobile keeps the simplified bar list as the primary chart; this donut renders
 * from the same AllocationSlice data — transformations live in the domain
 * engine, never here.
 */
export function AllocationDonut({
  slices,
  className,
}: {
  slices: AllocationSlice[];
  className?: string;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  const summary = slices
    .map((s) => `${CLASS_LABELS[s.assetClass]} ${s.pct}%`)
    .join(", ");

  return (
    <figure className={cn("flex flex-col items-center gap-3", className)}>
      <svg
        viewBox="0 0 100 100"
        className="h-44 w-44"
        role="img"
        aria-label={`Asset allocation: ${summary}`}
      >
        {slices.map((slice) => {
          const length = (slice.pct / 100) * circumference;
          const offset = circumference - accumulated;
          accumulated += length;
          return (
            <circle
              key={slice.assetClass}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={CLASS_COLORS[slice.assetClass]}
              strokeWidth="14"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            />
          );
        })}
      </svg>
      <figcaption>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          {slices.map((slice) => (
            <li key={slice.assetClass} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CLASS_COLORS[slice.assetClass] }}
              />
              {CLASS_LABELS[slice.assetClass]} {slice.pct}%
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
