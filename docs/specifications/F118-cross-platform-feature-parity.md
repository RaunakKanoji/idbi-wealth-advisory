# F118 — Cross-Platform Feature Parity

| | |
| --- | --- |
| Phase | 4 — Responsive and tablet adaptation (maintained continuously thereafter) |
| Status | Not started |
| Depends on | mobile-web-parity-context.md |

## Scope

A living parity matrix classifying every Track 01 feature. Updated whenever a
feature is introduced (Agent rule 16).

## Classification

```text
FULL_PARITY | LAYOUT_VARIANT | CAPABILITY_FALLBACK | WEB_ENHANCEMENT |
MOBILE_ENHANCEMENT | NOT_SUPPORTED (requires decision-log justification)
```

Financial guidance, recommendations, suitability, consent, goals, and financial
calculations must always be FULL_PARITY.

## Parity matrix

> Populated as features land in Phase 2+. Every feature PR adds/updates its row.

Legend: ✅ implemented · base = functional via the mobile-first responsive layout
(dedicated tablet/desktop LAYOUT_VARIANTs arrive in Phases 4–5) · — not built yet.

| Feature | Mobile | Tablet | Desktop | Class | Notes / decision ref |
| --- | --- | --- | --- | --- | --- |
| Authentication | ✅ (demo) | base | base | FULL_PARITY (required) | Demo IdP behind real provider interface (F007) |
| Overview dashboard | ✅ | base | base | FULL_PARITY (required) | Same snapshot as all other surfaces |
| Consent management | — | — | — | FULL_PARITY (required) | |
| Financial profile | — | — | — | FULL_PARITY (required) | Step form vs grouped fields = LAYOUT_VARIANT presentation |
| Risk profiling | — | — | — | FULL_PARITY (required) | |
| Wealth health score | ✅ | base | base | FULL_PARITY (required) | Pillars + explanations from shared engine |
| Spending behaviour | — | — | — | FULL_PARITY (required) | Needs transaction fixtures |
| Portfolio health | ✅ | base | base | FULL_PARITY (required) | Web adds tables (WEB_ENHANCEMENT presentation) |
| Goals + simulations | ✅ view | base | base | FULL_PARITY (required) | Projections live; creation form + simulator pending |
| Recommendations | ✅ | base | base | FULL_PARITY (required) | Evidence screen live; same recs on overview/Copilot |
| Copilot conversation | ✅ text | base | base | FULL_PARITY (required) | Deterministic brain on shared snapshot; split view = LAYOUT_VARIANT (F116); voice = CAPABILITY_FALLBACK |
| Advisor handoff | — | — | — | FULL_PARITY (required) | |
| Documents / advisory history | — | — | — | FULL_PARITY (required) | |
| Notifications | — | — | — | FULL_PARITY | Push = CAPABILITY_FALLBACK to in-app |
| Settings | — | — | — | FULL_PARITY | |

## Verification

- [ ] Every shipped feature has a row before merge
- [ ] Parity fixture tests: same customer data → identical scores, projections,
      recommendations, suitability outcomes at mobile and desktop viewports
- [ ] Identical analytics event names verified per journey
- [ ] All NOT_SUPPORTED rows link to a decision-log entry
- [ ] Phase 6 parity audit completes with zero unjustified gaps
