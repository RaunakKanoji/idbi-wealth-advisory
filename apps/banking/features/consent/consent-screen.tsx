"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import type { ApiEnvelope, ConsentSettings } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { useToast } from "@/components/feedback/toast";
import { track, useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";

const CONSENTS: { key: keyof ConsentSettings; title: string; description: string }[] = [
  {
    key: "accountAggregator",
    title: "Account Aggregator data sharing",
    description:
      "Lets us read your HDFC Bank and CAMS Mutual Fund data to build your full financial picture.",
  },
  {
    key: "analytics",
    title: "Usage analytics",
    description: "Helps us improve the app. Never used for financial decisions.",
  },
  {
    key: "marketing",
    title: "Marketing communications",
    description: "Offers and product updates from IDBI Bank.",
  },
];

export function ConsentScreen() {
  useScreenView("consent");
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["consent"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<ConsentSettings>>("/api/consent", { signal }),
  });
  const [settings, setSettings] = useState<ConsentSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && settings === null) setSettings(data.data);
  }, [data, settings]);

  if (isPending || !settings) {
    if (isError) {
      return (
        <div className="py-5">
          <ErrorState
            title="We couldn't load your consent settings"
            message="Check your connection and try again."
            onRetry={() => void refetch()}
          />
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading consent settings</span>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const saved = data?.data;
  const dirty = saved && JSON.stringify(saved) !== JSON.stringify(settings);
  const withdrawingAa = saved?.accountAggregator === true && settings.accountAggregator === false;

  const save = () => {
    setBusy(true);
    setError(null);
    api
      .post("/api/consent", settings)
      .then(async () => {
        track(ANALYTICS_EVENTS.formCompleted, { form: "consent" });
        await queryClient.invalidateQueries(); // consent changes recompute every screen
        showToast("Consent updated.");
      })
      .catch(() => setError("We couldn't save your consent settings. Please try again."))
      .finally(() => setBusy(false));
  };

  return (
    <div className="flex flex-col gap-4 py-5">
      <p className="text-sm text-muted">
        You control what data this service can use. Changes take effect immediately across your
        dashboard and the Copilot.
      </p>

      {CONSENTS.map(({ key, title, description }) => (
        <label
          key={key}
          className="flex items-start gap-3 rounded-(--radius-card) border border-border bg-surface p-4"
        >
          <input
            type="checkbox"
            checked={settings[key]}
            onChange={(event) => setSettings({ ...settings, [key]: event.target.checked })}
            className="mt-0.5 h-6 w-6 shrink-0 accent-(--color-primary)"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{title}</span>
            <span className="text-xs text-muted">{description}</span>
          </span>
        </label>
      ))}

      {withdrawingAa ? (
        <p role="alert" className="rounded-(--radius-card) bg-warning-soft p-4 text-sm text-warning">
          Withdrawing Account Aggregator consent removes HDFC Bank and CAMS Mutual Fund data from
          your dashboard. Your wealth health score, portfolio, and recommendations will be
          recalculated from IDBI Bank data alone.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-(--radius-card) bg-warning-soft p-4 text-sm text-warning">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={save}
        disabled={!dirty || busy}
        className="flex min-h-12 items-center justify-center rounded-(--radius-control) bg-primary text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save consent settings"}
      </button>

      <section className="flex flex-col gap-1 rounded-(--radius-card) border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Advisory disclosure</h2>
        <p className="text-xs text-muted">
          You acknowledged the advisory terms and disclosure on 1 June 2026. Recommendations are
          educational guidance derived from your data — the full document is available under
          Documents.
        </p>
      </section>
    </div>
  );
}
