import {
  analyzeAllocation,
  computeWealthHealth,
  deriveBasicRecommendations,
  projectGoal,
} from "@idbi/financial-domain";
import {
  demoCustomer,
  demoGoals,
  demoHoldings,
  demoProfile,
  demoSources,
} from "@idbi/test-fixtures";
import type {
  AllocationAnalysis,
  CustomerSummary,
  DataSourceStatus,
  FinancialProfile,
  Goal,
  GoalProjection,
  Holding,
  Recommendation,
  WealthHealthScore,
} from "@idbi/types";

export interface CustomerSnapshot {
  customer: CustomerSummary;
  profile: FinancialProfile;
  holdings: Holding[];
  goals: Goal[];
  projections: GoalProjection[];
  allocation: AllocationAnalysis;
  wealthHealth: WealthHealthScore;
  recommendations: Recommendation[];
  sources: DataSourceStatus[];
}

/**
 * Server-side only. The one place BFF routes assemble customer data: mock
 * providers (F006) + the financial domain engine (F004). Every endpoint slices
 * this snapshot, so all screens — and the Copilot — see identical numbers.
 */
export function buildCustomerSnapshot(): CustomerSnapshot {
  const asOfYear = new Date().getFullYear();
  const projections = demoGoals.map((goal) => projectGoal(goal, asOfYear));
  const allocation = analyzeAllocation(demoHoldings);
  const wealthHealth = computeWealthHealth({
    profile: demoProfile,
    holdings: demoHoldings,
    goals: demoGoals,
    projections,
  });
  const recommendations = deriveBasicRecommendations({
    profile: demoProfile,
    wealthHealth,
    allocation,
    goals: demoGoals,
    projections,
  });
  return {
    customer: demoCustomer,
    profile: demoProfile,
    holdings: demoHoldings,
    goals: demoGoals,
    projections,
    allocation,
    wealthHealth,
    recommendations,
    sources: demoSources,
  };
}

export function envelope<T>(data: T, sources: DataSourceStatus[] = demoSources) {
  return { data, asOf: new Date().toISOString(), sources };
}
