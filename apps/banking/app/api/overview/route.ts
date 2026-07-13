import { NextResponse } from "next/server";
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
import type { ApiEnvelope, OverviewData } from "@idbi/types";

/**
 * BFF handler (F005): thin composition of fixtures (mock providers, F006) and the
 * financial domain engine (F004). No calculations live here — extractable to
 * services/api without changing the client contract.
 */
export async function GET() {
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

  const data: OverviewData = {
    customer: demoCustomer,
    wealthHealth,
    netWorth: allocation.total + demoProfile.liquidSavings,
    monthlySavings: demoProfile.monthlyIncome - demoProfile.monthlyExpenses - demoProfile.monthlyEmi,
    portfolioValue: allocation.total,
    topRecommendations: recommendations.slice(0, 3),
  };

  const envelope: ApiEnvelope<OverviewData> = {
    data,
    asOf: new Date().toISOString(),
    sources: demoSources,
  };
  return NextResponse.json(envelope);
}
