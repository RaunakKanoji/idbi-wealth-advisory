import { expect, test } from "@playwright/test";
import { ALL_ROUTES, grantSession } from "./helpers";

/**
 * F120 mobile widths: every route must render with no horizontal page overflow
 * (F106 definition of done). The page body never scrolls horizontally.
 */
const MOBILE_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
];

for (const viewport of MOBILE_VIEWPORTS) {
  test(`no horizontal overflow on any route at ${viewport.width}×${viewport.height}`, async ({
    page,
    context,
  }) => {
    await grantSession(context);
    await page.setViewportSize(viewport);
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      // Let data-backed screens settle past their skeletons.
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
