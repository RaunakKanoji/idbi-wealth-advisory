import type { APIRequestContext, BrowserContext } from "@playwright/test";

export const SESSION_KEY = "idbi.demo.session";

/** Grants the demo session before any page script runs (F007 demo auth). */
export async function grantSession(context: BrowserContext): Promise<void> {
  await context.addInitScript(
    ([key, value]) => window.localStorage.setItem(key!, value!),
    [SESSION_KEY, JSON.stringify({ customerId: "cust-demo-001" })],
  );
}

/** Resets consent to fixture defaults (tests that mutate it must call this). */
export async function resetConsent(request: APIRequestContext): Promise<void> {
  await request.post("/api/consent", {
    data: { accountAggregator: true, analytics: true, marketing: false },
  });
}

/** Every authenticated route in the app (cross-platform-navigation-context.md). */
export const ALL_ROUTES = [
  "/overview",
  "/wealth-health",
  "/copilot",
  "/goals",
  "/goals/new",
  "/portfolio",
  "/spending",
  "/recommendations",
  "/simulator",
  "/documents",
  "/consent",
  "/notifications",
  "/advisor",
  "/profile",
  "/profile/financial",
  "/profile/risk",
  "/settings",
] as const;
