import { expect, test } from "@playwright/test";
import { grantSession } from "./helpers";

/**
 * F119: core wealth advisory never depends on optional device capabilities.
 * Voice, avatar animation, push, and hover are all absent/off in this profile —
 * these tests prove the journey still works and fallbacks engage.
 */

test("reduced motion: the copilot conversation works fully", async ({ page, context }) => {
  await grantSession(context);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/copilot");
  await page.getByLabel("Ask the Copilot a question").fill("How healthy are my finances?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText(/wealth health score is \d+\/100/)).toBeVisible();
});

test("voice unavailable: text input is the baseline — no mic control is required", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.goto("/copilot");
  await expect(page.getByLabel("Ask the Copilot a question")).toBeVisible();
  await expect(page.getByRole("button", { name: /voice|mic/i })).toHaveCount(0);
});

test("avatar animation unavailable: static avatar renders and never blocks actions", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.goto("/copilot");
  // Static SVG asset (the F110 fallback and current default).
  await expect(page.locator('img[src*="/avatar/copilot"]').first()).toBeVisible();
  // The primary action stays operable with the avatar on screen.
  await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
});

test("push unavailable: the in-app notification feed is the fallback", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.goto("/notifications");
  await expect(page.getByText(/\d unread/)).toBeVisible();
  await page.getByRole("button", { name: "Mark all as read" }).click();
  await expect(page.getByText("All caught up")).toBeVisible();
});
