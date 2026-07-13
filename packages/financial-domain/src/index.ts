/**
 * @idbi/financial-domain — the single source of financial truth (F004).
 *
 * Pure, deterministic, platform-independent. No I/O, no environment time (time is
 * always passed in), no randomness. A mobile, tablet, or desktop viewport must
 * never produce a different financial outcome from the same customer data — that
 * invariant is enforced by routing every calculation through this package.
 */
import type {
  AllocationAnalysis,
  AllocationSlice,
  FinancialProfile,
  Goal,
  GoalProjection,
  Holding,
  Recommendation,
  RiskAssessment,
  RiskCategory,
  SpendingCategorySummary,
  SpendingSummary,
  Transaction,
  WealthHealthBand,
  WealthHealthPillar,
  WealthHealthScore,
} from "@idbi/types";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

// ---------- Allocation ----------

export function analyzeAllocation(holdings: Holding[]): AllocationAnalysis {
  const total = holdings.reduce((sum, h) => sum + h.value, 0);
  const byClassMap = new Map<string, number>();
  for (const h of holdings) {
    byClassMap.set(h.assetClass, (byClassMap.get(h.assetClass) ?? 0) + h.value);
  }
  const byClass: AllocationSlice[] = [...byClassMap.entries()]
    .map(([assetClass, value]) => ({
      assetClass: assetClass as AllocationSlice["assetClass"],
      value,
      pct: total > 0 ? round1((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const concentrationFlags: string[] = [];
  for (const slice of byClass) {
    if (slice.pct > 60) {
      concentrationFlags.push(
        `${slice.pct}% of your portfolio is in ${slice.assetClass.replace("_", " ")}`,
      );
    }
  }
  for (const h of holdings) {
    if (total > 0 && h.value / total > 0.25) {
      concentrationFlags.push(`${h.name} alone is ${round1((h.value / total) * 100)}% of your portfolio`);
    }
  }
  return { total, byClass, concentrationFlags };
}

// ---------- Goal projection ----------

/**
 * Projects a goal to its target year using monthly compounding.
 * `asOfYear` is injected so results are reproducible (F004: no environment time).
 */
export function projectGoal(goal: Goal, asOfYear: number): GoalProjection {
  const months = Math.max(0, (goal.targetYear - asOfYear) * 12);
  const r = Math.pow(1 + goal.expectedAnnualReturnPct / 100, 1 / 12) - 1;

  const growthFactor = Math.pow(1 + r, months);
  const corpusFuture = goal.currentCorpus * growthFactor;
  const sipFuture = r > 0 ? goal.monthlyContribution * ((growthFactor - 1) / r) : goal.monthlyContribution * months;
  const projectedValue = Math.round(corpusFuture + sipFuture);

  let requiredMonthlyContribution = 0;
  if (months > 0) {
    const gap = goal.targetAmount - corpusFuture;
    requiredMonthlyContribution =
      gap <= 0 ? 0 : Math.ceil(r > 0 ? (gap * r) / (growthFactor - 1) : gap / months);
  }

  const shortfall = Math.max(0, goal.targetAmount - projectedValue);
  // 5% tolerance so rounding and assumption noise doesn't flip the flag.
  const onTrack = projectedValue >= goal.targetAmount * 0.95;
  return { goalId: goal.id, projectedValue, requiredMonthlyContribution, shortfall, onTrack };
}

// ---------- Risk ----------

export function assessRisk(answers: number[]): RiskAssessment {
  if (answers.length === 0) {
    return { score: 1, category: "conservative" };
  }
  const score = round1(answers.reduce((s, a) => s + a, 0) / answers.length);
  let category: RiskCategory;
  if (score < 2) category = "conservative";
  else if (score < 3) category = "balanced";
  else if (score < 4) category = "growth";
  else category = "aggressive";
  return { score, category };
}

// ---------- Spending ----------

function previousMonth(month: string): string {
  const [year, m] = month.split("-").map(Number);
  if (!year || !m) return month;
  return m === 1 ? `${year - 1}-12` : `${year}-${String(m - 1).padStart(2, "0")}`;
}

/**
 * Summarizes spending for `month` ("YYYY-MM", passed in — no environment time)
 * with a month-over-month comparison. Pure and deterministic (F004).
 */
export function summarizeSpending(transactions: Transaction[], month: string): SpendingSummary {
  const prev = previousMonth(month);
  const inMonth = (t: Transaction, m: string) => t.date.startsWith(m);

  const monthTx = transactions.filter((t) => inMonth(t, month));
  const monthTotal = monthTx.reduce((s, t) => s + t.amount, 0);
  const previousMonthTotal = transactions
    .filter((t) => inMonth(t, prev))
    .reduce((s, t) => s + t.amount, 0);

  const byCategoryMap = new Map<string, number>();
  for (const t of monthTx) {
    byCategoryMap.set(t.category, (byCategoryMap.get(t.category) ?? 0) + t.amount);
  }
  const byCategory: SpendingCategorySummary[] = [...byCategoryMap.entries()]
    .map(([category, total]) => ({
      category: category as SpendingCategorySummary["category"],
      total,
      pct: monthTotal > 0 ? round1((total / monthTotal) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const deltaPct =
    previousMonthTotal > 0
      ? round1(((monthTotal - previousMonthTotal) / previousMonthTotal) * 100)
      : 0;

  return { month, monthTotal, previousMonthTotal, deltaPct, byCategory };
}

// ---------- Wealth health ----------

export interface WealthHealthInput {
  profile: FinancialProfile;
  holdings: Holding[];
  goals: Goal[];
  projections: GoalProjection[];
}

const PILLAR_WEIGHTS = {
  savings_rate: 0.25,
  emergency_fund: 0.2,
  diversification: 0.2,
  debt_load: 0.15,
  goal_funding: 0.2,
} as const;

export function computeWealthHealth(input: WealthHealthInput): WealthHealthScore {
  const { profile, holdings, goals, projections } = input;

  // Savings rate: 30%+ of income saved scores full marks.
  const savings = profile.monthlyIncome - profile.monthlyExpenses - profile.monthlyEmi;
  const savingsRateScore = profile.monthlyIncome > 0 ? clamp01(savings / profile.monthlyIncome / 0.3) : 0;

  // Emergency fund: 6 months of expenses scores full marks.
  const monthlyOutgo = profile.monthlyExpenses + profile.monthlyEmi;
  const emergencyMonths = monthlyOutgo > 0 ? profile.liquidSavings / monthlyOutgo : 0;
  const emergencyScore = clamp01(emergencyMonths / 6);

  // Diversification: normalized Herfindahl index across asset classes.
  const { byClass } = analyzeAllocation(holdings);
  let diversificationScore = 0;
  if (byClass.length > 1) {
    const hhi = byClass.reduce((s, c) => s + Math.pow(c.pct / 100, 2), 0);
    const minHhi = 1 / byClass.length;
    diversificationScore = clamp01(1 - (hhi - minHhi) / (1 - minHhi));
  } else if (byClass.length === 1) {
    diversificationScore = 0.2; // a single asset class is heavily penalized, not zeroed
  }

  // Debt load: EMIs at 40%+ of income score zero.
  const debtRatio = profile.monthlyIncome > 0 ? profile.monthlyEmi / profile.monthlyIncome : 1;
  const debtScore = clamp01(1 - debtRatio / 0.4);

  // Goal funding: average funded ratio of projected vs target.
  let goalScore = 0.5; // neutral when no goals are set yet
  if (goals.length > 0) {
    const ratios = goals.map((g) => {
      const p = projections.find((pr) => pr.goalId === g.id);
      return p && g.targetAmount > 0 ? clamp01(p.projectedValue / g.targetAmount) : 0;
    });
    goalScore = ratios.reduce((s, v) => s + v, 0) / ratios.length;
  }

  const pillars: WealthHealthPillar[] = [
    { id: "savings_rate", label: "Savings rate", score: Math.round(savingsRateScore * 100), weight: PILLAR_WEIGHTS.savings_rate },
    { id: "emergency_fund", label: "Emergency fund", score: Math.round(emergencyScore * 100), weight: PILLAR_WEIGHTS.emergency_fund },
    { id: "diversification", label: "Diversification", score: Math.round(diversificationScore * 100), weight: PILLAR_WEIGHTS.diversification },
    { id: "debt_load", label: "Debt load", score: Math.round(debtScore * 100), weight: PILLAR_WEIGHTS.debt_load },
    { id: "goal_funding", label: "Goal funding", score: Math.round(goalScore * 100), weight: PILLAR_WEIGHTS.goal_funding },
  ];

  const score = Math.round(pillars.reduce((s, p) => s + p.score * p.weight, 0));
  const band: WealthHealthBand =
    score >= 80 ? "excellent" : score >= 65 ? "good" : score >= 50 ? "fair" : "needs_attention";

  const weakest = [...pillars].sort((a, b) => a.score - b.score)[0];
  const bandText: Record<WealthHealthBand, string> = {
    excellent: "Your finances are in excellent shape.",
    good: "Your finances are in good shape.",
    fair: "Your finances are on a fair footing.",
    needs_attention: "Your finances need attention.",
  };
  const summary = weakest
    ? `${bandText[band]} The biggest opportunity is your ${weakest.label.toLowerCase()}.`
    : bandText[band];

  return { score, band, pillars, summary };
}

// ---------- Recommendations ----------

export interface RecommendationSnapshot {
  profile: FinancialProfile;
  wealthHealth: WealthHealthScore;
  allocation: AllocationAnalysis;
  goals: Goal[];
  projections: GoalProjection[];
}

const formatInr = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

/**
 * Deterministic, evidence-backed recommendations derived from computed metrics.
 * Interim home for recommendation logic until services/recommendation-engine
 * exists (F004) — the shared-source parity rule applies either way.
 */
export function deriveBasicRecommendations(snapshot: RecommendationSnapshot): Recommendation[] {
  const { profile, wealthHealth, allocation, goals, projections } = snapshot;
  const recs: Recommendation[] = [];

  const emergency = wealthHealth.pillars.find((p) => p.id === "emergency_fund");
  if (emergency && emergency.score < 60) {
    const monthlyOutgo = profile.monthlyExpenses + profile.monthlyEmi;
    const covered = monthlyOutgo > 0 ? round1(profile.liquidSavings / monthlyOutgo) : 0;
    recs.push({
      id: "rec-emergency-fund",
      title: "Build your emergency fund",
      rationale: "A six-month cushion protects your goals from surprises.",
      category: "savings",
      evidence: [
        `Your liquid savings cover about ${covered} months of outgoings; the target is 6.`,
        `Monthly outgoings: ${formatInr(monthlyOutgo)}.`,
      ],
      priority: 1,
    });
  }

  if (allocation.concentrationFlags.length > 0) {
    recs.push({
      id: "rec-diversify",
      title: "Reduce portfolio concentration",
      rationale: "Spreading investments across asset classes lowers the impact of any single market fall.",
      category: "investment",
      evidence: allocation.concentrationFlags,
      priority: 2,
    });
  }

  for (const projection of projections.filter((p) => !p.onTrack)) {
    const goal = goals.find((g) => g.id === projection.goalId);
    if (!goal) continue;
    const extra = Math.max(0, projection.requiredMonthlyContribution - goal.monthlyContribution);
    recs.push({
      id: `rec-goal-${goal.id}`,
      title: `Increase your SIP for “${goal.name}”`,
      rationale: "At the current contribution this goal is projected to fall short.",
      category: "goal",
      evidence: [
        `Projected: ${formatInr(projection.projectedValue)} vs target ${formatInr(goal.targetAmount)} by ${goal.targetYear}.`,
        `Adding about ${formatInr(extra)} per month closes the gap.`,
      ],
      priority: 3,
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "rec-on-track",
      title: "You're on track — review yearly",
      rationale: "Your savings, protection, and goals look healthy. An annual review keeps them that way.",
      category: "savings",
      evidence: [`Wealth health score: ${wealthHealth.score}/100 (${wealthHealth.band.replace("_", " ")}).`],
      priority: 9,
    });
  }

  return recs.sort((a, b) => a.priority - b.priority);
}
