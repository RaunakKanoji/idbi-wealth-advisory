# F106 — Mobile-First Layout System

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | Design tokens (F00x foundation), `docs/context/responsive-layout-context.md` |

## Scope

The base CSS/layout system every feature builds on. Mobile-default styles; larger
screens are additive enhancements.

## Requirements

- Mobile-default CSS: base styles target 320px+; `sm/md/lg/xl/2xl` add enhancements.
- Single-column primary layouts as the default page pattern.
- Responsive spacing tokens (shared scale in `styles/tokens.css`; no ad-hoc values).
- Safe content widths per breakpoint (see responsive-layout-context.md); prose ≤ ~70ch.
- Horizontal-overflow protection: global guards + per-container `overflow-x: auto`
  wrappers for wide content; the page body never scrolls horizontally.
- Mobile card-density limits: ≤3 primary metrics per visible group; one
  recommendation per card; ≤3 top recommendations on overview; no nested cards.
- Responsive typography from tokens; readable at large text settings and 200% zoom.
- Sticky mobile actions: keyboard-aware bottom action bars above bottom navigation.
- Safe-area utilities (`styles/safe-area.css`) applied by shell, nav, sheets, toasts.

## Acceptance criteria

- [ ] Every primary route works at 320px
- [ ] No unintended horizontal scrolling exists (asserted in responsive tests)
- [ ] Critical information appears before secondary information (DOM order)
- [ ] Desktop overrides are not required for mobile usability
- [ ] Spacing/typography come from tokens; no hard-coded breakpoint values in features
