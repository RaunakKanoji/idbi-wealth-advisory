# Mobile-First Context

Mobile is the **primary delivery surface** for IDBI Wealth Copilot. Every feature is
designed, implemented, tested, and stabilized on mobile before larger screens are
considered. Related spec: F106–F111.

## One-handed interaction

- Primary actions sit within thumb reach: bottom third of the screen, or sticky
  bottom action bars above the bottom navigation.
- Destructive or irreversible actions may sit outside thumb reach deliberately, but
  must still be reachable.
- No interaction may require two simultaneous touch points.

## Touch targets

- Minimum interactive target: **44×44 CSS px** (48×48 preferred for primary actions).
- Minimum 8px spacing between adjacent targets.
- Small visual glyphs (e.g. info icons) get an enlarged invisible hit area, not a
  larger glyph.

## Thumb-reach guidance

- Bottom navigation: primary sections (Home, Wealth, Copilot, Goals, More).
- Form "Continue" actions: sticky at the bottom, keyboard-aware.
- Top-of-screen elements are for orientation (titles, progress), not frequent actions.

## Safe areas

- Use `env(safe-area-inset-*)` via the shared utilities in `styles/safe-area.css`.
- Bottom navigation, sticky action bars, sheets, and toasts must respect the bottom
  inset; headers respect the top inset.
- WebView embeds must not assume browser chrome provides spacing.

## Virtual keyboard behaviour

- The focused input and the primary action must remain visible while the keyboard is
  open (use `visualViewport` / keyboard-aware layout, see `use-mobile-keyboard.ts`).
- Never place required actions where the keyboard covers them.
- Dismiss the keyboard on step transitions; restore scroll position on dismiss.
- Use correct `inputmode`/`type`: numeric for amounts, tel for phone, email for email;
  currency and date inputs are touch-optimized components.

## Mobile form patterns

- Step-based flows: one subject per step, visible progress, back/continue, save and
  resume, inline validation plus an error summary. No horizontally scrolling forms,
  no long unbroken pages of questions. See F109.

## Mobile avatar behaviour

- Large avatar only during greeting/onboarding/risk questionnaire; compact during
  extended conversation; floating launcher outside the Copilot screen; static
  fallback on weak devices; honors reduced motion. The avatar never obstructs form
  fields, primary actions, bottom navigation, error messages, or disclosures. See F110.

## Mobile chart simplification

- Simplified chart views with concise text summaries; touch tooltips; no unreadable
  labels; list/table fallback where more accessible. Same source data and
  transformations as web. See F117.

## Mobile loading and error states

- Skeleton states for shell and cards; route-level loading states; explicit error,
  stale-data, empty, and offline states; cached last-known summaries with freshness
  warnings where consent allows.

## Minimum width

- Every primary route works at **320px** with no horizontal overflow. This is tested,
  not assumed (F120 matrix starts at 320×568).

## Large text

- Remains usable at large OS text settings and 200% browser zoom (WCAG 1.4.4):
  no clipped labels, no overlapping controls, no lost actions.

## Mobile performance requirements

- Fast first content render; small initial JS bundle; lazy avatar and chart loading;
  cached shell assets; optimized images; minimal blocking fonts; request timeouts and
  cancellation. Targets and budgets: see F111.
- The dashboard remains usable when avatar assets are loading, voice services are
  unavailable, market data is delayed, an Account Aggregator provider is down, or the
  connection is slow.

## Mobile definition of done

A feature is complete only when all of the following hold:

- [ ] Works at 320px width
- [ ] No horizontal overflow
- [ ] All primary actions reachable (one-handed for common flows)
- [ ] Touch targets ≥ 44×44px
- [ ] Forms work with the virtual keyboard
- [ ] Loading, error, stale, and empty states implemented
- [ ] Avatar does not block content
- [ ] Screen-reader semantics present
- [ ] Tested on a mobile viewport
