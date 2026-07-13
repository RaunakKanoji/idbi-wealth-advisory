"use client";

import Link from "next/link";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import type { Recommendation } from "@idbi/types";
import { track } from "@/lib/analytics/track";

const CATEGORY_LABELS: Record<Recommendation["category"], string> = {
  savings: "Savings",
  investment: "Investment",
  protection: "Protection",
  goal: "Goal",
};

/** ResponsiveRecommendationCard: one recommendation per card (F106); detailed
 *  evidence lives on the recommendations screen, not inline. */
export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <article className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)">
      <span className="self-start rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
        {CATEGORY_LABELS[recommendation.category]}
      </span>
      <h3 className="text-sm font-semibold">{recommendation.title}</h3>
      <p className="text-sm text-muted">{recommendation.rationale}</p>
      <Link
        href="/recommendations"
        onClick={() =>
          track(ANALYTICS_EVENTS.recommendationViewed, { recommendation_id: recommendation.id })
        }
        className="flex min-h-11 items-center text-sm font-medium text-primary"
      >
        See the evidence
      </Link>
    </article>
  );
}
