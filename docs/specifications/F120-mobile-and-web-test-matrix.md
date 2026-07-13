# F120 — Mobile and Web Test Matrix

| | |
| --- | --- |
| Phase | 6 — Cross-platform verification |
| Status | Not started |
| Depends on | All prior phases; `apps/banking/tests/responsive` + `e2e` |

## Viewports (all critical features)

```text
320 × 568     360 × 800     390 × 844     412 × 915
768 × 1024    1024 × 768    1280 × 800    1440 × 900    1920 × 1080
```

## Conditions

| Dimension | Cases |
| --- | --- |
| Orientation | Portrait mobile, landscape mobile, tablet portrait, tablet landscape, laptop, desktop |
| Display | Browser zoom (to 200%), large text settings |
| Input | Touch, mouse, keyboard navigation |
| Assistive tech | Screen readers (mobile + desktop), reduced motion |
| Network | Slow network (throttled 4G), offline mode |
| Service failures | Account Aggregator provider outage, market data delayed |
| Capabilities | Voice unavailable, avatar unavailable |
| Embedding | Mobile banking WebView behaviour, PWA installed mode |

## Required checks per critical feature

- [ ] Renders and functions at every listed viewport; no horizontal page overflow
- [ ] Primary actions reachable and operable via touch, mouse, and keyboard
- [ ] Screen-reader walkthrough passes (landmarks, labels, error announcements)
- [ ] Reduced motion honored end to end
- [ ] Slow-network and offline behaviour matches spec (skeletons, cached summaries,
      freshness warnings, timeouts)
- [ ] Provider-outage and capability-fallback paths verified (F119)
- [ ] WebView and PWA modes verified for shell, back behaviour, and safe areas

## Phase 6 deliverables

- [ ] Responsive visual regression suite across the matrix widths
- [ ] Cross-platform E2E: identical financial outputs for the same fixture at
      mobile and desktop viewports (parity with F118)
- [ ] Accessibility verification report
- [ ] Capability fallback test results
- [ ] Feature-parity audit signed off against F118 matrix
