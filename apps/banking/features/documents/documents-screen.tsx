"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, DocumentsData } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { Icon } from "@/components/navigation/icons";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatDay } from "@/lib/formatting/format";

const TYPE_LABELS = { statement: "Statement", disclosure: "Disclosure", report: "Report" } as const;

export function DocumentsScreen() {
  useScreenView("documents");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<DocumentsData>>("/api/documents", { signal }),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 py-5" aria-busy="true">
        <span className="sr-only">Loading documents</span>
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load your documents"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const { documents, history } = data.data;

  return (
    <div className="flex flex-col gap-5 py-5">
      <section aria-label="Documents" className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted">Documents</h2>
        <ul className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
              <Icon name="documents" className="h-5 w-5 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted">
                  {TYPE_LABELS[doc.type]} · {formatDay(doc.date)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">
          Preview and download arrive with document-storage integration.
        </p>
      </section>

      <section aria-label="Advisory history" className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted">Advisory history</h2>
        <ol className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
          {history.map((event) => (
            <li key={event.id} className="flex flex-col gap-0.5 px-4 py-3">
              <p className="text-xs text-muted">{formatDay(event.date)}</p>
              <p className="text-sm font-semibold">{event.title}</p>
              <p className="text-xs text-muted">{event.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
