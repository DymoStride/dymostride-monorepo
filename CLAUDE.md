# CLAUDE.md — `dymostride-monorepo` (Root)

Monorepo guardrails for the Dymostride project. Scope-specific rules live in
[`apps/web/CLAUDE.md`](apps/web/CLAUDE.md) (frontend) and
[`apps/api/CLAUDE.md`](apps/api/CLAUDE.md) (backend). This file governs the workspace as a
whole. Its rules are **binding**, not suggestions.

---

## Stack snapshot

| Concern         | Tool                                                             |
| --------------- | ---------------------------------------------------------------- |
| Package manager | **pnpm `11.9.0`** (pinned via `packageManager`)                  |
| Task runner     | **Turborepo `2.5`** (`turbo.json`)                               |
| Language        | **TypeScript** everywhere                                        |
| Runtime         | **Node `>=20`** (pnpm `>=9`) — see root `package.json` `engines` |

### Package graph

| Package        | Path              | Role                                                    |
| -------------- | ----------------- | ------------------------------------------------------- |
| `@repo/web`    | `apps/web`        | React + Vite public site (deployable app)               |
| `@repo/api`    | `apps/api`        | Fastify + Prisma HTTP API (deployable app)              |
| `@repo/shared` | `packages/shared` | Framework-agnostic shared **types/contracts** (library) |

Workspaces are declared in `pnpm-workspace.yaml` (`apps/*`, `packages/*`). All internal
packages use the `@repo/*` scope.

---

## Commands

Run everything through pnpm + Turbo. **Do not** `cd` into a package to run a bare `npm`/`npx`.

```bash
# Install (root) — installs the whole workspace
pnpm install

# Run all apps in dev (Turbo, persistent, uncached)
pnpm dev

# Build / lint the whole graph (respects dependency order)
pnpm build
pnpm lint
```

### Targeting a single package

```bash
pnpm --filter @repo/web dev        # frontend dev server (Vite, :5173)
pnpm --filter @repo/api dev        # backend dev server  (tsx watch, :3000)
pnpm --filter @repo/web build
pnpm --filter @repo/api build
```

### Managing dependencies

```bash
# Add a dependency to ONE package (never hand-edit a package.json to add deps)
pnpm --filter @repo/web add clsx
pnpm --filter @repo/api add fastify
pnpm --filter @repo/api add -D tsx        # dev dependency

# Depend on an internal package — always the workspace protocol
pnpm --filter @repo/web add @repo/shared@workspace:*
```

Respect the `engines` field: Node `>=20`, pnpm `>=9`. Do not introduce syntax or APIs that
require a newer Node than that.

---

## Workspace boundaries (STRICT)

These are hard architectural rules. Violating them creates cross-contamination that Turbo's
dependency graph cannot reason about.

1. **Apps never import from other apps.** `@repo/web` must not import from `@repo/api` and vice
   versa. Any code shared between them belongs in `@repo/shared`.
2. **Internal deps use `workspace:*`.** Never reference another package by a relative path
   (`../../api/...`) or a version range. Import by its package name (`@repo/shared`).
3. **`@repo/shared` stays framework-agnostic.** It must not import React, Fastify, Prisma, or
   any runtime-specific package. It contains **types and pure helpers only** — anything that
   both a browser and a Node process can consume.
4. **Never reach into another package's internals.** Do not import from another package's
   `src/generated/**`, `dist/**`, or a deep file path. Import only what a package publicly
   exports (`@repo/shared` → `packages/shared/src/index.ts`).
5. **Prisma-generated types stay in the API.** `apps/api/src/generated/**` is API-private.
   If the web app needs a shape, define/copy it as a plain type in `@repo/shared` — never
   import the generated Prisma client into the frontend.

---

## Shared contract (`@repo/shared`)

[`packages/shared/src/index.ts`](packages/shared/src/index.ts) is the **single source of truth**
for request/response shapes crossing the web↔api boundary (e.g. `User`, `CreateUserRequest`).

- Changing a wire shape? **Update `@repo/shared` first**, then update both consumers.
- Keep it a **pure declaration** package: no side effects, no framework imports.
- It is source-only (`main`/`types` point at `./src/index.ts`) — consumers compile it, so keep
  it valid TypeScript that any workspace's tsconfig can process.

---

## Turbo / task rules

- The build graph respects `dependsOn: ["^build"]` — an app builds only after its workspace
  deps build. Don't work around this by manually pre-building.
- Don't bypass Turbo for `build`/`lint`/`dev` at the root; use the scripts above.
- Generated & build output are gitignored and must stay that way: `node_modules/`, `.turbo/`,
  `dist/`, `.env`, `**/generated/`. Never commit them, never edit them by hand.

---

## Universal engineering standard (applies to every package)

### Clean code — SOLID / DRY

- **Single Responsibility:** one clear job per module/function/component.
- **DRY:** de-duplicate shared shapes via `@repo/shared`; de-duplicate logic via small local
  utilities. Prefer composition over copy-paste.
- **Small & focused:** short functions, early returns, no deep nesting, no dead code.
- **Semantic naming:** names describe intent (`createUser`, `WAITLIST_EMAIL_ID`), not type or
  mechanics (`data2`, `handleThing`). No abbreviations that aren't already idiomatic here.

### Type safety

- **No `any`.** Use `unknown` + explicit narrowing, or a precise type. `as` casts are a last
  resort and must be justified in a comment.
- **Explicit types on public boundaries:** exported functions, module APIs, and cross-package
  values carry explicit parameter and return types.
- **Reuse contracts:** import shared shapes from `@repo/shared` rather than re-declaring them.
- Respect each package's `tsconfig` — do not loosen compiler options to make code compile.

### AI Constraint & Definition of Done

When you (an AI agent) write or edit code in this repo:

- **No lazy placeholders.** Forbidden in delivered code: `// rest of code remains the same`,
  `// ... existing code ...`, `// TODO: implement later`, elided function bodies, or stubbed
  returns standing in for real logic you were asked to write.
- **Fully implemented & typed.** Every block you emit is complete, imports everything it uses,
  and type-checks. No hand-waving.
- **Match local conventions.** Follow the target package's idioms (ESM `.js` import specifiers
  in `@repo/api`; `cn()` + semantic tokens in `@repo/web`).
- **Prove it's done.** Before calling a change complete, it must pass the affected workspace's
  `build`/typecheck and `pnpm lint`. State honestly if a step failed.
- **No unrelated churn.** Change what the task needs; don't reformat or refactor untouched code.
