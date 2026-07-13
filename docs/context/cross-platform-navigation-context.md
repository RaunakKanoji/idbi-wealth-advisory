# Cross-Platform Navigation Context

All viewport variants use the **same route definitions**. Navigation chrome adapts;
routes, feature modules, and state do not. Related specs: F108 (mobile), F113
(tablet), F114/F115 (desktop).

## Canonical routes (shared)

```text
(public)   /                     Landing / entry
(auth)     /sign-in              Authentication

(banking)  /overview             Home — wealth dashboard
           /wealth-health        Wealth health score and drivers
           /copilot              Conversational Copilot (full-screen on mobile,
                                 split view on desktop)
           /goals                Goal list
           /goals/[goalId]       Goal detail and simulation
           /portfolio            Portfolio health, holdings
           /spending             Spending behaviour
           /recommendations      Recommendations and evidence
           /simulator            Goal / scenario simulator
           /documents            Documents and advisory history
           /consent              Consent management
           /notifications        Notification center
           /advisor              Human advisor handoff
           /profile              Customer profile (financial profile, risk profile)
           /settings             Settings
```

## Mobile (< 768px)

**Bottom navigation** — exactly five entries:

1. Home → `/overview`
2. Wealth → `/wealth-health`
3. Copilot → `/copilot` (central action; may receive visual emphasis without
   obstructing content)
4. Goals → `/goals`
5. More → More sheet

**More sheet** provides access to: Spending, Portfolio, Recommendations, Simulator,
Documents, Consent, Notifications, Profile, Settings.

- Features open as full-screen routes; secondary information uses sheets and drawers.
- Back behaviour: browser/WebView back closes the topmost sheet or drawer first, then
  navigates back in route history; feature state is preserved when switching bottom
  navigation tabs.
- Clear active state, accessible labels, ≥44px touch targets, safe-area padding.

## Tablet (768–1023px)

- **Navigation rail** (or compact sidebar) on the leading edge; no bottom navigation.
- Adaptive content width; two-column layouts where useful.
- Context panels appear as overlays or collapsible side sheets, not permanent fixtures.
- Portrait and landscape both supported.

## Desktop (≥ 1024px)

- **Compact persistent sidebar** (collapsible): Overview, Wealth Health, Copilot,
  Portfolio, Spending, Goals, Recommendations, Simulator, Documents, Notifications,
  Settings.
- Desktop header for session, notifications, and profile access.
- Optional context panel on the trailing edge for evidence and explanation.
- Copilot collapses to a launcher on non-Copilot routes; conversation state persists
  across navigation.
- Breadcrumbs only where the hierarchy is deeper than two levels (e.g. goal detail).

## Invariants

- Exactly one navigation pattern renders at a time (no bottom navigation + sidebar
  together; Decision D-004).
- Deep links work identically on all surfaces.
- Navigation is keyboard accessible on all surfaces and screen-reader labelled.
- Route transitions preserve conversational and form state per feature rules.
