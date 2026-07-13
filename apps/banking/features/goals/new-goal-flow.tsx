"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import { goalFormSchema } from "@idbi/validation";
import { CurrencyField, NumberField, TextField } from "@/components/forms/fields";
import { StepShell } from "@/components/forms/step-shell";
import { useFormDraft } from "@/components/forms/use-form-draft";
import { useToast } from "@/components/feedback/toast";
import { track, useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatInr } from "@/lib/formatting/format";

const DRAFT_KEY = "idbi.draft.new-goal";

interface Draft {
  name: string;
  targetAmount: number | null;
  targetYear: number | null;
  currentCorpus: number | null;
  monthlyContribution: number | null;
  expectedAnnualReturnPct: number | null;
}

const EMPTY: Draft = {
  name: "",
  targetAmount: null,
  targetYear: null,
  currentCorpus: null,
  monthlyContribution: null,
  expectedAnnualReturnPct: 10,
};

type StepId = "name" | "target" | "funding" | "review";
const STEPS: { id: StepId; title: string; fields: (keyof Draft)[] }[] = [
  { id: "name", title: "What are you saving for?", fields: ["name"] },
  { id: "target", title: "How much, and by when?", fields: ["targetAmount", "targetYear"] },
  {
    id: "funding",
    title: "How will you fund it?",
    fields: ["currentCorpus", "monthlyContribution", "expectedAnnualReturnPct"],
  },
  { id: "review", title: "Check your goal", fields: [] },
];

export function NewGoalFlow() {
  useScreenView("new_goal_form");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft, clearDraft] = useFormDraft<Draft>(DRAFT_KEY, EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    track(ANALYTICS_EVENTS.formStarted, { form: "new_goal" });
  }, []);

  const step = STEPS[stepIndex]!;

  const validateStep = (): boolean => {
    if (step.fields.length === 0) return true;
    const picked = goalFormSchema.pick(
      Object.fromEntries(step.fields.map((f) => [f, true])) as Record<keyof Draft, true>,
    );
    const result = picked.safeParse(Object.fromEntries(step.fields.map((f) => [f, draft[f]])));
    if (result.success) {
      setFieldErrors({});
      setStepError(null);
      return true;
    }
    const errors: Partial<Record<keyof Draft, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof Draft | undefined;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    setFieldErrors(errors);
    setStepError("Please fix the highlighted fields to continue.");
    return false;
  };

  const submit = async () => {
    const result = goalFormSchema.safeParse(draft);
    if (!result.success) {
      setStepError(result.error.issues[0]?.message ?? "Please review your goal.");
      return;
    }
    setBusy(true);
    try {
      await api.post("/api/goals", result.data);
      track(ANALYTICS_EVENTS.formCompleted, { form: "new_goal" });
      clearDraft();
      await queryClient.invalidateQueries();
      showToast(`Goal "${result.data.name}" created.`);
      router.push("/goals");
    } catch {
      setStepError("We couldn't save your goal. Check your connection and try again.");
      setBusy(false);
    }
  };

  const onContinue = () => {
    if (step.id === "review") {
      void submit();
      return;
    }
    if (validateStep()) setStepIndex((i) => i + 1);
  };

  return (
    <StepShell
      step={stepIndex + 1}
      total={STEPS.length}
      title={step.title}
      onBack={stepIndex > 0 ? () => setStepIndex((i) => i - 1) : null}
      onContinue={onContinue}
      continueLabel={step.id === "review" ? "Create goal" : "Continue"}
      busy={busy}
      error={stepError}
    >
      {step.id === "name" ? (
        <TextField
          label="Goal name"
          hint={'For example "College fund" or "New car".'}
          value={draft.name}
          onChange={(name) => setDraft((d) => ({ ...d, name }))}
          error={fieldErrors.name}
          maxLength={60}
        />
      ) : null}
      {step.id === "target" ? (
        <>
          <CurrencyField
            label="Target amount"
            value={draft.targetAmount}
            onChange={(v) => setDraft((d) => ({ ...d, targetAmount: v }))}
            error={fieldErrors.targetAmount}
          />
          <NumberField
            label="Target year"
            hint="When you'll need the money."
            value={draft.targetYear}
            onChange={(v) => setDraft((d) => ({ ...d, targetYear: v }))}
            error={fieldErrors.targetYear}
          />
        </>
      ) : null}
      {step.id === "funding" ? (
        <>
          <CurrencyField
            label="Already saved for this"
            hint="Enter 0 if you're starting fresh."
            value={draft.currentCorpus}
            onChange={(v) => setDraft((d) => ({ ...d, currentCorpus: v }))}
            error={fieldErrors.currentCorpus}
          />
          <CurrencyField
            label="Monthly investment"
            value={draft.monthlyContribution}
            onChange={(v) => setDraft((d) => ({ ...d, monthlyContribution: v }))}
            error={fieldErrors.monthlyContribution}
          />
          <NumberField
            label="Expected annual return (%)"
            hint="Equity funds have averaged 10–12% long term; debt 6–7%."
            value={draft.expectedAnnualReturnPct}
            onChange={(v) => setDraft((d) => ({ ...d, expectedAnnualReturnPct: v }))}
            error={fieldErrors.expectedAnnualReturnPct}
          />
        </>
      ) : null}
      {step.id === "review" ? (
        <>
          <dl className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
            {(
              [
                ["Goal", draft.name || "—"],
                ["Target", draft.targetAmount === null ? "—" : `${formatInr(draft.targetAmount)} by ${draft.targetYear ?? "—"}`],
                ["Already saved", draft.currentCorpus === null ? "—" : formatInr(draft.currentCorpus)],
                ["Monthly investment", draft.monthlyContribution === null ? "—" : formatInr(draft.monthlyContribution)],
                ["Expected return", draft.expectedAnnualReturnPct === null ? "—" : `${draft.expectedAnnualReturnPct}% / year`],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2 px-4 py-3 text-sm">
                <dt className="text-muted">{label}</dt>
                <dd className="min-w-0 truncate font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-muted">
            You'll see the projection and whether you're on track as soon as the goal is created.
          </p>
        </>
      ) : null}
    </StepShell>
  );
}
