# Repository Structure

Canonical structure for Track 01. A single responsive frontend consumes shared,
platform-independent backend and domain packages. Do **not** create `apps/mobile/`
or `apps/web/` (Decision D-001).

## Top level

```text
apps/
└── banking/                 Single responsive Next.js application

services/
├── api/                     API composition / gateway for the frontend
├── advisory-engine/         Advisory orchestration, suitability enforcement
├── financial-intelligence/  Wealth health, spending, portfolio analysis
├── recommendation-engine/   Recommendation generation and ranking
├── conversational-ai/       Copilot: AI tools, guardrails, avatar states
└── integration-gateway/     Account Aggregator / market data / bank integrations

packages/
├── ui/                      Shared UI primitives and design tokens
├── types/                   Shared data models
├── validation/              Shared validation schemas
├── api-client/              Typed client for services/api
├── financial-domain/        Financial calculations, risk, goals, projections
├── analytics/               Analytics event definitions
├── config/                  Shared configuration
└── test-fixtures/           Shared customer/portfolio fixtures for parity tests
```

## apps/banking

```text
apps/banking/
├── app/
│   ├── (public)/            Landing and unauthenticated pages
│   ├── (auth)/              Sign-in
│   ├── (banking)/           All authenticated product routes (shared shell)
│   ├── api/                 Route handlers (BFF only — no domain logic)
│   ├── layout.tsx  loading.tsx  error.tsx  not-found.tsx  globals.css
│
├── components/
│   ├── ui/  shell/  navigation/  avatar/  charts/  forms/
│   ├── financial/  conversation/  feedback/  accessibility/
│
├── features/                One directory per product feature
│   ├── authentication/  onboarding/  overview/  wealth-health/  spending/
│   ├── portfolio/  goals/  recommendations/  simulator/  copilot/
│   ├── consent/  notifications/  documents/  advisor-handoff/  settings/
│
├── hooks/                   use-breakpoint, use-device-capabilities, use-safe-area,
│                            use-network-status, use-reduced-motion, use-mobile-keyboard
├── lib/                     api, auth, analytics, accessibility, formatting,
│                            validation, feature-flags, responsive, pwa, utils
├── providers/               app, auth, query, conversation, avatar,
│                            accessibility, feature-flag
├── styles/                  tokens.css, responsive.css, safe-area.css,
│                            motion.css, print.css
├── public/                  avatar, icons, illustrations, manifest, offline
└── tests/                   unit, integration, responsive, accessibility, e2e
```

## Placement rules

- **Platform-independent (never in viewport variants):** financial calculations,
  risk profiling, suitability evaluation, recommendation generation and ranking,
  goal projections, portfolio analysis, consent enforcement, authentication and
  authorization rules, AI tool definitions, AI guardrails, analytics event
  definitions, validation schemas, audit-event schemas. These live in `packages/`
  and `services/`.
- `features/*` compose domain packages and shared components; they own screens,
  feature state, and feature-level tests.
- `components/*` are responsive: one component may have internal mobile/desktop
  variants but preserves the same data contract, accessibility semantics, actions,
  business meaning, and analytics events.
- `app/api/` is a thin backend-for-frontend layer; domain logic belongs to
  `services/` and `packages/financial-domain`.
