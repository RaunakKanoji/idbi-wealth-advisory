"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, SpendingCategory, SpendingData } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { ProgressBar } from "@/components/financial/progress-bar";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatDay, formatInr, formatInrCompact } from "@/lib/formatting/format";

const CATEGORY_LABELS: Record<SpendingCategory, string> = {
  groceries: "Groceries",
  dining: "Dining out",
  transport: "Transport",
  utilities: "Utilities",
  entertainment: "Entertainment",
  shopping: "Shopping",
  health: "Health",
  other: "Other",
};

export function SpendingScreen() {
  useScreenView("spending");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["spending"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<SpendingData>>("/api/spending", { signal }),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading spending</span>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load your spending"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const { summary, transactions } = data.data;
  const monthLabel = new Date(`${summary.month}-01T00:00:00Z`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const fell = summary.deltaPct <= 0;

  return (
    <div className="flex flex-col gap-5 py-5">
      <section className="flex flex-col gap-1 rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)">
        <p className="text-xs text-muted">Spent in {monthLabel}</p>
        <p className="text-3xl font-bold">{formatInr(summary.monthTotal)}</p>
        <p className={fell ? "text-sm font-medium text-positive" : "text-sm font-medium text-warning"}>
          {fell ? "▼" : "▲"} {Math.abs(summary.deltaPct)}% vs last month (
          {formatInrCompact(summary.previousMonthTotal)})
        </p>
      </section>

      <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:items-start">
      <section aria-label="Spending by category" className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted">Where it went</h2>
        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4">
          {summary.byCategory.map((entry) => (
            <div key={entry.category} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{CATEGORY_LABELS[entry.category]}</span>
                <span>
                  <span className="font-semibold">{formatInrCompact(entry.total)}</span>{" "}
                  <span className="text-muted">· {entry.pct}%</span>
                </span>
              </div>
              <ProgressBar
                value={entry.pct}
                label={`${CATEGORY_LABELS[entry.category]}: ${entry.pct}% of this month's spend`}
              />
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Recent transactions" className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted">This month's transactions</h2>
        <ul className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
          {transactions.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t.description}</p>
                <p className="text-xs text-muted">
                  {formatDay(t.date)} · {CATEGORY_LABELS[t.category]}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold">{formatInr(t.amount)}</p>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </div>
  );
}
