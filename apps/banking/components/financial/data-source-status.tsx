import type { DataSourceStatus } from "@idbi/types";
import { formatDay } from "@/lib/formatting/format";

const STATUS_LABELS: Record<DataSourceStatus["status"], string> = {
  fresh: "Up to date",
  stale: "Not refreshed recently",
  unavailable: "Currently unavailable",
};

/** ResponsiveDataSourceStatus: freshness is always stated in text, never colour
 *  alone (F117; honesty about staleness is a resilience requirement, F111). */
export function DataSourceStatusList({ sources }: { sources: DataSourceStatus[] }) {
  return (
    <section aria-label="Connected data sources" className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-muted">Connected sources</h2>
      <ul className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
        {sources.map((source) => (
          <li key={source.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm">{source.name}</p>
              <p className="text-xs text-muted">
                {STATUS_LABELS[source.status]} · as of {formatDay(source.asOf)}
              </p>
            </div>
            {source.status !== "fresh" ? (
              <span className="shrink-0 rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-medium text-warning">
                {source.status === "stale" ? "Stale" : "Offline"}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
