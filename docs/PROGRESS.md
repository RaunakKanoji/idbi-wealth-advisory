# Progress Tracker — IDBI Wealth Copilot (Track 01)

Sequence is binding: do not start a phase before the previous one's gate is met.
Last updated: 2026-07-13 (Phase 1 foundation implemented and browser-verified).

## Phase 0 — Documentation and repository alignment ✅ COMPLETE (2026-07-13)

- [x] Master context file created as `docs/context/responsive-experience-context.md`
      (supersedes `mobile-experience-context.md` — see D-003)
- [x] Six context files: mobile-first, web-experience, responsive-layout,
      device-capability, cross-platform-navigation, mobile-web-parity
- [x] Specifications F106–F120 created
- [x] Repository architecture: canonical monorepo skeleton created
      (`apps/banking`, `services/*`, `packages/*`) + `docs/architecture/repository-structure.md`
- [x] Progress tracker created (this file)
- [x] Decision log created (`docs/DECISION-LOG.md`, D-001…D-005)
- [x] Agent rules recorded in `CLAUDE.md`

## Phase 1 — Shared foundation + mobile foundation 🟨 IN PROGRESS (core landed 2026-07-13)

Specifications F001–F010 authored 2026-07-13. Implementation status
(✅ done · 🟨 partial — remainder lands with its Phase 2 consumer · ⬜ not started):

- [x] F001 — Repository/workspace foundation (npm workspaces, Node 22 via .nvmrc,
      strict TS, packages consumed as source; typecheck green)
- [x] F002 — Design tokens (Tailwind v4 @theme + tokens/safe-area/responsive/
      motion/print CSS; system fonts; breakpoints mirrored in @idbi/config)
- [x] F003 — Shared types (@idbi/types) + zod schemas (@idbi/validation)
- [x] F004 — Financial domain engine (@idbi/financial-domain: wealth health,
      goal projection, risk, allocation, recommendations; pure/deterministic).
      Unit tests still to add (parity baseline).
- [x] F005 — API envelope + @idbi/api-client (timeout, abort, typed errors);
      /api/overview BFF is thin composition only
- [x] F006 — Mock provider fixtures (@idbi/test-fixtures) incl. deliberate stale
      source; switchable outage mode still to add
- [x] F007 — Demo auth + AuthGate; deep link → sign-in → return path verified
- [x] F008 — ResponsiveAppShell + full provider composition (query, flags,
      accessibility, auth, conversation, avatar, toasts)
- [x] F009 — Typed feature flags with env overrides (all capability flags off)
- [x] F010 — @idbi/analytics event definitions + track()/useScreenView with
      platform/capability dimensions (dev transport)
- [x] Next.js app scaffolded in `apps/banking` per canonical structure; all 15
      canonical routes exist (overview live, 13 Phase 2 stubs)
- [x] F106 — Mobile-first layout system (320px verified, overflow guards,
      density limits on overview) — re-verify per feature as Phase 2 lands
- [x] F107 — Mobile application shell (header, offline banner, sheet/toast
      layers, safe areas, keyboard hook). Session-expiry UX pending real flows
- [x] F108 — Mobile bottom navigation (5 entries, More sheet, back-closes-sheet
      verified, active states, a11y labels). WebView back re-verify in Phase 6
- [ ] F109 — Mobile form experience: hooks/utilities ready
      (use-mobile-keyboard, validation schemas); step-form pattern is built with
      its first consumer (onboarding/risk forms, Phase 2)
- [x] F110 — Mobile avatar foundation (launcher + obstruction rules, avatar
      provider with static-only guard: flag/reduced-motion/weak-device).
      Full state set lands with the Phase 2 Copilot screen
- [x] F111 — Mobile performance foundation (system fonts, skeletons, request
      timeout/cancellation, bounded retries). Bundle budget assertion in CI,
      lazy chart/avatar chunks, and PWA caching land with their features

Browser-verified 2026-07-13 at 320×568 and 375×812: sign-in → overview journey,
no horizontal overflow (scrollWidth == innerWidth at 320), More-sheet back
behaviour, Copilot launcher hides on /copilot, stale-source badge, error-free
console. Desktop width renders the constrained single-column mobile layout with
one navigation pattern (per D-004; sidebar arrives Phase 5).

Known minor issue: the floating Copilot launcher can overlap the trailing edge
of the last list item at the very bottom of a scrolled page (e.g. the "Stale"
pill on /overview). Status text remains readable; revisit with F110 full states.

## Phase 2 — Complete mobile customer journey ⬜ NOT STARTED

- [ ] 1. Authentication
- [ ] 2. Mobile app shell integration
- [ ] 3. Customer profile
- [ ] 4. Consent
- [ ] 5. Financial data (connected sources)
- [ ] 6. Wealth dashboard
- [ ] 7. Wealth health
- [ ] 8. Spending
- [ ] 9. Portfolio
- [ ] 10. Risk profile
- [ ] 11. Goals
- [ ] 12. Simulation
- [ ] 13. Recommendations
- [ ] 14. Copilot
- [ ] 15. Advisor handoff
- [ ] 16. Documents
- [ ] 17. Advisory history
- [ ] 18. Settings

Gate: no desktop-specific layout work during this phase.

## Phase 3 — Mobile stabilization ⬜ NOT STARTED

- [ ] Mobile acceptance criteria complete (all F106–F111 + feature DoD)
- [ ] Mobile overflow resolved at all F120 mobile widths
- [ ] Safe-area behaviour verified
- [ ] Virtual keyboards tested
- [ ] Avatar minimization verified
- [ ] Slow-network behaviour validated
- [ ] Mobile accessibility testing complete
- [ ] Mobile performance testing complete (F111 budgets)
- [ ] Complete mobile demo validated
- [ ] Mobile end-to-end tests green

Gate: desktop expansion may not begin until all items pass.

## Phase 4 — Responsive and tablet adaptation ⬜ NOT STARTED

- [ ] F112 — Responsive breakpoint system
- [ ] F113 — Tablet layout adaptation
- [ ] F117 — Responsive chart system
- [ ] F118 — Cross-platform feature parity (matrix populated)
- [ ] F119 — Device capability fallbacks

## Phase 5 — Desktop web expansion ⬜ NOT STARTED

- [ ] F114 — Web application shell
- [ ] F115 — Web sidebar navigation
- [ ] F116 — Web Copilot split view
- [ ] Context panels, wider portfolio views, transaction tables, goal comparison

## Phase 6 — Cross-platform verification ⬜ NOT STARTED

- [ ] F120 — full test matrix executed
- [ ] Responsive visual regression tests
- [ ] Cross-platform E2E (identical financial outputs)
- [ ] Accessibility verification
- [ ] Capability fallback tests
- [ ] Mobile/WebView checks · PWA checks
- [ ] Feature-parity audit
