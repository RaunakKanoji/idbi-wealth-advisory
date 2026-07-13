# F005 — API Contract and Client

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F003, F004 |

## Scope

One API contract and one typed client (`packages/api-client`) for every surface.
During the hackathon the BFF lives in `apps/banking/app/api/*` route handlers
(thin — domain logic stays in packages); it must be extractable to `services/api`
without changing the client contract.

## Requirements

- Response envelope everywhere: `{ data, asOf, sources }` with per-source freshness
  (`fresh | stale | unavailable`) so every screen can render staleness honestly.
- `@idbi/api-client`: `get`/`post` with request timeout (default 10s from
  `@idbi/config`), `AbortSignal` support (cancellation on navigation — F111),
  and typed errors (`timeout | network | http` with status).
- Errors surface as explicit UX states (F106 feedback components), never infinite
  spinners.
- No platform-specific endpoints for the same operation (parity rule).
- BFF handlers compose `@idbi/test-fixtures` + `@idbi/financial-domain` until real
  integrations exist (F006).

## Acceptance criteria

- [ ] All app data fetching goes through `@idbi/api-client`
- [ ] Timeout and abort behaviour unit-verifiable
- [ ] Envelope types shared from `@idbi/types`
- [ ] Route handlers contain no financial calculations
