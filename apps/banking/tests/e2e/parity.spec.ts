import { expect, test } from "@playwright/test";
import type { ApiEnvelope, CopilotAnswer, GoalsData, OverviewData } from "@idbi/types";

/**
 * Parity invariants (F118 / F004): identical inputs → identical financial
 * outputs, and the Copilot can never quote a different number than a screen.
 */

test("the same customer data produces identical outputs on repeated reads", async ({ request }) => {
  const first = (await (await request.get("/api/overview")).json()) as ApiEnvelope<OverviewData>;
  const second = (await (await request.get("/api/overview")).json()) as ApiEnvelope<OverviewData>;
  expect(second.data).toEqual(first.data);
});

test("the copilot quotes exactly the projection the goals API reports", async ({ request }) => {
  const goals = (await (await request.get("/api/goals")).json()) as ApiEnvelope<GoalsData>;
  const retirement = goals.data.projections.find((p) => p.goalId === "g-retirement");
  expect(retirement).toBeDefined();

  const answer = (await (
    await request.post("/api/copilot", { data: { question: "Am I on track for my goals?" } })
  ).json()) as ApiEnvelope<CopilotAnswer>;

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(retirement!.projectedValue);
  expect(answer.data.reply).toContain(formatted);
});

test("wealth health from the API matches the overview payload", async ({ request }) => {
  const overview = (await (await request.get("/api/overview")).json()) as ApiEnvelope<OverviewData>;
  const health = (await (await request.get("/api/wealth-health")).json()) as ApiEnvelope<
    OverviewData["wealthHealth"]
  >;
  expect(health.data).toEqual(overview.data.wealthHealth);
});
