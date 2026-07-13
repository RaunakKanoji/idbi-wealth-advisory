# Web Experience Context

Tablet and desktop are **responsive adaptations** of the stabilized mobile product.
Additional space is used to improve comprehension — comparison, context, evidence —
never to display unnecessary information or become a dense enterprise dashboard.
Related specs: F113–F116.

## Adaptation principles

- All mobile features remain available; nothing is web-only at the business level.
- Larger screens add: side-by-side comparison, supporting insights next to primary
  summaries, expanded charts (only when detail improves understanding), and tables
  for holdings/transactions.
- The experience must still feel like the same banking product.

## Web sidebar behaviour

- Desktop (≥1024px): persistent, compact, collapsible sidebar with Overview, Wealth
  Health, Copilot, Portfolio, Spending, Goals, Recommendations, Simulator, Documents,
  Notifications, Settings. Accessible labels in collapsed mode; persistent active
  state; keyboard navigable; never shown together with bottom navigation. See F115.
- Tablet (768–1023px): navigation rail or compact sidebar — not both, and not
  alongside bottom navigation.

## Multi-column layouts

- Two- or three-column layouts only where they aid comprehension (e.g. summary +
  supporting insight; conversation + context).
- Content priority is preserved from mobile: what came first on mobile stays primary.
- Columns collapse gracefully back to the mobile single-column order.

## Copilot split view

- Desktop Copilot uses ConversationPanel + AvatarPanel + FinancialContextPanel.
- The context panel shows only conversation-relevant information: referenced metric,
  goal projection, recommendation evidence, portfolio allocation, spending
  comparison, data source and freshness. No unrelated dashboard content. See F116.
- Conversation state persists across route navigation.
- The avatar is available without permanently covering content; collapsible;
  optional picture-in-picture; never a large avatar squatting on dashboard space.

## Tables and detailed charts

- Tables are appropriate on web for holdings and transactions: paginated or
  virtualized, keyboard navigable, with accessible headers and row semantics.
- Wider charts get accessible text summaries; the same data transformations and
  calculation sources as mobile (F117).

## Information density

- Show additional metrics only when they support comparison.
- Use side panels for evidence and explanations rather than inflating cards.
- Do not present every available feature on the overview page.

## Keyboard and mouse

- Full keyboard operability: visible focus states, logical tab order, standard
  shortcuts where conventional (Esc closes panels/dialogs).
- Hover interactions always have a non-hover equivalent (hover is a capability, not
  an assumption — see device-capability-context.md).

## Browser zoom

- Usable at up to 200% zoom without loss of content or functionality (WCAG 1.4.4);
  layouts reflow rather than clip.

## Web performance expectations

- Reuse mobile-loaded modules; code-split desktop-only panels; defer detailed charts
  until required; paginate/virtualize large lists; avoid duplicate requests from
  parallel panels; preserve conversational state during route transitions.

## Web definition of done

- [ ] All mobile features remain available
- [ ] Larger-screen layouts demonstrably improve comprehension
- [ ] No business logic duplicated for web
- [ ] Desktop navigation consistent (single sidebar, collapsible, compact)
- [ ] Tables and charts accessible (keyboard, screen reader, text summaries)
- [ ] Copilot split view works and collapses gracefully
- [ ] Usable at tablet, laptop, and desktop widths and at 200% zoom
- [ ] Still feels like the same product as mobile
