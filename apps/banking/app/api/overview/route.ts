import { NextResponse } from "next/server";
import type { OverviewData } from "@idbi/types";
import { buildCustomerSnapshot, envelope } from "@/lib/api/snapshot";

/** Thin BFF (F005): slices the shared snapshot; no calculations here. */
export async function GET() {
  const snapshot = buildCustomerSnapshot();
  const data: OverviewData = {
    customer: snapshot.customer,
    wealthHealth: snapshot.wealthHealth,
    netWorth: snapshot.allocation.total + snapshot.profile.liquidSavings,
    monthlySavings:
      snapshot.profile.monthlyIncome - snapshot.profile.monthlyExpenses - snapshot.profile.monthlyEmi,
    portfolioValue: snapshot.allocation.total,
    topRecommendations: snapshot.recommendations.slice(0, 3),
  };
  return NextResponse.json(envelope(data, snapshot.sources));
}
