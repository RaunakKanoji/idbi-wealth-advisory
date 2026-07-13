import { expect, test } from "@playwright/test";
import { grantSession, resetConsent } from "./helpers";

/** The complete mobile customer journey (Phase 2 items, verified end to end). */

test("signs in and lands on the dashboard", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByRole("button", { name: /Continue as Ananya/ }).click();
  await expect(page).toHaveURL(/\/overview/);
  await expect(page.getByRole("heading", { name: /Hello,/ })).toBeVisible();
  await expect(page.getByLabel(/Wealth health score/)).toBeVisible();
});

test("deep link while signed out round-trips through sign-in", async ({ page }) => {
  await page.goto("/goals");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fgoals/);
  await page.getByRole("button", { name: /Continue as Ananya/ }).click();
  await expect(page).toHaveURL(/\/goals/);
});

test("browser back closes the More sheet before navigating (F108)", async ({ page, context }) => {
  await grantSession(context);
  await page.goto("/overview");
  await page.getByRole("button", { name: "More" }).click();
  const sheet = page.getByRole("dialog", { name: "More sections" });
  await expect(sheet).toBeVisible();
  await page.goBack();
  await expect(sheet).toBeHidden();
  await expect(page).toHaveURL(/\/overview/);
});

test("wealth health explains its pillars", async ({ page, context }) => {
  await grantSession(context);
  await page.goto("/wealth-health");
  await expect(page.getByText("What drives your score")).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveCount(5);
});

test("copilot answers from the shared engine and conversation survives navigation", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.goto("/copilot");
  await page.getByLabel("Ask the Copilot a question").fill("Am I on track for my goals?");
  await page.getByRole("button", { name: "Send" }).click();
  const reply = page.getByText(/Here's where your goals stand/);
  await expect(reply).toBeVisible();
  // Navigate away and back — conversation state must persist (F008).
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Goals" }).click();
  await expect(page).toHaveURL(/\/goals$/);
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Copilot" }).click();
  await expect(reply).toBeVisible();

  // The customer can always minimize the avatar for reading space (F110).
  await page.getByRole("button", { name: "Hide avatar" }).click();
  await expect(page.getByText("Avatar hidden")).toBeVisible();
  await page.getByRole("button", { name: "Show avatar" }).click();
  await expect(page.getByRole("button", { name: "Hide avatar" })).toBeVisible();
});

test("financial profile step flow saves and recalculates the dashboard", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.goto("/profile/financial");
  // Wait for the server prefill before typing (fields merge per field).
  await expect(page.getByLabel("Monthly take-home income")).not.toHaveValue("");
  await page.getByLabel("Monthly take-home income").fill("300000");
  await page.getByRole("button", { name: "Continue" }).click(); // → outgoings
  await page.getByRole("button", { name: "Continue" }).click(); // → savings
  await page.getByRole("button", { name: "Continue" }).click(); // → household
  await page.getByRole("button", { name: "Continue" }).click(); // → review
  await expect(page.getByText("Check your details")).toBeVisible();
  await expect(page.getByText("₹3,00,000")).toBeVisible();
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText("Provided by you")).toBeVisible();
  await expect(page.getByText("₹3,00,000")).toBeVisible();
});

test("withdrawing AA consent removes AA data everywhere (BFF enforcement)", async ({
  page,
  context,
  request,
}) => {
  await grantSession(context);
  await page.goto("/consent");
  const aaToggle = page.getByRole("checkbox").first();
  await aaToggle.uncheck();
  await expect(page.getByText(/Withdrawing Account Aggregator consent/)).toBeVisible();
  await page.getByRole("button", { name: "Save consent settings" }).click();
  await expect(page.getByText("Consent updated.")).toBeVisible();

  await page.goto("/portfolio");
  await expect(page.getByText("IDBI fixed deposit", { exact: true })).toBeVisible();
  await expect(page.getByText("Flexi-cap equity fund")).toBeHidden();

  await resetConsent(request);
});

test("risk questionnaire produces a category", async ({ page, context }) => {
  await grantSession(context);
  await page.goto("/profile/risk");
  for (let i = 0; i < 6; i++) {
    await page.getByRole("radio").nth(3).check(); // answer 4 on each question
    await page
      .getByRole("button", { name: i === 5 ? "See my risk profile" : "Continue" })
      .click();
  }
  await expect(page.getByRole("heading", { name: /investor$/ })).toBeVisible();
});

test("sign out returns to sign-in and clears the session", async ({ page, context }) => {
  await grantSession(context);
  await page.goto("/settings");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in/);
  // Re-gating of a signed-out visitor is covered by the deep-link test above —
  // here we assert the session is actually gone (the init script would re-grant
  // it on the next navigation, so a second goto can't prove anything).
  const session = await page.evaluate(() => window.localStorage.getItem("idbi.demo.session"));
  expect(session).toBeNull();
});
