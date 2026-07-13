"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, Recommendation } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";

const CATEGORY_LABELS: Record<Recommendation["category"], string> = {
  savings: "Savings",
  investment: "Investment",
  protection: "Protection",
  goal: "Goal",
};

/** The evidence screen (F106: overview shows headlines; the detail lives here). */
export function RecommendationsScreen() {
  useScreenView("recommendations");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["recommendations"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<Recommendation[]>>("/api/recommendations", { signal }),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading recommendations</span>
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
          title="We couldn't load your recommendations"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-5">
      {data.data.map((recommendation) => (
        <article
          key={recommendation.id}
          className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
        >
          <span className="self-start rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
            {CATEGORY_LABELS[recommendation.category]}
          </span>
          <h2 className="text-base font-semibold">{recommendation.title}</h2>
          <p className="text-sm text-muted">{recommendation.rationale}</p>
          <div className="rounded-(--radius-control) bg-background p-3">
            <h3 className="mb-1 text-xs font-semibold text-muted">Why we're suggesting this</h3>
            <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
              {recommendation.evidence.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
      <p className="text-xs text-muted">
        These suggestions are derived from your connected data and standard planning rules. They are
        educational, not a substitute for personalised advice from a registered adviser.
      </p>
    </div>
  );
}
