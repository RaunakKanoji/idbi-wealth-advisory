# F115 — Web Sidebar Navigation

| | |
| --- | --- |
| Phase | 5 — Desktop web expansion |
| Status | Not started |
| Depends on | F112, F114 |

## Scope

Persistent compact sidebar for desktop viewports (≥1024px).

## Entries

Overview · Wealth Health · Copilot · Portfolio · Spending · Goals · Recommendations ·
Simulator · Documents · Notifications · Settings

(Same canonical routes as mobile — see cross-platform-navigation-context.md. Consent,
Profile, and Advisor remain reachable via Settings/header/feature entry points.)

## Requirements

- Collapsible state (icon-only) with the choice persisted per customer.
- Accessible labels in collapsed mode (tooltips + `aria-label`; not tooltip-only).
- Persistent, non-colour-only active state; `aria-current="page"`.
- Full keyboard accessibility (arrow/tab navigation, visible focus).
- Compact width; no excessive horizontal space consumption.
- No duplicate bottom navigation on desktop (Decision D-004).

## Acceptance criteria

- [ ] All eleven entries route correctly; active state correct on deep links
- [ ] Collapsed mode passes screen-reader and keyboard testing
- [ ] Collapse preference persists across sessions
- [ ] Never rendered below 1024px; bottom nav never rendered at ≥1024px
