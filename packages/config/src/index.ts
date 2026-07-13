/**
 * Shared configuration constants. Single source of truth for values that must be
 * identical across CSS, JS, and future native surfaces (F002, F112).
 *
 * The breakpoint values intentionally match Tailwind's defaults — if either side
 * ever changes, both must change together.
 */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = "base" | keyof typeof breakpoints;

export const breakpointOrder = ["base", "sm", "md", "lg", "xl", "2xl"] as const satisfies readonly Breakpoint[];

/** Minimum touch target size (F106; 48px preferred for primary actions). */
export const TOUCH_TARGET_MIN_PX = 44;

/** Height of the mobile bottom navigation, excluding the safe-area inset.
 *  Mirrored by --bottom-nav-height in apps/banking/styles/tokens.css. */
export const BOTTOM_NAV_HEIGHT_PX = 64;

/** Default API request timeout (F005/F111: explicit UX after this, never spinners). */
export const API_TIMEOUT_MS = 10_000;

/** Data older than this is presented as stale (freshness badges). */
export const STALE_AFTER_HOURS = 24;
