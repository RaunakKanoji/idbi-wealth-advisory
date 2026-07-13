# F111 — Mobile Performance

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F106, F107 |

## Scope

Performance foundations that keep the wealth dashboard usable on slow devices and
networks, and resilient to external-service failures.

## Requirements

- Lazy avatar loading; lazy chart loading; dynamic imports for heavy feature modules.
- Optimized images (responsive sizes, modern formats); minimal blocking fonts.
- PWA asset caching for shell assets; offline-safe shell.
- Route-level loading states and skeletons for shell and cards.
- Request cancellation on navigation; timeout handling with explicit error states.
- Cached last-known summaries (where consent allows) with freshness warnings.
- Minimal initial JavaScript; desktop-only panels code-split (see also web targets).
- Reduced animation on weak devices (see F119 device heuristics).

## Resilience requirements

The dashboard remains functional when any of the following hold: avatar assets still
loading · voice services unavailable · market data delayed · an Account Aggregator
provider unavailable · slow mobile connection.

## Targets (budgets — measured on slow 4G, mid-range device profile)

- First contentful render fast enough that skeletons appear < 1.5s; LCP < 2.5s
- Initial route JS budget: ≤ 200KB gzipped (excludes lazy avatar/chart chunks)
- CLS < 0.1; no layout shift from avatar or chart hydration
- API timeout: explicit UX after 10s with retry; no infinite spinners

## Acceptance criteria

- [ ] Bundle analysis shows avatar/charts outside initial chunks
- [ ] Budgets asserted in CI (bundle size) and measured in Lighthouse runs
- [ ] Dashboard verified usable with avatar, voice, and market data disabled
- [ ] Offline shell + cached summaries verified with freshness warning shown
- [ ] Slow-network (throttled) journey test passes for the core mobile flow
