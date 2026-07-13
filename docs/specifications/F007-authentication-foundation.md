# F007 — Authentication and Session Foundation

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F001, F008 |

## Scope

Session foundation with identical rules on every surface. Hackathon scope is a
**demo authentication** (fixture customer) behind the same provider interface a
real bank IdP would use later.

## Requirements

- `providers/auth-provider.tsx`: session states `loading | signed-in | signed-out`;
  `signIn`/`signOut`; session persisted for the demo (survives reload).
- All `(banking)` routes gated: signed-out users are redirected to `/sign-in`
  before content renders; a loading state (skeleton) covers session resolution.
- Sign-in screen follows mobile form rules (F109): 320px-safe, ≥44px targets,
  keyboard-safe, accessible labels.
- Authorization rules live outside components (shared lib), identical across
  viewports; no viewport-dependent auth behaviour.
- Session expiry state surfaced by the shell (F107) with a re-auth path.
- Analytics: `signin_started`, `signin_completed` — same names on all surfaces.

## Acceptance criteria

- [ ] Deep link to a banking route while signed out lands on `/sign-in`, then
      returns to the requested route after sign-in
- [ ] No authenticated content flashes before the gate resolves
- [ ] Demo credential handling contains no real credential entry
