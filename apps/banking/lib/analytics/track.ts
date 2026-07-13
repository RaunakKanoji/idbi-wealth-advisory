"use client";

import { useEffect } from "react";
import {
  ANALYTICS_EVENTS,
  type AnalyticsEventName,
  type AnalyticsEventParams,
} from "@idbi/analytics";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * The one tracking entry point (F010). Event names come from @idbi/analytics —
 * never string literals at call sites. Platform/capability context is attached
 * here as dimensions so names stay identical across surfaces.
 */
export function track<N extends AnalyticsEventName>(name: N, params: AnalyticsEventParams[N]): void {
  if (typeof window === "undefined") return;
  const dimensions = {
    platform: "web" as const,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    reduced_motion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    online: navigator.onLine,
  };
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, { ...params, ...dimensions });
  }
  window.dataLayer?.push({ event: name, ...params, ...dimensions });
}

export function useScreenView(screen: string): void {
  useEffect(() => {
    track(ANALYTICS_EVENTS.screenViewed, { screen });
  }, [screen]);
}
