"use client";

import { useNetworkStatus } from "@/hooks/use-network-status";

/** Shell-level offline indicator (F107/F119). */
export function OfflineBanner() {
  const { online } = useNetworkStatus();
  if (online) return null;
  return (
    <div role="status" className="border-b border-border bg-warning-soft px-4 py-2 text-sm text-warning">
      You're offline. Showing the latest saved information.
    </div>
  );
}
