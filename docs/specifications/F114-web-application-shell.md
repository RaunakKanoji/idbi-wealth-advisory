# F114 — Web Application Shell

| | |
| --- | --- |
| Phase | 5 — Desktop web expansion |
| Status | Not started |
| Depends on | F107 (same ResponsiveAppShell), F112, F115 |

## Scope

Desktop presentation (≥1024px) of the shared responsive application shell. Same
routes, same feature modules — different chrome.

## Structure

```text
WebAppShell
├── DesktopSidebar
├── DesktopHeader
├── MainContent
├── OptionalContextPanel
├── CopilotLauncher
└── GlobalDialogs
```

## Requirements

- Compact navigation (F115); sidebar collapsible; never excessive horizontal space.
- Responsive content width per responsive-layout-context.md container rules.
- Accessible keyboard navigation across shell regions (skip links, focus order,
  visible focus, Esc closes panels/dialogs).
- Route-state preservation, including conversation state, across navigation.
- Collapsible secondary panels (context panel defaults open at xl, collapsible at lg).
- No unnecessary dashboard density — overview does not gain features just because
  space exists.
- CopilotLauncher available on non-Copilot routes without covering content.

## Acceptance criteria

- [ ] All authenticated routes render inside the shell at lg/xl/2xl
- [ ] Keyboard-only walkthrough of the full navigation passes
- [ ] Collapsing sidebar/panels never causes layout shift of primary content
- [ ] Conversation state survives route changes (verified E2E)
- [ ] Same routes and feature modules as mobile — no desktop-only pages duplicating
      mobile features
