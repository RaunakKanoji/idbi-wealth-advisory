"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, WealthHealthPillarId, WealthHealthScore } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { ProgressBar } from "@/components/financial/progress-bar";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";

const PILLAR_EXPLANATIONS: Record<WealthHealthPillarId, string> = {
  savings_rate: "How much of your income you keep each month. Saving 30% scores full marks.",
  emergency_fund: "How many months of outgoings your liquid savings cover. The target is 6 months.",
  diversification: "How spread out your investments are across asset classes.",
  debt_load: "How much of your income goes to EMIs. Above 40% scores zero.",
  goal_funding: "How fully your goals are funded by their current projections.",
};

const BAND_LABELS: Record<WealthHealthScore["band"], string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  needs_attention: "Needs attention",
};

export function WealthHealthScreen() {
  useScreenView("wealth_health");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["wealth-health"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<WealthHealthScore>>("/api/wealth-health", { signal }),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading wealth health</span>
        <Skeleton className="h-24 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load your wealth health"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const { score, band, summary, pillars } = data.data;

  return (
    <div className="flex flex-col gap-5 py-5">
      <section className="flex flex-col gap-1 rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)">
        <p className="text-4xl font-bold">
          {score}
          <span className="text-lg font-medium text-muted"> / 100</span>
        </p>
        <p className="text-sm font-semibold text-primary">{BAND_LABELS[band]}</p>
        <p className="text-sm text-muted">{summary}</p>
      </section>

      <section aria-label="Score pillars" className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted">What drives your score</h2>
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-4"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold">{pillar.label}</h3>
              <p className="text-sm font-bold">
                {pillar.score}
                <span className="font-normal text-muted">/100</span>
              </p>
            </div>
            <ProgressBar
              value={pillar.score}
              label={`${pillar.label}: ${pillar.score} out of 100`}
              tone={pillar.score < 50 ? "warning" : "primary"}
            />
            <p className="text-xs text-muted">
              {PILLAR_EXPLANATIONS[pillar.id]} Counts for {Math.round(pillar.weight * 100)}% of your score.
            </p>
          </div>
        ))}
      </section>

      <Link href="/copilot" className="flex min-h-11 items-center text-sm font-medium text-primary">
        Ask the Copilot what to improve first
      </Link>
    </div>
  );
}
