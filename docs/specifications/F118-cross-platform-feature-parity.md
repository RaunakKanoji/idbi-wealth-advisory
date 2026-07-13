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
| Consent management | ✅ | base | base | FULL_PARITY (required) | Enforcement in BFF snapshot: AA withdrawal filters holdings/sources everywhere |
| Financial profile | ✅ | base | base | FULL_PARITY (required) | 5-step mobile form (F109); web may group fields = LAYOUT_VARIANT, same schema |
| Risk profiling | ✅ | base | base | FULL_PARITY (required) | 6-step questionnaire; scoring in domain engine |
| Wealth health score | ✅ | base | base | FULL_PARITY (required) | Pillars + explanations from shared engine |
| Spending behaviour | ✅ | base | base | FULL_PARITY (required) | summarizeSpending in domain engine; Copilot quotes same numbers |
| Portfolio health | ✅ | base | base | FULL_PARITY (required) | Web adds tables (WEB_ENHANCEMENT presentation) |
| Goals + simulations | ✅ | base | base | FULL_PARITY (required) | Creation flow + live simulator via the same projectGoal engine |
| Recommendations | ✅ | base | base | FULL_PARITY (required) | Evidence screen live; same recs on overview/Copilot |
| Copilot conversation | ✅ text | base | base | FULL_PARITY (required) | Deterministic brain on shared snapshot; split view = LAYOUT_VARIANT (F116); voice = CAPABILITY_FALLBACK |
| Advisor handoff | ✅ | base | base | FULL_PARITY (required) | 2-step request; reference id; context-sharing note |
| Documents / advisory history | ✅ | base | base | FULL_PARITY (required) | Preview/download pending storage integration (all surfaces equally) |
| Notifications | ✅ | base | base | FULL_PARITY | In-app feed; push = CAPABILITY_FALLBACK to in-app (F119) |
| Settings | ✅ | base | base | FULL_PARITY | Includes sign-out and accessibility status |

## Verification

- [ ] Every shipped feature has a row before merge
- [ ] Parity fixture tests: same customer data → identical scores, projections,
      recommendations, suitability outcomes at mobile and desktop viewports
- [ ] Identical analytics event names verified per journey
- [ ] All NOT_SUPPORTED rows link to a decision-log entry
- [ ] Phase 6 parity audit completes with zero unjustified gaps
