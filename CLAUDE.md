# IDBI Wealth Copilot — Implementation Agent Rules

Single responsive Next.js application (`apps/banking/`), mobile-first. One product,
one domain model, one advisory engine, one set of APIs. Read
`docs/context/responsive-experience-context.md` before frontend work and the relevant
`docs/specifications/F1xx-*.md` before implementing a feature.

## Rules (binding)

1. Build mobile styles first; larger-screen styles are additive (`sm`/`md`/`lg`/`xl`/`2xl`).
2. Do not create a separate desktop page when a responsive component is sufficient.
3. Do not duplicate domain logic across viewport variants.
4. Do not use viewport width as a substitute for capability detection.
5. Do not hide core features on mobile because the layout is difficult.
6. Do not display desktop navigation on narrow screens.
7. Do not show mobile and desktop navigation simultaneously.
8. Do not begin desktop optimization before the mobile flow works.
9. Test every feature at 320-pixel width.
10. Preserve identical financial outputs across devices.
11. Preserve identical analytics event names across devices.
12. Preserve identical consent and suitability behaviour across devices.
13. Provide text fallbacks for voice.
14. Provide static fallbacks for avatar animation.
15. Keep the application usable during external-service failures.
16. Update the parity matrix (`docs/specifications/F118-cross-platform-feature-parity.md`)
    whenever a feature is introduced.
17. Record intentional mobile/web differences in `docs/DECISION-LOG.md`.
18. Use shared responsive components wherever practical.
19. Optimize for one-handed mobile use before adding web density.
20. Treat desktop as an enhancement of the mobile product, not as a different product.

## Structure rules

- Never create `apps/mobile/` or `apps/web/` (Decision D-001).
- Financial calculations, risk profiling, suitability, recommendations, goal
  projections, portfolio analysis, consent enforcement, auth rules, AI tool
  definitions and guardrails, analytics event definitions, validation schemas, and
  audit-event schemas live in `packages/` and `services/` — never inside viewport
  variants of components.
- All authenticated routes render inside the shared responsive application shell.
- Route definitions are shared across all viewport variants
  (see `docs/context/cross-platform-navigation-context.md`).

## Breakpoints

```text
Base: 320px+   sm: 640px+   md: 768px+   lg: 1024px+   xl: 1280px+   2xl: 1536px+
```

Navigation by viewport: bottom navigation < 768px; navigation rail 768–1023px;
compact collapsible sidebar ≥ 1024px. Never two navigation patterns at once.

## Definition of done (mobile — applies to every feature)

Works at 320px; no horizontal overflow; primary actions reachable one-handed; touch
targets ≥ 44×44px; forms usable with the virtual keyboard; loading/error/stale/empty
states implemented; avatar never blocks content; screen-reader semantics present;
tested on a mobile viewport.

## Process

- Track work in `docs/PROGRESS.md`; log decisions in `docs/DECISION-LOG.md`.
- Phase order: mobile foundation → mobile journey → mobile stabilization → tablet →
  desktop → cross-platform verification. Do not skip ahead.
