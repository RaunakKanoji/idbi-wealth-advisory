# F110 — Mobile Avatar Experience

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F107; avatar state definitions (shared, `services/conversational-ai`); F119 |

## Scope

Avatar presentation states on mobile. Avatar *state definitions* are shared across
platforms; this spec covers their mobile presentation only.

## States

- Large greeting state (first entry, onboarding)
- Onboarding state
- Risk-questionnaire state
- Compact conversation state (avatar shrinks as history grows)
- Floating launcher (outside the Copilot screen)
- Minimized state (customer can minimize/hide for reading space)
- Static fallback (weak devices, animation unavailable)
- Reduced-motion mode (`prefers-reduced-motion`)
- Voice-disabled mode (captions + text)
- Offline mode
- Human-handoff state

## Obstruction rules (hard requirements)

The avatar must never obstruct: form fields, primary actions, bottom navigation,
error messages, or disclosures. The launcher repositions or hides when it would
overlap any of these.

## Requirements

- Lazy-loaded assets (F111); the Copilot works before/without avatar assets.
- Customer can always minimize or hide the avatar; the choice persists.
- Reduced-size transition as conversation history grows.
- Static fallback preserves the full conversation (CAPABILITY_FALLBACK, F118/F119).

## Acceptance criteria

- [ ] All states implemented and reachable; transitions do not lose conversation state
- [ ] Obstruction rules verified at 320px with keyboard open and sheets open
- [ ] Reduced motion honored; static fallback verified on throttled device profile
- [ ] Voice-disabled and offline modes keep text conversation fully functional
- [ ] No avatar asset in the initial route JS bundle
