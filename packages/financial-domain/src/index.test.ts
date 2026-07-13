import { describe, expect, it } from "vitest";
import {
  demoGoals,
  demoHoldings,
  demoProfile,
  demoTransactions,
} from "@idbi/test-fixtures";
import {
  analyzeAllocation,
  assessRisk,
  computeWealthHealth,
  deriveBasicRecommendations,
  projectGoal,
  summarizeSpending,
} from "./index";

/**
 * F004 acceptance: the same fixture produces exact, byte-identical outputs.
 * These literals are the parity baseline (F118) — if a calculation changes
 * intentionally, this file changes with it in the same commit.
 */

const asOfYear = 2026;
const projections = demoGoals.map((g) => projectGoal(g, asOfYear));
const allocation = analyzeAllocation(demoHoldings);
const wealthHealth = computeWealthHealth({
  profile: demoProfile,
  holdings: demoHoldings,
  goals: demoGoals,
  projections,
});

describe("projectGoal", () => {
  it("projects the retirement goal on track", () => {
    expect(projections[0]).toEqual({
      goalId: "g-retirement",
      projectedValue: 45236405,
      // Contribution needed to exactly reach the target — below the current
      // ₹25,000/month, which is what makes the goal on-track.
      requiredMonthlyContribution: 11727,
      shortfall: 0,
      onTrack: true,
    });
  });

  it("projects the home goal short with an exact gap", () => {
    expect(projections[1]).toEqual({
      goalId: "g-home",
      projectedValue: 2417832,
      requiredMonthlyContribution: 41171,
      shortfall: 1582168,
      onTrack: false,
    });
  });

  it("projects the education goal short with an exact gap", () => {
    expect(projections[2]).toEqual({
      goalId: "g-education",
      projectedValue: 3566070,
      requiredMonthlyContribution: 12088,
      shortfall: 1433930,
      onTrack: false,
    });
  });
});

describe("analyzeAllocation", () => {
  it("totals and slices the demo portfolio exactly", () => {
    expect(allocation.total).toBe(2_290_000);
    expect(allocation.byClass[0]).toEqual({ assetClass: "equity", value: 1_620_000, pct: 70.7 });
    expect(allocation.concentrationFlags).toHaveLength(2);
  });
});

describe("computeWealthHealth", () => {
  it("scores the demo customer exactly", () => {
    expect(wealthHealth.score).toBe(72);
    expect(wealthHealth.band).toBe("good");
    const weakest = [...wealthHealth.pillars].sort((a, b) => a.score - b.score)[0];
    expect(weakest?.id).toBe("emergency_fund");
  });

  it("is deterministic across runs", () => {
    const again = computeWealthHealth({
      profile: demoProfile,
      holdings: demoHoldings,
      goals: demoGoals,
      projections: demoGoals.map((g) => projectGoal(g, asOfYear)),
    });
    expect(JSON.stringify(again)).toBe(JSON.stringify(wealthHealth));
  });
});

describe("assessRisk", () => {
  it("maps questionnaire answers to a category", () => {
    expect(assessRisk([4, 3, 4, 3, 4, 4])).toEqual({ score: 3.7, category: "growth" });
    expect(assessRisk([1, 1, 1, 1, 1, 1]).category).toBe("conservative");
    expect(assessRisk([5, 5, 5, 5, 5, 5]).category).toBe("aggressive");
  });
});

describe("summarizeSpending", () => {
  it("summarizes July 2026 exactly with a month-over-month delta", () => {
    const summary = summarizeSpending(demoTransactions, "2026-07");
    expect(summary.monthTotal).toBe(29_020);
    expect(summary.previousMonthTotal).toBe(32_270);
    expect(summary.deltaPct).toBe(-10.1);
    expect(summary.byCategory[0]).toEqual({ category: "groceries", total: 9_400, pct: 32.4 });
  });
});

describe("deriveBasicRecommendations", () => {
  it("derives the expected evidence-backed recommendations in priority order", () => {
    const recommendations = deriveBasicRecommendations({
      profile: demoProfile,
      wealthHealth,
      allocation,
      goals: demoGoals,
      projections,
    });
    expect(recommendations.map((r) => r.id)).toEqual([
      "rec-emergency-fund",
      "rec-diversify",
      "rec-goal-g-home",
      "rec-goal-g-education",
    ]);
    for (const rec of recommendations) {
      expect(rec.evidence.length).toBeGreaterThan(0);
    }
  });
});
