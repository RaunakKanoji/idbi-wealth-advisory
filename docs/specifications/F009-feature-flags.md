# F009 — Feature Flags

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F008 |

## Scope

Typed feature flags so unbuilt capabilities (voice, avatar animation, split view,
tablet rail) ship dark and phases can be gated cleanly.

## Requirements

- `lib/feature-flags/` defines a typed flag map with defaults; consumed via
  `feature-flag-provider.tsx` and a `useFeatureFlag(name)` hook.
- Initial flags (all default off until their phase): `copilotVoice`,
  `avatarAnimation`, `webSplitView`, `tabletRail`, `desktopSidebar`, `pwaInstall`.
- Flags gate **presentation and capability rollout only** — never business rules,
  calculations, suitability, or consent (parity invariant). No flag checks inside
  `packages/financial-domain` or `packages/validation`.
- Overridable via environment for demos; unknown flag names are type errors.

## Acceptance criteria

- [ ] All flag reads go through the hook/provider (no scattered env reads)
- [ ] Grep shows no flag usage in domain packages
- [ ] Turning every flag off leaves the core journey fully functional
