"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, OverviewData } from "@idbi/types";
import { DataSourceStatusList } from "@/components/financial/data-source-status";
import { MetricCard } from "@/components/financial/metric-card";
import { RecommendationCard } from "@/components/financial/recommendation-card";
import { WealthHealthCard } from "@/components/financial/wealth-health-card";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { api } from "@/lib/api/client";
import { useScreenView } from "@/lib/analytics/track";

export default function OverviewPage() {
  useScreenView("overview");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["overview"],
    // react-query's signal flows into the shared client → requests cancel on
    // navigation and time out with explicit UX (F005/F111).
    queryFn: ({ signal }) => api.get<ApiEnvelope<OverviewData>>("/api/overview", { signal }),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-5 py-5" aria-busy="true">
        <span className="sr-only">Loading your dashboard</span>
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load your dashboard"
          message="Check your connection and try again. Your data is safe."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const { customer, wealthHealth, netWorth, monthlySavings, portfolioValue, topRecommendations } =
    data.data;

  return (
    <div className="flex flex-col gap-6 py-5">
      <h2 className="text-2xl font-bold">Hello, {customer.firstName}</h2>

      <WealthHealthCard wealthHealth={wealthHealth} />

      <section aria-label="Your money" className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted">Your money</h2>
        {/* No more than three primary metrics in one visible group (F106). */}
        <div className="grid grid-cols-3 gap-2">
          <MetricCard label="Net worth" value={netWorth} />
          <MetricCard label="Portfolio" value={portfolioValue} />
          <MetricCard label="Saved / month" value={monthlySavings} />
        </div>
      </section>

      <section aria-label="Top recommendations" className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted">Top recommendations</h2>
        {/* At most three on the overview; full list lives on /recommendations (F106). */}
        <div className="flex flex-col gap-3">
          {topRecommendations.slice(0, 3).map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </section>

      <DataSourceStatusList sources={data.sources} />
    </div>
  );
}
