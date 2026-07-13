/**
 * @idbi/types — shared data models (F003).
 * Platform-independent: no React/DOM imports. All monetary amounts are INR numbers,
 * formatted only at the presentation edge.
 */

// ---------- Customer ----------

export interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
}

export interface FinancialProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyEmi: number;
  liquidSavings: number;
  dependents: number;
}

// ---------- Risk ----------

export type RiskCategory = "conservative" | "balanced" | "growth" | "aggressive";

export interface RiskAssessment {
  score: number; // 1..5 scale average
  category: RiskCategory;
}

// ---------- Portfolio ----------

export type AssetClass = "equity" | "debt" | "gold" | "cash" | "real_estate";

export interface Holding {
  id: string;
  name: string;
  assetClass: AssetClass;
  value: number;
  sourceId: string;
}

export interface AllocationSlice {
  assetClass: AssetClass;
  value: number;
  pct: number; // 0..100, rounded to 1 decimal
}

export interface AllocationAnalysis {
  total: number;
  byClass: AllocationSlice[];
  concentrationFlags: string[];
}

// ---------- Goals ----------

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  targetYear: number;
  currentCorpus: number;
  monthlyContribution: number;
  expectedAnnualReturnPct: number;
}

export interface GoalProjection {
  goalId: string;
  projectedValue: number;
  requiredMonthlyContribution: number;
  shortfall: number; // 0 when on track
  onTrack: boolean;
}

// ---------- Wealth health ----------

export type WealthHealthPillarId =
  | "savings_rate"
  | "emergency_fund"
  | "diversification"
  | "debt_load"
  | "goal_funding";

export interface WealthHealthPillar {
  id: WealthHealthPillarId;
  label: string;
  score: number; // 0..100
  weight: number; // 0..1, weights sum to 1
}

export type WealthHealthBand = "excellent" | "good" | "fair" | "needs_attention";

export interface WealthHealthScore {
  score: number; // 0..100
  band: WealthHealthBand;
  pillars: WealthHealthPillar[];
  summary: string;
}

// ---------- Recommendations ----------

export type RecommendationCategory = "savings" | "investment" | "protection" | "goal";

export interface Recommendation {
  id: string;
  title: string;
  rationale: string;
  category: RecommendationCategory;
  evidence: string[];
  priority: number; // lower = more important
}

// ---------- Data sources / API envelope ----------

export type DataSourceStatusValue = "fresh" | "stale" | "unavailable";

export interface DataSourceStatus {
  id: string;
  name: string;
  status: DataSourceStatusValue;
  asOf: string; // ISO timestamp of last successful sync
}

export interface ApiEnvelope<T> {
  data: T;
  asOf: string;
  sources: DataSourceStatus[];
}

export interface OverviewData {
  customer: CustomerSummary;
  wealthHealth: WealthHealthScore;
  netWorth: number;
  monthlySavings: number;
  portfolioValue: number;
  topRecommendations: Recommendation[];
}

// ---------- Feature payloads ----------

export interface PortfolioData {
  allocation: AllocationAnalysis;
  holdings: Holding[];
}

export interface GoalsData {
  goals: Goal[];
  projections: GoalProjection[];
}

export interface CopilotQuestion {
  question: string;
}

export interface CopilotAnswer {
  reply: string;
  /** Matched intent (for analytics dimension) — e.g. "wealth_health", "goals". */
  intent: string;
}

// ---------- Conversation / avatar ----------

export type AvatarStateName =
  | "greeting"
  | "onboarding"
  | "risk_questionnaire"
  | "conversation_compact"
  | "launcher"
  | "minimized"
  | "static_fallback"
  | "handoff";

export interface ConversationMessage {
  id: string;
  role: "customer" | "copilot";
  text: string;
  at: string; // ISO timestamp
}
