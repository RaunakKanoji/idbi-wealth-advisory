# F109 — Mobile Form Experience

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F106, F107; shared validation schemas (`packages/validation`) |

## Scope

Step-based mobile form pattern applied to: onboarding, financial profile, risk
profiling, goal creation, consent, advisor handoff, and settings. On web the same
form may group related fields together but must preserve identical validation and
completion logic (LAYOUT_VARIANT — see F118).

## Requirements

- Step-based flow, one concept/subject per step.
- Clear progress indicator throughout onboarding and risk profiling.
- Back and continue controls; continue is sticky and keyboard-aware.
- Save and resume: drafts persist; returning customers continue where they left off.
- Inline validation on fields plus an error summary that receives focus on failed
  submit and links to offending fields.
- Correct input modes: numeric for amounts, appropriate keyboards per field; date
  and currency inputs optimized for touch.
- Accessible labels, descriptions, and error associations (`aria-describedby`).
- Confirmation before abandoning material changes.
- No horizontally scrolling forms; no long unbroken pages of questions.
- Virtual keyboard never covers the focused input or the primary action.

## Acceptance criteria

- [ ] All seven flows use the shared step pattern
- [ ] Validation logic imported from `packages/validation` — no per-step duplicates
- [ ] Save/resume verified across session interruption
- [ ] Error summary + inline errors pass screen-reader testing
- [ ] Verified with virtual keyboard open at 320px and 390px widths
- [ ] Web grouped variant produces identical validation outcomes (parity test)
