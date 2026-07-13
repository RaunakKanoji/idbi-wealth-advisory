"use client";

import { useEffect, useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// Same shared engine every screen and the Copilot use (F004) — imported, never
// re-implemented, so a simulated projection can't disagree with the real one.
import { projectGoal } from "@idbi/financial-domain";
import type { ApiEnvelope, Goal, GoalsData } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { ProgressBar } from "@/components/financial/progress-bar";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatInr, formatInrCompact } from "@/lib/formatting/format";

interface SimulatorInputs {
  monthlyContribution: number;
  expectedAnnualReturnPct: number;
  targetYear: number;
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output htmlFor={id} className="text-sm font-semibold text-primary">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full accent-(--color-primary)"
      />
    </div>
  );
}

export function SimulatorScreen() {
  useScreenView("simulator");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["goals"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<GoalsData>>("/api/goals", { signal }),
  });
  const [goalId, setGoalId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<SimulatorInputs | null>(null);
  const selectId = useId();

  const goals = data?.data.goals ?? [];
  const goal: Goal | undefined = goals.find((g) => g.id === goalId) ?? goals[0];

  // Reset the sliders whenever the selected goal changes.
  useEffect(() => {
    if (!goal) return;
    setInputs({
      monthlyContribution: goal.monthlyContribution,
      expectedAnnualReturnPct: goal.expectedAnnualReturnPct,
      targetYear: goal.targetYear,
    });
  }, [goal?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading simulator</span>
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !goal || !inputs) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load the simulator"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const projection = projectGoal({ ...goal, ...inputs }, currentYear);
  const fundedPct = goal.targetAmount > 0 ? (projection.projectedValue / goal.targetAmount) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 py-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-sm font-medium">
          Simulate a goal
        </label>
        <select
          id={selectId}
          value={goal.id}
          onChange={(event) => setGoalId(event.target.value)}
          className="min-h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base"
        >
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <section
        aria-label="What-if controls"
        className="flex flex-col gap-4 rounded-(--radius-card) border border-border bg-surface p-4"
      >
        <Slider
          label="Monthly investment"
          value={inputs.monthlyContribution}
          display={formatInr(inputs.monthlyContribution)}
          min={0}
          max={100000}
          step={1000}
          onChange={(v) => setInputs({ ...inputs, monthlyContribution: v })}
        />
        <Slider
          label="Expected annual return"
          value={inputs.expectedAnnualReturnPct}
          display={`${inputs.expectedAnnualReturnPct}%`}
          min={4}
          max={15}
          step={0.5}
          onChange={(v) => setInputs({ ...inputs, expectedAnnualReturnPct: v })}
        />
        <Slider
          label="Target year"
          value={inputs.targetYear}
          display={String(inputs.targetYear)}
          min={currentYear + 1}
          max={2060}
          step={1}
          onChange={(v) => setInputs({ ...inputs, targetYear: v })}
        />
      </section>

      <section
        aria-label="Simulated outcome"
        aria-live="polite"
        className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-muted">Projected by {inputs.targetYear}</p>
          {projection.onTrack ? (
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-positive">
              Reaches target
            </span>
          ) : (
            <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">
              Falls short
            </span>
          )}
        </div>
        <p className="text-3xl font-bold">{formatInrCompact(projection.projectedValue)}</p>
        <ProgressBar
          value={fundedPct}
          label={`Projection reaches ${Math.round(fundedPct)}% of target`}
          tone={projection.onTrack ? "primary" : "warning"}
        />
        <p className="text-xs text-muted">
          Target {formatInrCompact(goal.targetAmount)} ({Math.round(fundedPct)}% funded)
          {projection.shortfall > 0
            ? ` · short by ${formatInrCompact(projection.shortfall)} — ${formatInr(projection.requiredMonthlyContribution)}/month would close it`
            : ""}
        </p>
      </section>

      <p className="text-xs text-muted">
        Simulation only — nothing here changes your actual goal. Same projection engine as your
        Goals screen.
      </p>
    </div>
  );
}
