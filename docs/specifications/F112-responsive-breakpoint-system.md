# F112 — Responsive Breakpoint System

| | |
| --- | --- |
| Phase | 4 — Responsive and tablet adaptation |
| Status | Not started |
| Depends on | F106 |

## Scope

A centralized responsive utility system. No scattered, undocumented viewport logic
in components.

## Named viewport classes

```text
mobile         base–639px
large mobile   640–767px    (sm)
tablet         768–1023px   (md)
laptop         1024–1279px  (lg)
desktop        1280–1535px  (xl)
wide desktop   1536px+      (2xl)
```

## Requirements

- Breakpoints defined once (design tokens / Tailwind config) and consumed everywhere;
  `hooks/use-breakpoint.ts` and `lib/responsive/` are the only JS entry points.
- CSS media queries for visual layout; JavaScript checks only when component
  *behaviour* genuinely requires them (e.g. rendering rail vs bottom nav).
- No component defines its own pixel values; no `window.innerWidth` reads outside
  `lib/responsive/`.
- SSR-safe: breakpoint hooks must not cause hydration mismatch (render mobile-first
  markup by default).
- Capability detection is separate from breakpoints (F119); width never implies
  touch, hover, or performance.

## Acceptance criteria

- [ ] Single source of truth for breakpoint values; lint/grep check for hard-coded
      media-query pixel values in features
- [ ] `use-breakpoint` covered by tests including SSR/hydration behaviour
- [ ] Navigation switching (bottom nav / rail / sidebar) driven by this system only
- [ ] Documented in responsive-layout-context.md and kept in sync
