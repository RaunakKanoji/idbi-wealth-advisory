# Responsive Experience Context

> Master context file. Defines the relationship between the mobile, tablet, desktop,
> WebView, and PWA experiences of IDBI Wealth Copilot. Supersedes
> `mobile-experience-context.md` (see Decision D-003).

## Delivery model

Track 01 is a **single responsive Next.js application** (`apps/banking/`), not
separate mobile and web applications. It is designed for, in priority order:

1. **Mobile browsers** — the primary implementation target
2. **Progressive Web App installation**
3. **Embedded mobile banking WebViews**
4. **Tablet banking interfaces**
5. **Desktop banking portals**
6. **Responsive web browsers** generally

Tablet and desktop are responsive adaptations of the same product. Native Android and
iOS applications may later consume the same backend APIs, domain services, financial
calculation engines, suitability services, recommendation services, and conversational
AI tools.

## What every surface shares

Business logic · financial calculation services · API contracts · data models ·
authentication and authorization rules · consent management · suitability rules ·
recommendation logic · conversational AI tools · avatar state definitions · design
tokens · validation schemas · analytics events · accessibility standards.

The interface may change between mobile and web, but **the financial outputs and
business rules must remain identical**. A mobile, tablet, or desktop viewport must
never produce a different financial outcome from the same customer data.

## Surface relationships

| Surface | Relationship to mobile baseline |
| --- | --- |
| Mobile browser | Baseline. Everything is designed here first. |
| PWA | Same app plus install manifest, cached shell assets, offline-safe summaries. |
| Banking WebView | Same app embedded; respects host-app back behaviour and safe areas; no reliance on browser chrome. |
| Tablet | Same routes/features; navigation rail or compact sidebar; two-column layouts where useful. |
| Desktop portal | Same routes/features; compact persistent sidebar; context panels; Copilot split view; tables for detail. |

## Implementation sequence

Mobile foundation → complete mobile customer journey → mobile stabilization → tablet
adaptation → desktop web enhancement → cross-platform parity verification. Desktop
layout work must not start before the mobile journeys are functional and stabilized.

## Guiding question

Every feature must first answer: *"Can the customer complete this comfortably with
one hand on a mobile device?"* Only then may it be optimized for larger screens. The
web experience provides more space, comparison, and context — not a different product.

## Related context files

- [mobile-first-context.md](mobile-first-context.md) — mobile as primary surface; mobile definition of done
- [web-experience-context.md](web-experience-context.md) — tablet/desktop adaptation principles
- [responsive-layout-context.md](responsive-layout-context.md) — breakpoints, grids, visibility rules
- [device-capability-context.md](device-capability-context.md) — capability detection and fallbacks
- [cross-platform-navigation-context.md](cross-platform-navigation-context.md) — navigation per surface, shared routes
- [mobile-web-parity-context.md](mobile-web-parity-context.md) — parity classes and prohibited divergences
