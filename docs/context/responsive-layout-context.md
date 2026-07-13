# Responsive Layout Context

Centralized layout rules for the single responsive application. Implemented by the
mobile-first layout system (F106) and breakpoint system (F112). All default styles
target mobile; larger-screen enhancements are strictly additive.

## Breakpoints (canonical)

```text
Base: 320px and above    (mobile)
sm:   640px and above    (large mobile)
md:   768px and above    (tablet)
lg:   1024px and above   (laptop / desktop)
xl:   1280px and above   (desktop)
2xl:  1536px and above   (wide desktop)
```

Defined once in the design tokens / Tailwind config; never hard-coded per component.
Use CSS media queries for visual layout; use JavaScript (via `use-breakpoint.ts`)
only when component *behaviour* genuinely differs.

## Container widths

- Base–sm: full width, 16px gutters (safe-area aware).
- md: max content width ~720px or two columns.
- lg: max content width ~960–1080px plus navigation.
- xl/2xl: max content width ~1200–1320px; extra space goes to context panels and
  whitespace, not wider text lines (prose ≤ ~70ch).

## Grid behaviour

- Mobile: single primary content column.
- md: optional 2-column where comprehension improves.
- lg+: up to 3 regions (navigation + main + context panel). Never more.

## Responsive spacing and typography

- Spacing and type scale from shared tokens (`styles/tokens.css`); step up modestly
  at md and lg. No per-component ad-hoc values.
- Line lengths capped for readability; headings scale with viewport via tokens.

## Card stacking and density

- Mobile: cards stack vertically; max three primary metrics per visible group; one
  recommendation per card; max three top recommendations on the overview; no cards
  nested in multiple cards; horizontal carousels only for appropriate collections.
- md+: cards may sit side-by-side when related; detailed evidence stays in sheets
  (mobile) or side panels (web).

## Content-priority rules

- The most important financial information renders first in DOM order on every
  viewport. Larger layouts reposition visually (CSS grid areas), not by reordering
  the DOM, so screen-reader order stays stable.

## Visibility rules

- Nothing business-critical is hidden by viewport. `hidden md:block`-style utilities
  are allowed only for redundant presentation (e.g. an icon-only vs labeled control),
  never for features. Parity classes are governed by F118.

## Navigation transitions

```text
< 768px      MobileBottomNavigation + MobileHeader
768–1023px   TabletNavigationRail (or compact sidebar) — no bottom navigation
≥ 1024px     DesktopSidebar (compact, collapsible) + DesktopHeader
```

Exactly one navigation pattern is rendered at a time (Decision D-004).

## Split-view activation

- Copilot split view (conversation + avatar + financial context) activates at lg.
- The FinancialContextPanel defaults open at xl, collapsible at lg, and becomes
  in-conversation context cards below lg.

## Responsive chart rules

- Mobile: simplified series, larger touch targets, text summary below the chart.
- lg+: expanded detail only when it improves understanding.
- Same data source and transformation everywhere; list/table fallback available.

## Horizontal-overflow prevention

- The page body never scrolls horizontally at any tested width (from 320px).
- Wide content (tables, code, wide charts) scrolls inside its own
  `overflow-x: auto` container with visible affordance.
- CI/responsive tests assert `document.documentElement.scrollWidth <= innerWidth`
  on every primary route at every F120 width.
