# F119 — Device Capability Fallbacks

| | |
| --- | --- |
| Phase | 4 — Responsive and tablet adaptation |
| Status | Not started |
| Depends on | device-capability-context.md; `use-device-capabilities.ts` |

## Scope

Progressive enhancement for optional capabilities. Core wealth advisory never
depends on any of these.

## Capabilities covered

Voice input · voice output · avatar animation · push notifications · offline mode ·
PWA installation · WebView integration · touch gestures · hover interactions

## Canonical fallbacks

```text
Speech recognition unavailable → text input
Text-to-speech unavailable    → captions and text
Avatar animation unavailable  → static avatar
Push unavailable              → in-app notifications
Offline                       → cached summaries with freshness warning
Hover unavailable             → tap-accessible controls
```

## Requirements

- All detection flows through `hooks/use-device-capabilities.ts` / `lib/responsive/`
  feature detection — never viewport-width inference, never ad-hoc sniffing.
- Graceful mid-session degradation (capability lost during use).
- Fallbacks emit the same analytics event names with a capability dimension.
- Permission prompts only on explicit user intent.
- WebView integration: host back behaviour respected, install prompts suppressed,
  safe areas honored, no popup-window assumptions.
- Weak-device heuristics gate avatar animation and non-essential motion (F110/F111).

## Acceptance criteria

- [ ] Each capability has an automated test with the capability mocked off
- [ ] Core journey (sign-in → dashboard → recommendation → Copilot text chat)
      passes with ALL optional capabilities disabled
- [ ] Analytics parity verified between capability and fallback paths
- [ ] WebView behaviour verified in an embedded context (F120)
