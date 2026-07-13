"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import type { AdvisorRequestResult, ApiEnvelope } from "@idbi/types";
import { advisorRequestSchema } from "@idbi/validation";
import { ChoiceField, TextField } from "@/components/forms/fields";
import { StepShell } from "@/components/forms/step-shell";
import { CopilotAvatar } from "@/components/avatar/copilot-avatar";
import { track, useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";

const REASONS = [
  { value: "portfolio_review", label: "Review my portfolio" },
  { value: "goal_planning", label: "Plan a goal" },
  { value: "insurance", label: "Insurance and protection" },
  { value: "tax", label: "Tax-efficient investing" },
  { value: "other", label: "Something else" },
] as const;

const TIMES = [
  { value: "morning", label: "Morning", description: "9am – 12pm" },
  { value: "afternoon", label: "Afternoon", description: "12pm – 4pm" },
  { value: "evening", label: "Evening", description: "4pm – 7pm" },
] as const;

export function AdvisorScreen() {
  useScreenView("advisor_handoff");
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState<string | null>(null);
  const [contactTime, setContactTime] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    track(ANALYTICS_EVENTS.formStarted, { form: "advisor_handoff" });
  }, []);

  if (reference) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CopilotAvatar variant="face" className="h-20 w-20" />
        <h2 className="text-xl font-bold">Request received</h2>
        <p className="readable text-sm text-muted">
          An IDBI advisor will call you at your preferred time within one working day. Your
          conversation history and financial context will be shared with them so you don't have to
          repeat yourself.
        </p>
        <p className="rounded-(--radius-control) bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
          Reference: {reference}
        </p>
        <Link
          href="/overview"
          className="flex min-h-12 w-full items-center justify-center rounded-(--radius-control) bg-primary px-6 text-sm font-semibold text-white"
        >
          Back to your dashboard
        </Link>
      </div>
    );
  }

  const submit = () => {
    const parsed = advisorRequestSchema.safeParse({
      reason,
      contactTime,
      note: note.trim() === "" ? undefined : note.trim(),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please review your request.");
      return;
    }
    setBusy(true);
    setError(null);
    api
      .post<ApiEnvelope<AdvisorRequestResult>>("/api/advisor", parsed.data)
      .then((envelope) => {
        track(ANALYTICS_EVENTS.formCompleted, { form: "advisor_handoff" });
        track(ANALYTICS_EVENTS.advisorRequested, {});
        setReference(envelope.data.referenceId);
      })
      .catch(() => setError("We couldn't send your request. Check your connection and try again."))
      .finally(() => setBusy(false));
  };

  const onContinue = () => {
    if (step === 1) {
      if (!reason) {
        setError("Choose a topic so we match the right advisor.");
        return;
      }
      setError(null);
      setStep(2);
      return;
    }
    if (!contactTime) {
      setError("Choose a preferred time.");
      return;
    }
    submit();
  };

  return (
    <StepShell
      step={step}
      total={2}
      title={step === 1 ? "What would you like help with?" : "When should we call?"}
      onBack={step > 1 ? () => setStep(1) : null}
      onContinue={onContinue}
      continueLabel={step === 2 ? "Request advisor" : "Continue"}
      busy={busy}
      error={error}
    >
      {step === 1 ? (
        <ChoiceField
          legend="Topic"
          options={REASONS.map((r) => ({ value: r.value, label: r.label }))}
          value={reason}
          onChange={(v) => setReason(v)}
        />
      ) : (
        <>
          <ChoiceField
            legend="Preferred time"
            options={TIMES.map((t) => ({ value: t.value, label: t.label, description: t.description }))}
            value={contactTime}
            onChange={(v) => setContactTime(v)}
          />
          <TextField
            label="Anything the advisor should know? (optional)"
            value={note}
            onChange={setNote}
            maxLength={500}
            multiline
          />
        </>
      )}
    </StepShell>
  );
}
