import type { CopilotAnswer } from "@idbi/types";
import type { CustomerSnapshot } from "@/lib/api/snapshot";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/**
 * Deterministic Copilot for the hackathon (Phase 2 baseline): keyword intents
 * answered from the same customer snapshot every screen uses, so the Copilot can
 * never quote a different number than the dashboard. The conversational-ai
 * service (LLM tools + guardrails) replaces the matching, not the data source.
 */
export function answerQuestion(question: string, snapshot: CustomerSnapshot): CopilotAnswer {
  const q = question.toLowerCase();
  const { profile, wealthHealth, allocation, goals, projections, recommendations } = snapshot;

  if (/(health|score|shape|healthy)/.test(q)) {
    const weakest = [...wealthHealth.pillars].sort((a, b) => a.score - b.score)[0];
    return {
      intent: "wealth_health",
      reply:
        `Your wealth health score is ${wealthHealth.score}/100 — ${wealthHealth.band.replace("_", " ")}. ` +
        `${wealthHealth.summary}` +
        (weakest ? ` Your ${weakest.label.toLowerCase()} pillar scores ${weakest.score}/100.` : ""),
    };
  }

  if (/(emergency|cushion|rainy)/.test(q)) {
    const outgo = profile.monthlyExpenses + profile.monthlyEmi;
    const months = outgo > 0 ? Math.round((profile.liquidSavings / outgo) * 10) / 10 : 0;
    return {
      intent: "emergency_fund",
      reply:
        `You hold ${inr.format(profile.liquidSavings)} in liquid savings — about ${months} months of ` +
        `outgoings (${inr.format(outgo)}/month). The target is 6 months, so aim for ${inr.format(outgo * 6)}.`,
    };
  }

  if (/(goal|track|retire|education|home)/.test(q)) {
    const lines = goals.map((goal) => {
      const p = projections.find((pr) => pr.goalId === goal.id);
      if (!p) return `• ${goal.name}: no projection available.`;
      return p.onTrack
        ? `• ${goal.name}: on track — projected ${inr.format(p.projectedValue)} vs target ${inr.format(goal.targetAmount)} by ${goal.targetYear}.`
        : `• ${goal.name}: falling short by ${inr.format(p.shortfall)} — adding ${inr.format(Math.max(0, p.requiredMonthlyContribution - goal.monthlyContribution))}/month closes the gap.`;
    });
    return { intent: "goals", reply: `Here's where your goals stand:\n${lines.join("\n")}` };
  }

  if (/(portfolio|invest|allocation|equity|debt|gold|diversif)/.test(q)) {
    const mix = allocation.byClass
      .map((slice) => `${slice.assetClass.replace("_", " ")} ${slice.pct}%`)
      .join(", ");
    const flags =
      allocation.concentrationFlags.length > 0
        ? ` One thing to watch: ${allocation.concentrationFlags[0]}.`
        : "";
    return {
      intent: "portfolio",
      reply: `Your ${inr.format(allocation.total)} portfolio is invested as: ${mix}.${flags}`,
    };
  }

  if (/(recommend|should i|next|advice|improve)/.test(q)) {
    const lines = recommendations
      .slice(0, 3)
      .map((rec) => `• ${rec.title} — ${rec.evidence[0] ?? rec.rationale}`);
    return { intent: "recommendations", reply: `Here's what I'd focus on:\n${lines.join("\n")}` };
  }

  if (/(spend|expense)/.test(q)) {
    return {
      intent: "spending_unavailable",
      reply:
        "Spending analysis is coming shortly — for now I can tell you your monthly outgoings are " +
        `${inr.format(profile.monthlyExpenses + profile.monthlyEmi)} against ${inr.format(profile.monthlyIncome)} income.`,
    };
  }

  return {
    intent: "capabilities",
    reply:
      "I can explain your wealth health score, your emergency fund, whether your goals are on track, " +
      "how your portfolio is invested, and what I'd recommend next. What would you like to know?",
  };
}
