# IDBI Wealth Copilot — Track 01

A conversational, avatar-guided wealth advisory product for IDBI Bank customers.
Built as **one responsive Next.js application**: mobile-first, then tablet, then desktop.

## Architecture in one paragraph

One product, one domain model, one advisory engine, one set of APIs. The frontend is a
single responsive application in `apps/banking/` that serves mobile browsers, PWA
installs, embedded mobile-banking WebViews, tablet interfaces, and desktop banking
portals. The interface adapts to the device; the customer's financial position, risk
profile, suitability outcome, recommendations, evidence, disclosures, consent, and
advisory history are identical on every surface. Native Android/iOS apps may later
consume the same backend and domain services.

## Repository layout

```text
apps/banking/        Single responsive Next.js application (mobile-first)
services/            Backend services (api, advisory-engine, financial-intelligence,
                     recommendation-engine, conversational-ai, integration-gateway)
packages/            Shared platform-independent packages (ui, types, validation,
                     api-client, financial-domain, analytics, config, test-fixtures)
docs/context/        Product and platform context files (authoritative guidance)
docs/specifications/ Feature specifications (F106–F120 responsive/mobile specs)
docs/architecture/   Repository and system architecture
docs/PROGRESS.md     Phase-by-phase progress tracker
docs/DECISION-LOG.md Architecture decision records
```

Do **not** create `apps/mobile/` or `apps/web/`. See
[docs/DECISION-LOG.md](docs/DECISION-LOG.md) entry D-001.

## Implementation sequence

```text
Phase 0  Documentation and repository alignment      ← complete
Phase 1  Shared foundation + mobile foundation       (F001–F010, F106–F111)
Phase 2  Complete mobile customer journey
Phase 3  Mobile stabilization
Phase 4  Responsive and tablet adaptation            (F112, F113, F117, F118, F119)
Phase 5  Desktop web expansion                       (F114, F115, F116)
Phase 6  Cross-platform verification                 (F120)
```

Desktop work does not begin before the mobile customer journey is functional and
stabilized. See [docs/PROGRESS.md](docs/PROGRESS.md).

## Non-negotiable invariants

- Every primary route works at 320 px width with no horizontal overflow.
- Financial outputs are identical across viewports for the same customer data.
- Analytics event names, consent behaviour, and suitability outcomes are identical
  across devices.
- Voice has text fallbacks; avatar animation has static fallbacks; the dashboard
  stays usable when external services fail.

## Key documents

- [docs/context/responsive-experience-context.md](docs/context/responsive-experience-context.md) — master platform-relationship file
- [docs/context/mobile-first-context.md](docs/context/mobile-first-context.md) — mobile requirements and definition of done
- [docs/context/mobile-web-parity-context.md](docs/context/mobile-web-parity-context.md) — parity rules and prohibited divergences
- [docs/architecture/repository-structure.md](docs/architecture/repository-structure.md) — canonical structure
- [CLAUDE.md](CLAUDE.md) — implementation agent rules
