import { expect, test } from "@playwright/test";
import { ALL_ROUTES, grantSession } from "./helpers";

/** F113/F120 tablet viewports, portrait and landscape. */
const TABLET_VIEWPORTS = [
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
];

test("the rail replaces the bottom navigation at tablet width — never both (D-004)", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/overview");
  await expect(page.locator('[data-nav-variant="rail"]')).toBeVisible();
  await expect(page.locator('[data-nav-variant="bottom"]')).toHaveCount(0);
  // Exactly one primary navigation landmark.
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(1);
});

test("the bottom navigation owns mobile width — the rail is absent", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/overview");
  await expect(page.locator('[data-nav-variant="bottom"]')).toBeVisible();
  await expect(page.locator('[data-nav-variant="rail"]')).toHaveCount(0);
});

test("every destination is reachable directly from the rail (D-007)", async ({
  page,
  context,
}) => {
  await grantSession(context);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/overview");
  const rail = page.locator('[data-nav-variant="rail"]');
  await rail.getByRole("link", { name: "Portfolio" }).click();
  await expect(page).toHaveURL(/\/portfolio/);
  await expect(page.getByText("Total portfolio value")).toBeVisible();
  // Accessible names stay the full labels even where the rail shows short ones.
  await rail.getByRole("link", { name: "Recommendations" }).click();
  await expect(page).toHaveURL(/\/recommendations/);
});

test("the expanded allocation chart appears on tablet only (F117)", async ({ page, context }) => {
  await grantSession(context);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/portfolio");
  await expect(page.getByRole("img", { name: /Asset allocation:/ })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("img", { name: /Asset allocation:/ })).toBeHidden();
});

for (const viewport of TABLET_VIEWPORTS) {
  test(`no horizontal overflow on any route at ${viewport.width}×${viewport.height}`, async ({
    page,
    context,
  }) => {
    await grantSession(context);
    await page.setViewportSize(viewport);
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(overflow.scrollWidth, `${route} overflows at ${viewport.width}px`).toBeLessThanOrEqual(
        overflow.innerWidth,
      );
    }
  });
}
