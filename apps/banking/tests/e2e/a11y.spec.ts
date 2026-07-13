import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ALL_ROUTES, grantSession } from "./helpers";

/**
 * Automated accessibility scan on every route (Phase 3). Serious and critical
 * axe violations fail the build. A human screen-reader pass on real devices
 * remains a manual Phase 3 checklist item — this is the automated floor.
 */
for (const route of ALL_ROUTES) {
  test(`axe scan: ${route}`, async ({ page, context }) => {
    await grantSession(context);
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(" ")) }));
    expect(blocking).toEqual([]);
  });
}

test("axe scan: /sign-in (signed out)", async ({ page }) => {
  await page.goto("/sign-in");
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(blocking).toEqual([]);
});
