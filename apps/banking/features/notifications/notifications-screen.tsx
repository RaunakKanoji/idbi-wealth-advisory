"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApiEnvelope, NotificationItem } from "@idbi/types";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { useScreenView } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";
import { formatDay } from "@/lib/formatting/format";
import { cn } from "@/lib/utils/cn";

/** In-app notification centre — the always-available fallback for push (F119). */
export function NotificationsScreen() {
  useScreenView("notifications");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: ({ signal }) => api.get<ApiEnvelope<NotificationItem[]>>("/api/notifications", { signal }),
  });
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  if (isPending) {
    return (
      <div className="flex flex-col gap-3 py-5" aria-busy="true">
        <span className="sr-only">Loading notifications</span>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-5">
        <ErrorState
          title="We couldn't load notifications"
          message="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const notifications = data.data;
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        </p>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={() => setReadIds(new Set(notifications.map((n) => n.id)))}
            className="flex min-h-11 items-center text-sm font-medium text-primary"
          >
            Mark all as read
          </button>
        ) : null}
      </div>
      <ul className="flex flex-col gap-2">
        {notifications.map((notification) => {
          const unread = !readIds.has(notification.id);
          return (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => setReadIds((prev) => new Set(prev).add(notification.id))}
                className={cn(
                  "flex w-full items-start gap-3 rounded-(--radius-card) border p-4 text-left",
                  unread ? "border-primary/40 bg-surface" : "border-border bg-surface/60",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                    unread ? "bg-accent" : "bg-border",
                  )}
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className={cn("text-sm", unread ? "font-semibold" : "font-medium")}>
                    {notification.title}
                    {unread ? <span className="sr-only"> (unread)</span> : null}
                  </span>
                  <span className="text-xs text-muted">{notification.body}</span>
                  <span className="text-xs text-muted">{formatDay(notification.date)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
