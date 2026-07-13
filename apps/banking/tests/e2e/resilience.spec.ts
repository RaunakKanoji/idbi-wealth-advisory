import { expect, test } from "@playwright/test";
import { grantSession } from "./helpers";

/** F111/F119: the app degrades honestly — never blank, never a stuck spinner. */

test("offline: shell banner appears and the copilot degrades to a fallback reply", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.goto("/copilot");
  await context.setOffline(true);
  await expect(page.getByText("You're offline.", { exact: false })).toBeVisible();

  await page.getByLabel("Ask the Copilot a question").fill("How healthy are my finances?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText(/couldn't reach your financial data/)).toBeVisible();

  await context.setOffline(false);
});

test("slow network: overview shows skeletons, then content — no blank screen", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.route("**/api/overview", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });
  await page.goto("/overview");
  await expect(page.locator('[aria-busy="true"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: /Hello,/ })).toBeVisible({ timeout: 10_000 });
});

test("api failure: overview shows an explicit error state with retry", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.route("**/api/overview", (route) => route.abort());
  await page.goto("/overview");
  // Filtered because Next's route announcer is also role="alert".
  await expect(
    page.getByRole("alert").filter({ hasText: /couldn't load your dashboard/ }),
  ).toBeVisible();
  // Retry works once the network is back.
  await page.unroute("**/api/overview");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: /Hello,/ })).toBeVisible();
});
