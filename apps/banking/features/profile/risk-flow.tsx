"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import type { ApiEnvelope, RiskAssessment } from "@idbi/types";
import { ChoiceField } from "@/components/forms/fields";
import { StepShell } from "@/components/forms/step-shell";
import { useFormDraft } from "@/components/forms/use-form-draft";
import { CopilotAvatar } from "@/components/avatar/copilot-avatar";
import { track, useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";

const DRAFT_KEY = "idbi.draft.risk";

/** Six questions, one concept per step (F109). Answers score 1–5. */
const QUESTIONS: { title: string; options: string[] }[] = [
  {
    title: "How long until you'll need most of this money?",
    options: ["Under 2 years", "2–5 years", "5–10 years", "10–20 years", "More than 20 years"],
  },
  {
    title: "Your portfolio falls 20% in a market crash. What do you do?",
    options: ["Sell everything", "Sell some of it", "Wait it out", "Invest a little more", "Invest a lot more"],
  },
  {
    title: "How stable is your income?",
    options: ["Very unstable", "Somewhat unstable", "Average", "Stable", "Very stable"],
  },
  {
    title: "How much investing experience do you have?",
    options: ["None", "A little", "Moderate", "Experienced", "Very experienced"],
  },
  {
    title: "What matters more to you?",
    options: ["Protecting my money", "Mostly protecting", "An even balance", "Mostly growing", "Growing my money"],
  },
  {
    title: "How would you feel about big swings in your portfolio's value?",
    options: ["Very anxious", "Uncomfortable", "Neutral", "Mostly fine", "Comfortable — it's the price of growth"],
  },
];

const CATEGORY_COPY: Record<RiskAssessment["category"], { label: string; description: string }> = {
  conservative: {
    label: "Conservative",
    description: "You value stability. Allocations weighted to debt and deposits, with limited equity, suit you.",
  },
  balanced: {
    label: "Balanced",
    description: "You accept some ups and downs in exchange for moderate long-term growth.",
  },
  growth: {
    label: "Growth",
    description: "You're comfortable with meaningful equity exposure to grow wealth over the long term.",
  },
  aggressive: {
    label: "Aggressive",
    description: "You embrace volatility in pursuit of maximum long-term returns.",
  },
};

export function RiskFlow() {
  useScreenView("risk_questionnaire");
  const queryClient = useQueryClient();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers, clearDraft] = useFormDraft<(number | null)[]>(
    DRAFT_KEY,
    Array(QUESTIONS.length).fill(null),
  );
  const [stepError, setStepError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RiskAssessment | null>(null);

  useEffect(() => {
    track(ANALYTICS_EVENTS.formStarted, { form: "risk_questionnaire" });
  }, []);

  if (result) {
    const copy = CATEGORY_COPY[result.category];
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CopilotAvatar variant="face" className="h-20 w-20" />
        <h2 className="text-xl font-bold">You're a {copy.label.toLowerCase()} investor</h2>
        <p className="readable text-sm text-muted">{copy.description}</p>
        <p className="text-xs text-muted">
          Risk score {result.score} of 5 · This shapes which recommendations are suitable for you.
        </p>
        <Link
          href="/profile"
          className="flex min-h-12 w-full items-center justify-center rounded-(--radius-control) bg-primary px-6 text-sm font-semibold text-white"
        >
          Back to profile
        </Link>
      </div>
    );
  }

  const question = QUESTIONS[stepIndex]!;

  const onContinue = () => {
    if (answers[stepIndex] === null) {
      setStepError("Choose the option that fits you best.");
      return;
    }
    setStepError(null);
    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    setBusy(true);
    api
      .post<ApiEnvelope<RiskAssessment>>("/api/risk", { answers })
      .then(async (envelope) => {
        track(ANALYTICS_EVENTS.formCompleted, { form: "risk_questionnaire" });
        clearDraft();
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        setResult(envelope.data);
      })
      .catch(() => {
        setStepError("We couldn't save your answers. Check your connection and try again.");
      })
      .finally(() => setBusy(false));
  };

  return (
    <StepShell
      step={stepIndex + 1}
      total={QUESTIONS.length}
      title={question.title}
      onBack={stepIndex > 0 ? () => setStepIndex((i) => i - 1) : null}
      onContinue={onContinue}
      continueLabel={stepIndex === QUESTIONS.length - 1 ? "See my risk profile" : "Continue"}
      busy={busy}
      error={stepError}
    >
      <ChoiceField
        legend={question.title}
        options={question.options.map((label, index) => ({ value: index + 1, label }))}
        value={answers[stepIndex] ?? null}
        onChange={(value) =>
          setAnswers((current) => current.map((a, i) => (i === stepIndex ? value : a)))
        }
      />
    </StepShell>
  );
}
