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

## Phase 2 — Complete mobile customer journey ✅ FEATURE-COMPLETE (2026-07-13)

Tranche 1: bot avatar, conversational Copilot (deterministic BFF brain on the
shared snapshot), wealth-health/portfolio/goals/recommendations screens.
Tranche 2: F109 step-form system (StepShell, fields, save/resume drafts),
financial profile + risk questionnaire + consent flows with a server-side demo
store (D-006) — profile edits and consent changes recompute the whole dashboard
in the BFF; spending (transactions + month-over-month summary); goal creation;
live what-if simulator; advisor handoff; documents + advisory history;
notifications; settings with sign-out.

- [x] 1. Authentication (demo)
- [x] 2. Mobile app shell integration
- [x] 3. Customer profile (5-step form; prefill, drafts, review, recalculation)
- [x] 4. Consent (management screen; withdrawal warning; BFF enforcement —
      AA off removes AA holdings, marks sources unavailable, recomputes score)
- [x] 5. Financial data (source freshness on overview; consent controls sharing)
- [x] 6. Wealth dashboard (overview)
- [x] 7. Wealth health (pillar breakdown + explanations)
- [x] 8. Spending (month total, MoM delta, category bars, transactions)
- [x] 9. Portfolio (allocation, concentration warnings, holdings)
- [x] 10. Risk profile (6-question step flow → domain scoring → category)
- [x] 11. Goals (list + projections + gap analysis + 4-step creation flow)
- [x] 12. Simulation (live sliders through the same projection engine)
- [x] 13. Recommendations (full list with evidence)
- [x] 14. Copilot — text conversation, suggested prompts, avatar states,
      offline fallback, spending intent; deterministic keyword brain is the
      placeholder for services/conversational-ai
- [x] 15. Advisor handoff (2-step request → reference id → confirmation)
- [x] 16. Documents (list with type/date)
- [x] 17. Advisory history (timeline on the Documents screen)
- [x] 18. Settings (account, section links, accessibility status, sign out)

Verified 2026-07-13 at 320px (no overflow on any route) and via API checks:
profile save recomputed score 72→74 and savings ₹63K→₹1.33L; AA consent
withdrawal shrank the portfolio to IDBI-only data and recomputed the score to
65; simulator flips on-track/falls-short live. Build green (35 pages).

Remaining for Phase 3 (stabilization): virtual-keyboard testing on real
devices, WebView back behaviour, slow-network journey run, screen-reader pass,
F111 bundle budget assertion in CI, mobile E2E suite.

Gate: no desktop-specific layout work during this phase. ✅ Held.

## Phase 3 — Mobile stabilization 🟨 AUTOMATED GATE GREEN (2026-07-13); manual device pass outstanding

Automated suite (runs locally and in CI — `.github/workflows/ci.yml`):
37 Playwright E2E tests (journey, responsive, resilience, a11y, parity) +
9 exact-output unit tests for the financial domain engine + bundle budget.

- [x] Mobile overflow: zero horizontal overflow on all 17 routes × 4 F120
      mobile widths (320/360/390/412) — automated in responsive.spec.ts
- [x] Complete mobile demo validated — journey.spec.ts covers sign-in, deep-link
      gating, More-sheet back behaviour, wealth health, Copilot conversation +
      persistence, profile step flow with dashboard recalculation, consent
      withdrawal enforcement, risk questionnaire, sign-out
- [x] Avatar minimization verified (hide/show in journey E2E)
- [x] Slow-network + failure behaviour validated — skeletons on delay, explicit
      error state + working retry on abort, offline banner + Copilot fallback
- [x] Accessibility (automated floor): axe serious/critical = 0 on all routes;
      fixed a real contrast violation (--color-positive on primary-soft pills)
- [x] Performance: F111 bundle budget enforced in CI (33 routes ≤200 kB first
      load, shared 102 kB ≤150 kB); system fonts, lazy data, no blocking assets
- [x] Mobile end-to-end tests green (37/37)
- [x] Parity baseline: exact-output unit tests pin the engine (F004); API
      determinism + Copilot-quotes-goals-API tests pin cross-surface parity
- [~] Safe-area behaviour: env() utilities implemented and regression-safe;
      **manual check on a notched device still required**
- [~] Virtual keyboards: keyboard-aware sticky actions implemented;
      **manual check on real iOS/Android keyboards still required**
- [~] Screen reader: **manual VoiceOver/TalkBack pass still required**
- [ ] Embedded WebView back-behaviour check in a real banking WebView

Gate: desktop expansion may not begin until all items pass. The four remaining
items need physical devices — everything automatable is green and enforced.

## Phase 4 — Responsive and tablet adaptation ✅ COMPLETE (2026-07-13)

- [x] F112 — Responsive breakpoint system: navigation switched exclusively via
      `use-breakpoint` + `@idbi/config`; `--bottom-nav-height` collapses at md
      so nav-offset spacing adapts by token, not per-component logic
- [x] F113 — Tablet layout adaptation: navigation rail at ≥768px carrying every
      destination (D-007), never alongside the bottom nav (E2E-enforced);
      two-column layouts on overview/wealth-health/goals/recommendations/
      spending; side-by-side related form fields; portrait + landscape
      overflow-tested (768×1024, 1024×768). Tablet Copilot stays a centered
      full conversation — the split view is Phase 5 (F116).
- [x] F117 — Responsive chart system: allocation donut (≥768px) rendered from
      the same domain AllocationSlice data as the mobile bar list; legend and
      bars carry values in text — no colour-only meaning; E2E asserts the
      expanded chart is tablet-only
- [x] F118 — Parity matrix updated with the tablet column
- [x] F119 — Device capability fallback tests: reduced-motion conversation,
      voice-absent text baseline, static avatar, push→in-app notifications
      (plus the Phase 3 offline suite)

E2E suite now 47 tests, all green; bundle budget unchanged (shared 102 kB).
Interim: the rail also serves ≥1024px until the Phase 5 desktop sidebar (D-007).

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
