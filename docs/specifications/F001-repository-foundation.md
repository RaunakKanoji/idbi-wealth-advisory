# F001 — Repository and Workspace Foundation

| | |
| --- | --- |
| Phase | 1 — Shared + mobile foundation |
| Status | Not started |
| Depends on | docs/architecture/repository-structure.md |

## Scope

Monorepo tooling that lets the responsive app and shared packages evolve together
without duplicated logic or build ceremony.

## Requirements

- npm workspaces: `apps/*`, `packages/*` (services join when they gain code).
- Node 22 (LTS) pinned via `.nvmrc`; `engines` declared in the root package.
- Shared `tsconfig.base.json`: strict mode, `moduleResolution: bundler`, ES2022.
- Internal packages named `@idbi/*`, consumed **as source** (`main: src/index.ts`)
  and listed in Next.js `transpilePackages` — no per-package build step during the
  hackathon.
- Root scripts: `dev`, `build`, `typecheck` delegating to workspaces.
- No `apps/mobile/` or `apps/web/` (Decision D-001); no domain logic inside
  `apps/banking` (placement rules in repository-structure.md).

## Acceptance criteria

- [ ] `npm install` at the root links all workspaces
- [ ] `npm run dev` starts the banking app; `npm run typecheck` covers app + packages
- [ ] An `@idbi/*` package edit hot-reloads in the running app
- [ ] TypeScript strict mode enabled everywhere
