# F003 — Shared Types and Validation Schemas

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F001 |

## Scope

`packages/types` (data models) and `packages/validation` (zod schemas). One data
model and one validation source for every surface and the BFF — platform-specific
data models are prohibited (mobile-web-parity-context.md).

## Requirements

- `@idbi/types`: customer, financial profile, risk (category, questionnaire),
  holdings/portfolio, goals + projections, wealth health score (with pillars),
  recommendations (with evidence), consent, data-source status, conversation
  message, avatar state names, API envelope (`{ data, asOf, sources }`).
- `@idbi/validation`: zod schemas for financial profile, risk questionnaire, goal
  creation, and consent; types exported via `z.infer` so forms, BFF, and services
  validate identically.
- Amounts are INR numbers formatted only at the presentation edge
  (`Intl.NumberFormat('en-IN')`).
- No React/DOM imports in either package (platform-independent).

## Acceptance criteria

- [ ] Forms and BFF import the same schema instance for a given flow
- [ ] `z.infer` types used — no hand-duplicated form types
- [ ] Packages compile with no platform dependencies
