# F108 — Mobile Bottom Navigation

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F106; routes per cross-platform-navigation-context.md |

## Scope

Primary navigation for viewports < 768px. Rendered only on mobile — never together
with the tablet rail or desktop sidebar.

## Entries (exactly five)

1. Home → `/overview`
2. Wealth → `/wealth-health`
3. Copilot → `/copilot` — central action; may receive additional visual emphasis
   without obstructing content
4. Goals → `/goals`
5. More → More sheet (Spending, Portfolio, Recommendations, Simulator, Documents,
   Consent, Notifications, Profile, Settings)

## Requirements

- Clear active state (not colour-only).
- Accessible labels on every entry; `aria-current` on the active item.
- Touch targets ≥ 44×44px (48 preferred) with adequate spacing.
- Safe-area bottom inset support.
- No more than five primary entries — additional destinations live in More.
- Correct browser/WebView back behaviour: back closes the More sheet or any open
  sheet first, then navigates history.
- Feature state preserved when switching tabs (scroll position, form drafts,
  conversation state per feature rules).

## Acceptance criteria

- [ ] Five entries, correct routes, active state correct on deep links
- [ ] Screen reader announces name + active state; keyboard operable
- [ ] Usable at 320px without label truncation breaking meaning
- [ ] Hidden at ≥768px where rail/sidebar takes over — never both at once
- [ ] Back behaviour verified in browser and embedded WebView
