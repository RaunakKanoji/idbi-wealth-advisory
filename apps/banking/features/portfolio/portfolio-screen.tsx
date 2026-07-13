"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, AssetClass, PortfolioData } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { ProgressBar } from "@/components/financial/progress-bar";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatInr, formatInrCompact } from "@/lib/formatting/format";

const CLASS_LABELS: Record<AssetClass, string> = {
  equity: "Equity",
  debt: "Debt",
  gold: "Gold",
  cash: "Cash & deposits",
  real_estate: "Real estate",
};

export function PortfolioScreen() {
  useScreenView("portfolio");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["portfolio"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<PortfolioData>>("/api/portfolio", { signal }),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading portfolio</span>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load your portfolio"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const { allocation, holdings } = data.data;

  return (
    <div className="flex flex-col gap-5 py-5">
      <section className="rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)">
        <p className="text-xs text-muted">Total portfolio value</p>
        <p className="text-3xl font-bold">{formatInr(allocation.total)}</p>
      </section>

      {allocation.concentrationFlags.length > 0 ? (
        <section
          aria-label="Concentration warnings"
          className="flex flex-col gap-1 rounded-(--radius-card) bg-warning-soft p-4"
        >
          <h2 className="text-sm font-semibold text-warning">Worth watching</h2>
          {allocation.concentrationFlags.map((flag) => (
            <p key={flag} className="text-sm text-warning">
              {flag}
            </p>
          ))}
        </section>
      ) : null}

      <section aria-label="Asset allocation" className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted">How it's invested</h2>
        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4">
          {allocation.byClass.map((slice) => (
            <div key={slice.assetClass} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{CLASS_LABELS[slice.assetClass]}</span>
                <span>
                  <span className="font-semibold">{slice.pct}%</span>{" "}
                  <span className="text-muted">· {formatInrCompact(slice.value)}</span>
                </span>
              </div>
              <ProgressBar value={slice.pct} label={`${CLASS_LABELS[slice.assetClass]}: ${slice.pct}%`} />
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Holdings" className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted">Holdings</h2>
        <ul className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
          {holdings.map((holding) => (
            <li key={holding.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{holding.name}</p>
                <p className="text-xs text-muted">{CLASS_LABELS[holding.assetClass]}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold">{formatInrCompact(holding.value)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
