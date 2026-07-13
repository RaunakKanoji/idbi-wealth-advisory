"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, ProfileData } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatInr } from "@/lib/formatting/format";

const RISK_LABELS: Record<string, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  growth: "Growth",
  aggressive: "Aggressive",
};

export function ProfileScreen() {
  useScreenView("profile");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<ProfileData>>("/api/profile", { signal }),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading profile</span>
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load your profile"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const { profile, risk, isCustomerProvided } = data.data;

  return (
    <div className="flex flex-col gap-4 py-5">
      <section
        aria-label="Financial profile"
        className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold">Financial profile</h2>
          <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-0.5 text-xs text-primary">
            {isCustomerProvided ? "Provided by you" : "From connected data"}
          </span>
        </div>
        <dl className="flex flex-col gap-1.5 text-sm">
          {(
            [
              ["Monthly income", formatInr(profile.monthlyIncome)],
              ["Living expenses", formatInr(profile.monthlyExpenses)],
              ["Loan EMIs", formatInr(profile.monthlyEmi)],
              ["Liquid savings", formatInr(profile.liquidSavings)],
              ["Dependents", String(profile.dependents)],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2">
              <dt className="text-muted">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href="/profile/financial"
          className="flex min-h-11 items-center justify-center rounded-(--radius-control) border border-border text-sm font-semibold text-primary"
        >
          Update financial profile
        </Link>
      </section>

      <section
        aria-label="Risk profile"
        className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
      >
        <h2 className="text-base font-semibold">Risk profile</h2>
        {risk ? (
          <p className="text-sm">
            <span className="font-semibold text-primary">{RISK_LABELS[risk.category]}</span>{" "}
            <span className="text-muted">· score {risk.score} of 5</span>
          </p>
        ) : (
          <p className="text-sm text-muted">
            Not assessed yet. Six quick questions shape which recommendations suit you.
          </p>
        )}
        <Link
          href="/profile/risk"
          className="flex min-h-11 items-center justify-center rounded-(--radius-control) border border-border text-sm font-semibold text-primary"
        >
          {risk ? "Retake the questionnaire" : "Assess my risk profile"}
        </Link>
      </section>

      <section
        aria-label="Human advisor"
        className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
      >
        <h2 className="text-base font-semibold">Prefer to talk to a person?</h2>
        <p className="text-sm text-muted">An IDBI advisor can walk through any of this with you.</p>
        <Link
          href="/advisor"
          className="flex min-h-11 items-center justify-center rounded-(--radius-control) bg-primary text-sm font-semibold text-white"
        >
          Request an advisor
        </Link>
      </section>
    </div>
  );
}
