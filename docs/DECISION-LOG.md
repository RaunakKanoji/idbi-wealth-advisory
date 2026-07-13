# Decision Log

Architecture and product decisions. Intentional mobile/web differences must be
recorded here (Agent rule 17).

---

## D-001 — Single responsive Next.js application (2026-07-13)

**Status:** Accepted (finalized cross-platform architecture decision)

**Context:** Track 01 must serve mobile browsers, PWA installs, embedded banking
WebViews, tablets, and desktop portals within hackathon constraints.

**Decision:** Build one responsive Next.js application in `apps/banking/` rather
than separate React Native and web applications. Do not create `apps/mobile/` or
`apps/web/`. Mobile is the primary implementation target; tablet and desktop are
responsive adaptations of the same product.

**Consequences:** One route hierarchy and one set of feature modules; shared
business logic in `packages/` and `services/`; native Android/iOS apps can later
consume the same backend, domain services, calculation engines, suitability
services, recommendation services, and conversational AI tools.

---

## D-002 — Mobile-first implementation sequencing (2026-07-13)

**Status:** Accepted

**Decision:** Phase order is binding: shared foundation → mobile foundation →
complete mobile customer journey → mobile stabilization → tablet adaptation →
desktop web enhancement → cross-platform parity verification. Desktop layout work
must not begin before the mobile journeys are functional and stabilized (Phase 3
gate in PROGRESS.md).

---

## D-003 — Context file rename (2026-07-13)

**Status:** Accepted

**Decision:** `docs/context/mobile-experience-context.md` is superseded by
`docs/context/responsive-experience-context.md`, which defines the relationship
between mobile, tablet, desktop, WebView, and PWA experiences.

**Note:** The repository was empty at the time of this change, so the new file was
created directly; no physical rename occurred. Any external references to
`mobile-experience-context.md` should point to the new file.

---

## D-004 — Navigation pattern per breakpoint (2026-07-13)

**Status:** Accepted (interpretation of the architecture decision)

**Decision:** Exactly one navigation pattern renders at a time:
bottom navigation < 768px; navigation rail (or compact sidebar) 768–1023px;
compact collapsible sidebar ≥ 1024px. The Copilot split view activates at ≥1024px;
its FinancialContextPanel defaults open at ≥1280px and is collapsible at 1024–1279px.

**Rationale:** The source decision mandates the patterns and prohibits showing
mobile and desktop navigation simultaneously, but leaves the exact switch points to
implementation. These map to the canonical `md`/`lg`/`xl` breakpoints.

---

## D-005 — Sidebar entry set vs mobile More menu (2026-07-13)

**Status:** Accepted (interpretation)

**Decision:** The desktop sidebar carries the eleven mandated entries (Overview,
Wealth Health, Copilot, Portfolio, Spending, Goals, Recommendations, Simulator,
Documents, Notifications, Settings). Consent, Profile, and Advisor handoff — present
in the mobile More menu — remain reachable on desktop via Settings and the desktop
header/feature entry points. This is a LAYOUT_VARIANT of navigation, not a feature
gap; all routes exist on all surfaces.

---

## D-006 — In-memory demo store for customer edits (2026-07-13)

**Status:** Accepted (hackathon scope)

**Context:** Phase 2 forms (financial profile, risk, consent, goal creation,
advisor requests) need persistence, but the hackathon has no database.

**Decision:** Customer edits persist in a server-process-scoped in-memory store
(`apps/banking/lib/api/store.ts`, hung off `globalThis` to survive dev HMR).
The snapshot builder consumes the store, so edits and consent changes recompute
every downstream number in the BFF. State resets on server restart.

**Consequences:** The full journey is demonstrable end to end with real
recalculation; consent enforcement lives server-side per the parity rules.
Replacing the store with real services later changes only `store.ts` and the
snapshot builder — no screen or schema changes.

---

<!-- Template
## D-XXX — Title (YYYY-MM-DD)
**Status:** Proposed | Accepted | Superseded by D-YYY
**Context:** …
**Decision:** …
**Consequences:** …
-->
