# F010 — Observability and Analytics Foundation

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F001, F008 |

## Scope

Shared analytics event definitions and an app-side tracking/error-reporting
foundation. Event **names and schemas are identical on every surface** — platform
is a dimension, never part of the name (parity rule; Agent rule 11).

## Requirements

- `@idbi/analytics`: typed event-name constants + payload types. Initial events:
  `screen_viewed`, `signin_started`, `signin_completed`,
  `navigation_tab_selected`, `more_menu_opened`, `copilot_launcher_tapped`,
  `recommendation_viewed`, `error_shown`.
- `lib/analytics/`: `track()` adapter (console/dev transport for the hackathon,
  swappable later) + `useScreenView(screen)` hook; automatically attaches platform
  and capability dimensions.
- Error observability: root error boundaries report through the same adapter
  (`error_shown`); API-client timeouts/failures are trackable.
- Capability fallbacks fire the same event names with a capability dimension (F119).

## Acceptance criteria

- [ ] No string-literal event names at call sites — constants from `@idbi/analytics` only
- [ ] The same journey emits the same event sequence at mobile and desktop widths
      (later verified in F120)
- [ ] Errors and timeouts visible in the dev transport
