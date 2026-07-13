# Device Capability Context

Capability detection and fallback rules. **Never infer capability solely from
viewport width** — a small window on a desktop is not a phone, and a large tablet may
have no hover, no microphone permission, and a slow connection. Related spec: F119.

## Principle

Core wealth advisory never depends on optional device capabilities. Every optional
capability has a defined fallback that preserves the same business outcome.

## Capabilities and detection

| Capability | Detection | Fallback |
| --- | --- | --- |
| Microphone | `navigator.mediaDevices` + permission state | Text input |
| Speech recognition | `SpeechRecognition`/`webkitSpeechRecognition` in `window` | Text input |
| Text-to-speech | `speechSynthesis` in `window` | Captions and on-screen text |
| Camera (future) | `mediaDevices.getUserMedia` availability + permission | Manual entry / upload |
| Touch input | `pointer: coarse` media query, `maxTouchPoints` | Mouse/keyboard interactions |
| Hover input | `(hover: hover)` media query | Tap-accessible controls; no hover-only affordances |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Static avatar, no non-essential animation |
| Network status | `navigator.onLine` + online/offline events + request outcomes | Offline banner, cached summaries |
| Offline state | Service worker + cache availability | Offline-safe shell, last-known summaries with freshness warning |
| PWA installation | `beforeinstallprompt`, `display-mode: standalone` | Plain browser usage; no install nagging |
| WebView environment | Host bridge/user-agent contract with the banking app | Respect host back behaviour; hide install prompts; no external-window assumptions |
| Secure storage | Availability of the agreed secure storage mechanism | Session-scoped storage; re-authentication |
| Push notifications | `Notification` + `PushManager` support and permission | In-app notification center |
| Device performance | Heuristics (`deviceMemory`, `hardwareConcurrency`), animation frame budget | Static avatar, reduced animation, lighter charts |

All detection goes through `hooks/use-device-capabilities.ts` and
`lib/responsive/` — components never sniff capabilities ad hoc.

## Fallback rules (canonical examples)

```text
Speech recognition unavailable → text input
Text-to-speech unavailable    → captions and text
Avatar animation unavailable  → static avatar
Push unavailable              → in-app notifications
Offline                       → cached summaries with freshness warning
Hover unavailable             → tap-accessible controls
```

## Behavioural requirements

- Capability loss mid-session degrades gracefully (e.g. voice drops → composer stays).
- Fallbacks fire the **same analytics events** with a capability dimension, never
  different event names.
- Permission prompts are triggered by explicit user intent (tapping the mic), never
  on page load.
- Weak-device avatar fallback must not remove the Copilot: conversation continues in
  text with a static avatar.
