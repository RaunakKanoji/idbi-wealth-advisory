# F113 — Tablet Layout Adaptation

| | |
| --- | --- |
| Phase | 4 — Responsive and tablet adaptation |
| Status | Not started |
| Depends on | F112; mobile journey stabilized (Phase 3 complete) |

## Scope

Adapt the stabilized mobile product for tablet viewports (768–1023px), portrait and
landscape.

## Requirements

- Navigation rail or compact sidebar (one of them — never together with the mobile
  bottom navigation).
- Two-column layouts where useful (summary + supporting insight); collapse cleanly
  back to mobile order.
- Wider forms: same step logic; fields may sit side by side where related.
- Expanded summary cards without exceeding density rules.
- Tablet-safe chart layouts (F117): more detail than mobile only where it helps.
- Portrait and landscape support at 768×1024 and 1024×768.
- Tablet Copilot presentation: full-screen conversation remains valid; split view
  activates at lg per responsive-layout-context.md.

## Acceptance criteria

- [ ] No route renders both bottom navigation and a sidebar/rail simultaneously
- [ ] All Phase 2 journeys pass at 768×1024 and 1024×768
- [ ] Two-column layouts preserve DOM/reading order from mobile
- [ ] Forms produce identical validation/completion outcomes as mobile (parity test)
- [ ] Touch targets and keyboard operability preserved
