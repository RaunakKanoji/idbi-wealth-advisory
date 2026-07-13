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

| Feature | Mobile | Tablet | Desktop | Class | Notes / decision ref |
| --- | --- | --- | --- | --- | --- |
| Authentication | — | — | — | FULL_PARITY (required) | |
| Consent management | — | — | — | FULL_PARITY (required) | |
| Financial profile | — | — | — | FULL_PARITY (required) | Step form vs grouped fields = LAYOUT_VARIANT presentation |
| Risk profiling | — | — | — | FULL_PARITY (required) | |
| Wealth health score | — | — | — | FULL_PARITY (required) | |
| Spending behaviour | — | — | — | FULL_PARITY (required) | |
| Portfolio health | — | — | — | FULL_PARITY (required) | Web adds tables (WEB_ENHANCEMENT presentation) |
| Goals + simulations | — | — | — | FULL_PARITY (required) | |
| Recommendations | — | — | — | FULL_PARITY (required) | |
| Copilot conversation | — | — | — | FULL_PARITY (required) | Split view = LAYOUT_VARIANT; voice = CAPABILITY_FALLBACK |
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
