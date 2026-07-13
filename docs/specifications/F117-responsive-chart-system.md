# F117 — Responsive Chart System

| | |
| --- | --- |
| Phase | 4 — Responsive and tablet adaptation |
| Status | Not started |
| Depends on | F106, F112; shared data transformations (`packages/financial-domain`) |

## Scope

One chart system serving simplified mobile views and expanded web views from the
same data. **Do not build separate chart calculations for mobile and web.**

## Requirements

- Simplified mobile charts: fewer series/gridlines, larger touch targets, concise
  text summary rendered with every chart.
- Expanded web charts only where added detail improves understanding.
- Accessible labels; text summaries convey the chart's meaning without the visual.
- Touch tooltips (coarse pointers) and pointer tooltips (fine pointers) — both
  keyboard reachable.
- Table or list fallbacks where more accessible; user-switchable where practical.
- Responsive legends that never overflow horizontally.
- No colour-only meaning: pair colour with pattern, shape, or direct labels.
- Shared data transformations and calculation sources: chart-ready series come from
  `packages/financial-domain`; components only render.

## Acceptance criteria

- [ ] Identical underlying data verified between mobile and web renderings of the
      same chart (parity fixture test)
- [ ] Every chart has a text summary and an accessible fallback
- [ ] Charts usable at 320px with no horizontal page overflow
- [ ] Colour-blind review passes (no colour-only distinctions)
- [ ] Charts lazy-load (F111) and render tooltips for touch, mouse, and keyboard
