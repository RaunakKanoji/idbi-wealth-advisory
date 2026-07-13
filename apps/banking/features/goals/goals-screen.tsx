"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, GoalsData } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { ProgressBar } from "@/components/financial/progress-bar";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatInr, formatInrCompact } from "@/lib/formatting/format";

export function GoalsScreen() {
  useScreenView("goals");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["goals"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<GoalsData>>("/api/goals", { signal }),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading goals</span>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load your goals"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const { goals, projections } = data.data;

  return (
    <div className="flex flex-col gap-4 py-5">
      <div className="flex justify-end">
        <Link
          href="/goals/new"
          className="flex min-h-11 items-center rounded-(--radius-control) bg-primary px-5 text-sm font-semibold text-white"
        >
          Add goal
        </Link>
      </div>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start">
      {goals.map((goal) => {
        const projection = projections.find((p) => p.goalId === goal.id);
        if (!projection) return null;
        const fundedPct = goal.targetAmount > 0 ? (projection.projectedValue / goal.targetAmount) * 100 : 0;
        const extraMonthly = Math.max(
          0,
          projection.requiredMonthlyContribution - goal.monthlyContribution,
        );
        return (
          <article
            key={goal.id}
            className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-semibold">{goal.name}</h2>
                <p className="text-xs text-muted">
                  Target {formatInrCompact(goal.targetAmount)} by {goal.targetYear}
                </p>
              </div>
              {projection.onTrack ? (
                <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-positive">
                  On track
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">
                  Falling short
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <ProgressBar
                value={fundedPct}
                label={`${goal.name}: projected to reach ${Math.round(fundedPct)}% of target`}
                tone={projection.onTrack ? "primary" : "warning"}
              />
              <p className="text-xs text-muted">
                Projected {formatInrCompact(projection.projectedValue)} of{" "}
                {formatInrCompact(goal.targetAmount)} ({Math.round(fundedPct)}%)
              </p>
            </div>

            <dl className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Investing now</dt>
                <dd className="font-medium">{formatInr(goal.monthlyContribution)}/month</dd>
              </div>
              {!projection.onTrack ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">To close the gap</dt>
                  <dd className="font-semibold text-warning">+{formatInr(extraMonthly)}/month</dd>
                </div>
              ) : null}
            </dl>
          </article>
        );
      })}
      </div>
      <p className="text-xs text-muted">
        Projections assume each goal's expected return, compounded monthly. Try what-if changes in
        the Simulator without touching your real goals.
      </p>
    </div>
  );
}
