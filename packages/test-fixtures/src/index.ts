/**
 * @idbi/test-fixtures — the shared demo customer (F006).
 * Used by the mock provider adapters/BFF now and by parity tests later (F118):
 * the same fixture must produce identical financial outputs on every surface.
 * All timestamps are fixed so outputs stay deterministic.
 */
import type { CustomerSummary, DataSourceStatus, FinancialProfile, Goal, Holding } from "@idbi/types";

export const demoCustomer: CustomerSummary = {
  id: "cust-demo-001",
  firstName: "Ananya",
  lastName: "Sharma",
};

export const demoProfile: FinancialProfile = {
  monthlyIncome: 180_000,
  monthlyExpenses: 95_000,
  monthlyEmi: 22_000,
  liquidSavings: 320_000,
  dependents: 2,
};

export const demoHoldings: Holding[] = [
  { id: "h-eq-mf", name: "Flexi-cap equity fund", assetClass: "equity", value: 850_000, sourceId: "src-cams" },
  { id: "h-index", name: "Nifty 50 index fund", assetClass: "equity", value: 350_000, sourceId: "src-cams" },
  { id: "h-stocks", name: "Direct stocks", assetClass: "equity", value: 420_000, sourceId: "src-hdfc" },
  { id: "h-debt", name: "Short-duration debt fund", assetClass: "debt", value: 300_000, sourceId: "src-cams" },
  { id: "h-fd", name: "IDBI fixed deposit", assetClass: "cash", value: 250_000, sourceId: "src-idbi" },
  { id: "h-gold", name: "Gold ETF", assetClass: "gold", value: 120_000, sourceId: "src-hdfc" },
];

export const demoGoals: Goal[] = [
  {
    id: "g-retirement",
    name: "Retire comfortably",
    targetAmount: 30_000_000,
    targetYear: 2049,
    currentCorpus: 1_500_000,
    monthlyContribution: 25_000,
    expectedAnnualReturnPct: 11,
  },
  {
    id: "g-home",
    name: "Home down payment",
    targetAmount: 4_000_000,
    targetYear: 2031,
    currentCorpus: 600_000,
    monthlyContribution: 20_000,
    expectedAnnualReturnPct: 9,
  },
  {
    id: "g-education",
    name: "Children's education",
    targetAmount: 5_000_000,
    targetYear: 2040,
    currentCorpus: 200_000,
    monthlyContribution: 8_000,
    expectedAnnualReturnPct: 10,
  },
];

/** One stale source is deliberate — freshness UX must be buildable from day one. */
export const demoSources: DataSourceStatus[] = [
  { id: "src-idbi", name: "IDBI Bank", status: "fresh", asOf: "2026-07-13T06:30:00Z" },
  { id: "src-hdfc", name: "HDFC Bank (via Account Aggregator)", status: "fresh", asOf: "2026-07-13T05:45:00Z" },
  { id: "src-cams", name: "CAMS Mutual Funds (via Account Aggregator)", status: "stale", asOf: "2026-07-10T21:15:00Z" },
];
