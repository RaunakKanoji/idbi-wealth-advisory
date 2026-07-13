import {
  analyzeAllocation,
  computeWealthHealth,
  deriveBasicRecommendations,
  projectGoal,
} from "@idbi/financial-domain";
import {
  accountAggregatorSourceIds,
  demoCustomer,
  demoGoals,
  demoHoldings,
  demoProfile,
  demoSources,
} from "@idbi/test-fixtures";
import type {
  AllocationAnalysis,
  ConsentSettings,
  CustomerSummary,
  DataSourceStatus,
  FinancialProfile,
  Goal,
  GoalProjection,
  Holding,
  Recommendation,
  WealthHealthScore,
} from "@idbi/types";
import { demoStore } from "@/lib/api/store";

export interface CustomerSnapshot {
  customer: CustomerSummary;
  profile: FinancialProfile;
  consent: ConsentSettings;
  holdings: Holding[];
  goals: Goal[];
  projections: GoalProjection[];
  allocation: AllocationAnalysis;
  wealthHealth: WealthHealthScore;
  recommendations: Recommendation[];
  sources: DataSourceStatus[];
}

const aaSourceIds = new Set<string>(accountAggregatorSourceIds);

/**
 * Server-side only. The one place BFF routes assemble customer data: mock
 * providers (F006) + demo-store overrides + the financial domain engine (F004).
 * Consent is enforced HERE, not in the UI (mobile-web-parity rule): withdrawing
 * Account Aggregator consent removes AA holdings and marks AA sources
 * unavailable, and every downstream number recomputes accordingly.
 */
export function buildCustomerSnapshot(): CustomerSnapshot {
  const consent = demoStore.consent;
  const profile = demoStore.profileOverride ?? demoProfile;

  const holdings = consent.accountAggregator
    ? demoHoldings
    : demoHoldings.filter((h) => !aaSourceIds.has(h.sourceId));
  const sources = demoSources.map((source) =>
    !consent.accountAggregator && aaSourceIds.has(source.id)
      ? { ...source, status: "unavailable" as const }
      : source,
  );

  const goals = [...demoGoals, ...demoStore.extraGoals];
  const asOfYear = new Date().getFullYear();
  const projections = goals.map((goal) => projectGoal(goal, asOfYear));
  const allocation = analyzeAllocation(holdings);
  const wealthHealth = computeWealthHealth({ profile, holdings, goals, projections });
  const recommendations = deriveBasicRecommendations({
    profile,
    wealthHealth,
    allocation,
    goals,
    projections,
  });

  return {
    customer: demoCustomer,
    profile,
    consent,
    holdings,
    goals,
    projections,
    allocation,
    wealthHealth,
    recommendations,
    sources,
  };
}

export function envelope<T>(data: T, sources: DataSourceStatus[] = demoSources) {
  return { data, asOf: new Date().toISOString(), sources };
}
