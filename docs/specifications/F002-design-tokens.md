# F002 — Design Tokens and Theming

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | F001; responsive-layout-context.md |

## Scope

One token set shared by every surface (parity requirement: design tokens are shared).
Tokens drive Tailwind utilities and raw CSS alike.

## Requirements

- Color tokens: brand primary (deep teal), accent, ink/muted text, surface,
  background, border, positive/negative/warning/info semantics. Semantic names,
  not raw hex, at usage sites.
- Typography: system font stack (no blocking webfonts — F111); responsive type
  scale from tokens.
- Spacing, radius, elevation tokens; component tokens for bottom-nav height and
  minimum touch target (44px, from `@idbi/config`).
- Breakpoints: the canonical set (640/768/1024/1280/1536) defined once in
  `@idbi/config` for JS and mirrored by the Tailwind theme — these match Tailwind
  defaults and must stay in sync.
- Motion tokens + global `prefers-reduced-motion` override (`styles/motion.css`).
- Files: `apps/banking/styles/tokens.css` (+ Tailwind `@theme` in `globals.css`),
  `safe-area.css`, `responsive.css`, `motion.css`, `print.css`.
- Light theme only for the hackathon; token structure must not preclude dark mode.

## Acceptance criteria

- [ ] No hard-coded colors/spacing in feature components (tokens or utilities only)
- [ ] Reduced-motion override verified globally
- [ ] Breakpoint values identical in `@idbi/config` and CSS
- [ ] Text readable at 200% zoom with the token type scale
