# F107 — Mobile Application Shell

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F106, F108 |

## Scope

The shared shell that all authenticated routes render inside on mobile viewports.
It is the mobile presentation of the single ResponsiveAppShell — not a separate app.

## Structure

```text
MobileAppShell
├── MobileHeader
├── MainContent
├── MobileBottomNavigation
├── CopilotLauncher
├── GlobalSheetLayer
├── ToastLayer
└── SafeAreaBoundary
```

## Requirements

- Sticky headers where appropriate (titles, progress) — orientation, not actions.
- Bottom-navigation spacing: content and sticky actions clear the nav + safe area.
- Safe-area insets on header, nav, sheets, toasts (WebView included).
- Route transitions that preserve feature state across tab switches.
- Offline indicator surfaced by the shell (from `use-network-status`).
- Session states: authenticated, expiring, expired → re-auth flow hooks.
- Global dialogs and sheets render in GlobalSheetLayer above content, below toasts.
- Keyboard-safe layouts: focused input and primary action visible with keyboard open.
- CopilotLauncher floats on non-Copilot routes; never obstructs nav, forms, errors,
  or disclosures (F110 placement rules).

## Acceptance criteria

- [ ] All authenticated routes render inside the shell at mobile widths
- [ ] Safe areas respected on notched devices and in WebView
- [ ] Bottom nav never overlaps content or sticky actions
- [ ] Offline and session states visible and accessible
- [ ] Sheets/drawers close on back before route navigation occurs
- [ ] Works at 320px; no horizontal overflow; screen-reader landmarks present
