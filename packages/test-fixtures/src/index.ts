/**
 * @idbi/test-fixtures — the shared demo customer (F006).
 * Used by the mock provider adapters/BFF now and by parity tests later (F118):
 * the same fixture must produce identical financial outputs on every surface.
 * All timestamps are fixed so outputs stay deterministic.
 */
import type {
  AdvisoryEvent,
  ConsentSettings,
  CustomerSummary,
  DataSourceStatus,
  DocumentItem,
  FinancialProfile,
  Goal,
  Holding,
  NotificationItem,
  Transaction,
} from "@idbi/types";

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

/** Sources that require Account Aggregator consent (consent gating happens in the BFF, F006). */
export const accountAggregatorSourceIds = ["src-hdfc", "src-cams"] as const;

export const defaultConsent: ConsentSettings = {
  accountAggregator: true,
  analytics: true,
  marketing: false,
};

/** Two months of card/UPI spend (June + July 2026) so month-over-month works. */
export const demoTransactions: Transaction[] = [
  // July 2026
  { id: "t-0701", date: "2026-07-02", description: "BigBasket", amount: 3400, category: "groceries", sourceId: "src-idbi" },
  { id: "t-0702", date: "2026-07-03", description: "BESCOM electricity", amount: 2900, category: "utilities", sourceId: "src-idbi" },
  { id: "t-0703", date: "2026-07-04", description: "Swiggy", amount: 1250, category: "dining", sourceId: "src-idbi" },
  { id: "t-0704", date: "2026-07-05", description: "Uber", amount: 1480, category: "transport", sourceId: "src-hdfc" },
  { id: "t-0705", date: "2026-07-07", description: "Myntra", amount: 4600, category: "shopping", sourceId: "src-hdfc" },
  { id: "t-0706", date: "2026-07-08", description: "Airtel broadband + mobile", amount: 2450, category: "utilities", sourceId: "src-idbi" },
  { id: "t-0707", date: "2026-07-09", description: "Nature's Basket", amount: 2850, category: "groceries", sourceId: "src-idbi" },
  { id: "t-0708", date: "2026-07-10", description: "PVR Cinemas", amount: 1980, category: "entertainment", sourceId: "src-hdfc" },
  { id: "t-0709", date: "2026-07-11", description: "Apollo Pharmacy", amount: 1820, category: "health", sourceId: "src-idbi" },
  { id: "t-0710", date: "2026-07-12", description: "Zomato", amount: 940, category: "dining", sourceId: "src-idbi" },
  { id: "t-0711", date: "2026-07-12", description: "BigBasket", amount: 3150, category: "groceries", sourceId: "src-idbi" },
  { id: "t-0712", date: "2026-07-13", description: "Indian Oil fuel", amount: 2200, category: "transport", sourceId: "src-idbi" },
  // June 2026
  { id: "t-0601", date: "2026-06-03", description: "BigBasket", amount: 3600, category: "groceries", sourceId: "src-idbi" },
  { id: "t-0602", date: "2026-06-05", description: "BESCOM electricity", amount: 3100, category: "utilities", sourceId: "src-idbi" },
  { id: "t-0603", date: "2026-06-07", description: "Amazon", amount: 7800, category: "shopping", sourceId: "src-hdfc" },
  { id: "t-0604", date: "2026-06-10", description: "Swiggy", amount: 1650, category: "dining", sourceId: "src-idbi" },
  { id: "t-0605", date: "2026-06-14", description: "Uber", amount: 1720, category: "transport", sourceId: "src-hdfc" },
  { id: "t-0606", date: "2026-06-18", description: "Nature's Basket", amount: 3050, category: "groceries", sourceId: "src-idbi" },
  { id: "t-0607", date: "2026-06-21", description: "BookMyShow", amount: 2400, category: "entertainment", sourceId: "src-hdfc" },
  { id: "t-0608", date: "2026-06-24", description: "Max Hospital OPD", amount: 2600, category: "health", sourceId: "src-idbi" },
  { id: "t-0609", date: "2026-06-27", description: "Zomato", amount: 1150, category: "dining", sourceId: "src-idbi" },
  { id: "t-0610", date: "2026-06-28", description: "Croma", amount: 5200, category: "shopping", sourceId: "src-hdfc" },
];

export const demoDocuments: DocumentItem[] = [
  { id: "doc-1", name: "Advisory disclosure & terms", type: "disclosure", date: "2026-06-01" },
  { id: "doc-2", name: "Risk profile report", type: "report", date: "2026-06-02" },
  { id: "doc-3", name: "Portfolio statement — June 2026", type: "statement", date: "2026-07-01" },
  { id: "doc-4", name: "Consolidated account statement — Q1 FY27", type: "statement", date: "2026-07-05" },
];

export const demoAdvisoryEvents: AdvisoryEvent[] = [
  { id: "ae-1", date: "2026-06-01", title: "Consent granted", detail: "Account Aggregator data sharing enabled for HDFC Bank and CAMS Mutual Funds." },
  { id: "ae-2", date: "2026-06-02", title: "Risk profile completed", detail: "Assessed as a growth investor based on the six-question questionnaire." },
  { id: "ae-3", date: "2026-06-15", title: "Goals created", detail: "Retirement, home down payment, and children's education goals set up." },
  { id: "ae-4", date: "2026-07-01", title: "Recommendations refreshed", detail: "Emergency fund and portfolio concentration suggestions issued from July data." },
];

export const demoNotifications: NotificationItem[] = [
  { id: "n-1", date: "2026-07-13", title: "New recommendation", body: "Your emergency fund covers about 2.7 months — see how to reach 6.", kind: "recommendation" },
  { id: "n-2", date: "2026-07-12", title: "Data source needs attention", body: "CAMS Mutual Funds hasn't refreshed since 11 July. Values may be out of date.", kind: "alert" },
  { id: "n-3", date: "2026-07-10", title: "Goal milestone", body: "Your retirement corpus crossed ₹15L — you're on track.", kind: "info" },
  { id: "n-4", date: "2026-07-08", title: "July statement ready", body: "Your portfolio statement for June 2026 is available in Documents.", kind: "info" },
];
