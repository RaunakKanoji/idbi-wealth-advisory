# F008 — Application Shell Foundation and Providers

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F001, F002 |

## Scope

The cross-viewport `ResponsiveAppShell` and the provider composition every route
renders inside. F107 specifies the mobile presentation of this shell; F114 later
adds the desktop presentation. One shell — viewport variants, not separate apps.

## Structure

- `providers/app-provider.tsx` composes: query (TanStack Query), feature flags,
  accessibility (reduced motion), auth, conversation, avatar, toasts.
- `components/shell/responsive-app-shell.tsx` renders the viewport-appropriate
  chrome (Phase 1: mobile chrome at all widths, content width constrained;
  rail/sidebar arrive in Phases 4–5 behind the same shell).
- Root layout: `viewport-fit=cover`, theme color, manifest link, system font,
  skip link, landmarks (`header`/`main`/`nav`), route-level `loading.tsx`,
  `error.tsx`, `not-found.tsx`.

## Requirements

- Conversation state lives in a provider so it survives route transitions (F116
  depends on this).
- Query client defaults: bounded retries, no refetch storms, sensible staleTime.
- Offline indicator wired from `use-network-status` at shell level.
- Error boundary reports through the observability foundation (F010).

## Acceptance criteria

- [ ] Every authenticated route renders inside the shell with correct landmarks
- [ ] Conversation provider state survives navigating away and back
- [ ] Skip link, `lang`, viewport meta, and manifest present
- [ ] Shell renders without JavaScript errors offline
