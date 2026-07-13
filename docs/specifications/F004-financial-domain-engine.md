# F004 — Financial Domain Engine

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F003 |

## Scope

`packages/financial-domain`: pure, deterministic, platform-independent financial
logic. This is the single source of financial truth behind the core invariant —
identical outputs for identical inputs on every surface.

## Functions (initial set)

- `computeWealthHealth(input)` → score 0–100, band, weighted pillars (savings rate,
  emergency fund, diversification, debt load, goal funding), text summary.
- `projectGoal(goal, asOfYear)` → projected value (SIP future value + corpus
  growth), required monthly contribution, shortfall, on-track flag.
- `assessRisk(answers)` → risk score and category from questionnaire answers.
- `analyzeAllocation(holdings)` → allocation by asset class + concentration flags.
- `deriveBasicRecommendations(snapshot)` → deterministic, evidence-backed
  recommendations from the computed metrics (interim home for recommendation logic
  until `services/recommendation-engine` exists — same shared-source rule applies).

## Requirements

- Pure functions only: no I/O, no dates from the environment (time passed in), no
  randomness, no React/DOM imports.
- Chart-ready series derive from these functions (F117: no separate chart math).
- Unit tests with fixed fixtures asserting exact outputs (parity baseline).

## Acceptance criteria

- [ ] Same fixture → byte-identical JSON output across repeated runs
- [ ] No `Date.now()`/`new Date()` without an injected time parameter
- [ ] Consumed only via the BFF/services and shared hooks — never re-implemented in
      components
