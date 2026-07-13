# F116 — Web Copilot Split View

| | |
| --- | --- |
| Phase | 5 — Desktop web expansion |
| Status | Not started |
| Depends on | F114; mobile Copilot screen complete (Phase 2); F110 avatar states |

## Scope

Desktop presentation of the Copilot at `/copilot` — same conversation engine, AI
tools, guardrails, and avatar states as mobile.

## Structure

```text
CopilotWebScreen
├── ConversationPanel
├── AvatarPanel
└── FinancialContextPanel
```

## Requirements

- FinancialContextPanel shows only information relevant to the current
  conversation: referenced financial metric, goal projection, recommendation
  evidence, portfolio allocation, spending comparison, data source, data freshness.
- No unrelated dashboard information beside the conversation.
- AvatarPanel resizable/collapsible; optional picture-in-picture; never permanently
  occupies dashboard space outside `/copilot`.
- Conversation state persists during navigation (enter/leave `/copilot`).
- Split view collapses gracefully: at md/mobile widths the experience becomes the
  full-screen mobile Copilot route with in-conversation context cards — same route,
  same state.
- Keyboard accessible: panel focus management, Esc collapses panels, composer
  reachable without pointer.

## Acceptance criteria

- [ ] Split view active at ≥1024px; identical conversation renders in mobile layout
      below that with no state loss on resize
- [ ] Context panel content traces to the active conversation (no static dashboard)
- [ ] Same AI tool calls, guardrails, and analytics events as mobile Copilot
- [ ] Avatar collapse/PiP verified; reduced-motion and static fallback honored
- [ ] E2E: conversation survives navigating away and back on desktop
