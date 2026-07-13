# F006 — Provider Adapters (Integration Gateway)

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F003, F005 |

## Scope

Adapters for external financial data providers — Account Aggregator sources, market
data, bank systems — behind stable interfaces, so the app is built against contracts
rather than vendors. Hackathon implementation is **mock-first** using
`@idbi/test-fixtures`; real adapters later live in `services/integration-gateway`.

## Requirements

- Provider interfaces defined in shared types: accounts, holdings, transactions,
  market quotes — each response carries `asOf` and a source identity.
- Mock adapters return fixture data deterministically, including at least one
  **stale** source and a switchable **unavailable** mode, so resilience UX
  (freshness badges, outage states — F111/F120) is buildable and testable now.
- The dashboard remains functional during any provider outage (degraded, labeled,
  never blank or crashed).
- Consent gates provider reads (enforced in the BFF/adapters, not in UI).

## Acceptance criteria

- [ ] UI code has no knowledge of provider specifics — only envelope + sources
- [ ] Stale and unavailable source states renderable from mock adapters
- [ ] Outage simulation covered by a test or debug flag
