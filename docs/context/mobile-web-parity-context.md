# Mobile–Web Parity Context

Defines what must be identical across surfaces, what may vary, and what is
prohibited. Enforced by the parity matrix in F118 and verified in Phase 6 (F120).

## Parity classes

```text
FULL_PARITY          Identical feature and behaviour everywhere
LAYOUT_VARIANT       Same feature/data/actions; different layout per viewport
CAPABILITY_FALLBACK  Same outcome via fallback when a capability is missing
WEB_ENHANCEMENT      Additive comprehension aid on larger screens only
MOBILE_ENHANCEMENT   Additive mobile-only affordance (e.g. haptics)
NOT_SUPPORTED        Requires documented justification in the decision log
```

## Must be available on every platform (FULL_PARITY)

Financial guidance · recommendations · suitability evaluation · consent management ·
goals and goal simulations · financial calculations · wealth health score · risk
profiling · advisor handoff · documents and advisory history · disclosures ·
authentication.

## May vary by layout (LAYOUT_VARIANT)

Navigation chrome, card arrangement, chart detail level, form field grouping (steps
on mobile, grouped fields on web — same validation and completion logic), evidence
presentation (sheet vs side panel), tables (list on mobile, table on web).

## Capability fallbacks (CAPABILITY_FALLBACK)

Voice ↔ text, animated ↔ static avatar, push ↔ in-app notifications, offline cached
summaries. See device-capability-context.md.

## Shared, always

- **API contracts** — one `packages/api-client`; no platform-specific endpoints for
  the same operation.
- **Analytics events** — identical event names and schemas; platform is a dimension,
  never part of the name.
- **Accessibility semantics** — same roles, names, and descriptions for the same
  component on every surface.
- **Business rules** — one implementation in `packages/financial-domain` and
  `services/`; viewport variants call the same functions.
- **Data models and validation schemas** — `packages/types`, `packages/validation`.

## Explicitly prohibited

- Web-only business features
- Mobile-only financial calculations
- Different recommendation rules per platform
- Different suitability outcomes per platform
- Duplicated feature implementations per viewport
- Platform-specific data models

## Parity testing requirements

- Every feature has a parity matrix row before it merges (F118).
- Cross-platform E2E: the same customer fixture produces identical financial
  outputs (scores, projections, recommendations, suitability) at mobile and desktop
  viewports.
- Analytics assertions: same journey emits the same event names on both surfaces.
- `NOT_SUPPORTED` entries link to a decision-log record with justification.
