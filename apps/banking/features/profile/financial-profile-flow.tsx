"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import type { ApiEnvelope, ProfileData } from "@idbi/types";
import { financialProfileFieldsSchema, financialProfileSchema } from "@idbi/validation";
import { CurrencyField, NumberField } from "@/components/forms/fields";
import { StepShell } from "@/components/forms/step-shell";
import { useFormDraft } from "@/components/forms/use-form-draft";
import { useToast } from "@/components/feedback/toast";
import { track, useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatInr } from "@/lib/formatting/format";

const DRAFT_KEY = "idbi.draft.financial-profile";

interface Draft {
  monthlyIncome: number | null;
  monthlyExpenses: number | null;
  monthlyEmi: number | null;
  liquidSavings: number | null;
  dependents: number | null;
}

const EMPTY: Draft = {
  monthlyIncome: null,
  monthlyExpenses: null,
  monthlyEmi: null,
  liquidSavings: null,
  dependents: null,
};

type StepId = "income" | "outgoings" | "savings" | "household" | "review";
const STEPS: { id: StepId; title: string; fields: (keyof Draft)[] }[] = [
  { id: "income", title: "What do you earn each month?", fields: ["monthlyIncome"] },
  { id: "outgoings", title: "What goes out each month?", fields: ["monthlyExpenses", "monthlyEmi"] },
  { id: "savings", title: "What could you access in an emergency?", fields: ["liquidSavings"] },
  { id: "household", title: "Who depends on your income?", fields: ["dependents"] },
  { id: "review", title: "Check your details", fields: [] },
];

export function FinancialProfileFlow() {
  useScreenView("financial_profile_form");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft, clearDraft] = useFormDraft<Draft>(DRAFT_KEY, EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<ProfileData>>("/api/profile", { signal }),
  });

  useEffect(() => {
    track(ANALYTICS_EVENTS.formStarted, { form: "financial_profile" });
  }, []);

  // Prefill from the current profile, merging per field so anything the
  // customer has already typed (or a saved draft) always wins over the server.
  useEffect(() => {
    if (!profileData) return;
    const server = profileData.data.profile;
    setDraft((d) => ({
      monthlyIncome: d.monthlyIncome ?? server.monthlyIncome,
      monthlyExpenses: d.monthlyExpenses ?? server.monthlyExpenses,
      monthlyEmi: d.monthlyEmi ?? server.monthlyEmi,
      liquidSavings: d.liquidSavings ?? server.liquidSavings,
      dependents: d.dependents ?? server.dependents,
    }));
  }, [profileData, setDraft]);

  const step = STEPS[stepIndex]!;

  const validateStep = (): boolean => {
    if (step.fields.length === 0) return true;
    const slice = Object.fromEntries(step.fields.map((f) => [f, draft[f]]));
    const picked = financialProfileFieldsSchema.pick(
      Object.fromEntries(step.fields.map((f) => [f, true])) as Record<keyof Draft, true>,
    );
    const result = picked.safeParse(slice);
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
    const result = financialProfileSchema.safeParse(draft);
    if (!result.success) {
      setStepError(result.error.issues[0]?.message ?? "Please review your details.");
      return;
    }
    setBusy(true);
    try {
      await api.post("/api/profile", result.data);
      track(ANALYTICS_EVENTS.formCompleted, { form: "financial_profile" });
      clearDraft();
      await queryClient.invalidateQueries(); // profile changes recompute everything
      showToast("Profile updated — your dashboard has been recalculated.");
      router.push("/profile");
    } catch {
      setStepError("We couldn't save your profile. Check your connection and try again.");
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

  const onBack = stepIndex > 0 ? () => setStepIndex((i) => i - 1) : null;
  const set = (field: keyof Draft) => (value: number | null) =>
    setDraft((d) => ({ ...d, [field]: value }));

  return (
    <StepShell
      step={stepIndex + 1}
      total={STEPS.length}
      title={step.title}
      onBack={onBack}
      onContinue={onContinue}
      continueLabel={step.id === "review" ? "Save profile" : "Continue"}
      busy={busy}
      error={stepError}
    >
      {step.id === "income" ? (
        <CurrencyField
          label="Monthly take-home income"
          hint="After tax, across all income sources."
          value={draft.monthlyIncome}
          onChange={set("monthlyIncome")}
          error={fieldErrors.monthlyIncome}
        />
      ) : null}
      {/* Related fields sit side by side on wider screens (F113) — same
          validation and completion logic as the stacked mobile layout. */}
      {step.id === "outgoings" ? (
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:items-start">
          <CurrencyField
            label="Monthly living expenses"
            hint="Rent, food, transport, utilities — everything except loan EMIs."
            value={draft.monthlyExpenses}
            onChange={set("monthlyExpenses")}
            error={fieldErrors.monthlyExpenses}
          />
          <CurrencyField
            label="Monthly loan EMIs"
            hint="Home, car, personal loans. Enter 0 if none."
            value={draft.monthlyEmi}
            onChange={set("monthlyEmi")}
            error={fieldErrors.monthlyEmi}
          />
        </div>
      ) : null}
      {step.id === "savings" ? (
        <CurrencyField
          label="Liquid savings"
          hint="Savings accounts, deposits you can break, liquid funds."
          value={draft.liquidSavings}
          onChange={set("liquidSavings")}
          error={fieldErrors.liquidSavings}
        />
      ) : null}
      {step.id === "household" ? (
        <NumberField
          label="Number of dependents"
          hint="People who rely on your income — children, parents."
          value={draft.dependents}
          onChange={set("dependents")}
          error={fieldErrors.dependents}
        />
      ) : null}
      {step.id === "review" ? (
        <dl className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
          {(
            [
              ["Monthly income", draft.monthlyIncome],
              ["Living expenses", draft.monthlyExpenses],
              ["Loan EMIs", draft.monthlyEmi],
              ["Liquid savings", draft.liquidSavings],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2 px-4 py-3 text-sm">
              <dt className="text-muted">{label}</dt>
              <dd className="font-semibold">{value === null ? "—" : formatInr(value)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-2 px-4 py-3 text-sm">
            <dt className="text-muted">Dependents</dt>
            <dd className="font-semibold">{draft.dependents ?? "—"}</dd>
          </div>
        </dl>
      ) : null}
      {step.id === "review" ? (
        <p className="text-xs text-muted">
          Saving recalculates your wealth health score, recommendations, and goal projections.
        </p>
      ) : null}
    </StepShell>
  );
}
