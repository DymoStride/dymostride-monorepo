<div align="center">

# Dymostride

**A full-stack habit tracker with a GitHub-style contribution grid, social feeds, and an AI coach.**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-4ade80.svg?style=flat-square)](LICENSE)
[![Status: pre-alpha](https://img.shields.io/badge/status-pre--alpha-fbbf24?style=flat-square)](#project-status)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-4ade80?style=flat-square)](#contributing)
[![Node](https://img.shields.io/badge/node-%3E%3D20-22c55e?style=flat-square)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-11.9.0-22c55e?style=flat-square)](package.json)

> _"Habits fail when they rely on motivation. Dymostride is built to rely on momentum."_

</div>

---

## What is Dymostride

Dymostride is a habit tracker built on a simple inversion: **action creates motivation, not the other way around.** Instead of asking you to feel ready, it asks you to take one step, then makes that step visible.

Every day you show up fills a square on a GitHub-style contribution grid. Those squares become a streak, the streak becomes momentum, and the momentum is shared with a network of people building their own. When the rhythm breaks, an AI coach reads your actual data and adjusts the goal instead of nagging you.

It is not a calm, zen meditation app. It is a high-energy, data-driven engine for personal growth — ambitious, analytical, and community-driven.

### The name

**Dymo-** — a _dynamo_ converts movement into energy. That is the whole thesis: motion first, motivation second. (It also nods at Dymo label makers — structure imposed on chaos.)

**-stride** — to _hit your stride_ is to find the rhythm where a hard thing turns effortless. Every green square on your grid is one literal stride.

---

## Project status

> [!WARNING]
> **Dymostride is pre-alpha. The product described above does not exist yet.**

Here is the honest state of the repository today:

| Area                                        | Reality                                                                                                                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Public site**                             | A single, router-less **coming-soon page** with a waitlist form. The form validates your email client-side and shows a success message — it **does not send anything anywhere** yet. |
| **The heatmap you see on the landing page** | **Decorative canvas art.** A seeded random grid with a Matrix-rain overlay. It is not driven by user data, because there is no user data.                                            |
| **API**                                     | Fastify + Prisma with exactly **one model (`User`) and two endpoints**. No auth, no habits, no feed.                                                                                 |
| **AI coach, social feed, AWS**              | **Not built.** Not a single line.                                                                                                                                                    |

That gap is not an accident — **it is the invitation.** This repo exists to be a real, well-structured codebase that new contributors can learn on and ship into. See the [Roadmap](#roadmap) for what is claimable.

---

## Tech stack

| Layer           | Tool                      | Version                              | Status     |
| --------------- | ------------------------- | ------------------------------------ | ---------- |
| Package manager | pnpm                      | `11.9.0` (pinned)                    | ✅ in use  |
| Task runner     | Turborepo                 | `^2.5.0`                             | ✅ in use  |
| Runtime         | Node.js                   | `>=20`                               | ✅ in use  |
| **Frontend**    | React                     | `^19.2.7`                            | ✅ in use  |
|                 | Vite                      | `^8.1.1`                             | ✅ in use  |
|                 | Tailwind CSS              | `^4.3.2` (CSS-first, no config file) | ✅ in use  |
|                 | TypeScript                | `~6.0.2`                             | ✅ in use  |
|                 | `clsx` + `tailwind-merge` | `^2.1.1` / `^3.6.0`                  | ✅ in use  |
| **Backend**     | Fastify                   | `^5.9.0`                             | ✅ in use  |
|                 | Prisma                    | `^7.8.0` (via `@prisma/adapter-pg`)  | ✅ in use  |
|                 | PostgreSQL                | 14+                                  | ✅ in use  |
|                 | TypeScript                | `^5.9.3` (ESM, `NodeNext`)           | ✅ in use  |
|                 | Validation                | Fastify JSON Schema                  | ✅ in use  |
| **Planned**     | Authentication            | —                                    | 🗓 planned |
|                 | AI coach (Claude)         | —                                    | 🗓 planned |
|                 | AWS deployment            | —                                    | 🗓 planned |
|                 | Tests + CI                | —                                    | 🗓 planned |

---

## Repository structure

```
dymostride-monorepo/
├── apps/
│   ├── web/                    @repo/web — React + Vite public site (:5173)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/         Pure, stateless primitives (Button, Card, Badge, Logo)
│   │   │   │   ├── sections/   Stateful page sections (Hero, Waitlist)
│   │   │   │   └── *.tsx       App chrome (Navbar, Footer, HeatmapBackground)
│   │   │   ├── constants/      Design constants, shared a11y ids, copy
│   │   │   ├── lib/            cn() helper, variant resolvers, canvas math
│   │   │   └── index.css       Tailwind v4 @theme — the single source of design tokens
│   │   └── CLAUDE.md           Frontend house rules
│   │
│   └── api/                    @repo/api — Fastify + Prisma HTTP API (:3000)
│       ├── src/
│       │   ├── modules/user/   routes → controller → service (→ repository)
│       │   ├── plugins/        fastify-plugin wrappers (Prisma lifecycle)
│       │   ├── lib/            Prisma client singleton
│       │   ├── app.ts          buildApp() — registers plugins + routes
│       │   └── server.ts       Thin listen() entrypoint
│       ├── prisma/schema.prisma
│       └── CLAUDE.md           Backend house rules
│
├── packages/
│   └── shared/                 @repo/shared — types-only wire contract, no build step
│       └── src/index.ts        The single source of truth for web ↔ api shapes
│
├── turbo.json                  Task graph (build / dev / lint)
├── pnpm-workspace.yaml         Workspaces: apps/*, packages/*
└── CLAUDE.md                   Monorepo guardrails — read this first
```

---

## Getting started

### Prerequisites

- **Node.js `>=20`**
- **pnpm `>=9`** — `corepack enable` will install the pinned `11.9.0` for you
- **PostgreSQL 14+**, running locally

### 1. Clone and install

Install from the **repository root**. pnpm links the workspaces for you.

```bash
git clone https://github.com/DymoStride/dymostride-monorepo.git
cd dymostride-monorepo
pnpm install
```

### 2. Set up the database

Create the database:

```bash
createdb dymostride-db
```

Then create `apps/api/.env` by hand — **there is no `.env.example` yet** (adding one is a [good first issue](#roadmap)). `.env` is gitignored:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/dymostride-db"
```

Generate the Prisma client and apply the migration:

```bash
pnpm --filter @repo/api generate
pnpm --filter @repo/api migrate
```

### 3. Run it

```bash
pnpm dev
```

| Service | URL                   |
| ------- | --------------------- |
| Web     | http://localhost:5173 |
| API     | http://localhost:3000 |

Vite proxies `/api` → `:3000`, so the frontend always calls the **relative** `/api/...` path. Never hardcode `http://localhost:3000` in web code.

Smoke-test the API:

```bash
curl http://localhost:3000/api/users
```

---

## Commands

Everything runs through pnpm + Turbo from the **root**. Per the [monorepo guardrails](CLAUDE.md), **never `cd` into a package to run a bare `npm`/`npx`.**

```bash
pnpm dev      # every app in dev mode (persistent, uncached)
pnpm build    # build the whole graph, in dependency order
pnpm lint     # lint the whole graph
```

Target a single workspace with `--filter`:

```bash
pnpm --filter @repo/web dev        # Vite dev server
pnpm --filter @repo/web build      # tsc -b && vite build
pnpm --filter @repo/web lint       # eslint .
pnpm --filter @repo/web preview    # preview the production build

pnpm --filter @repo/api dev        # tsx watch
pnpm --filter @repo/api build      # tsc -> dist/
pnpm --filter @repo/api start      # node dist/server.js
pnpm --filter @repo/api generate   # regenerate the Prisma client
pnpm --filter @repo/api migrate    # prisma migrate dev
```

Add dependencies through pnpm — never hand-edit a `package.json` to add one:

```bash
pnpm --filter @repo/web add clsx
pnpm --filter @repo/api add -D tsx
pnpm --filter @repo/web add @repo/shared@workspace:*   # internal dep
```

---

## Architecture

### Workspace boundaries (strict)

These are hard rules. Breaking them creates coupling that Turbo's dependency graph cannot reason about.

1. **Apps never import from other apps.** Anything shared goes in `@repo/shared`.
2. **Internal deps use `workspace:*`** — import by package name, never a relative path like `../../api/`.
3. **`@repo/shared` stays framework-agnostic.** No React, no Fastify, no Prisma. Types and pure helpers only.
4. **Never reach into another package's internals** — no importing from someone's `dist/` or `src/generated/`.
5. **Prisma types stay in the API.** If the web app needs a shape, declare it as a plain type in `@repo/shared`.

### API request flow

Dependencies flow **downward only**:

```
routes  →  controller  →  service  →  repository  →  Prisma
transport   HTTP glue     business     data access
```

- **`routes`** declares the path and its Fastify JSON Schema. This is the fail-fast validation boundary. No business logic.
- **`controller`** is thin glue: read the validated request, call the service, shape the reply.
- **`service`** owns domain rules. It throws typed errors; it never sends HTTP replies.
- **`repository`** is the **only** place Prisma is touched.

Two things to know before you write backend code:

- **Relative imports must carry a `.js` extension**, even from `.ts` source (`import { buildApp } from "./app.js"`). This is `NodeNext`; omitting it breaks the build.
- The `repository` layer is a **migration target, not a finished state** — `user.service.ts` still calls Prisma directly. New modules must extract one.

Full rules: [`apps/api/CLAUDE.md`](apps/api/CLAUDE.md).

### Web component tiers

| Tier              | Location               | Responsibility                                                                             |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| **UI primitives** | `components/ui/`       | Pure, stateless, prop-driven. `forwardRef` + `displayName`. No `fetch`, no business logic. |
| **Sections**      | `components/sections/` | Composed page sections owning their own local state.                                       |
| **Layout**        | `components/`          | App chrome.                                                                                |

- **Always compose classes with `cn()`** from `lib/utils/tailwindUtils.ts`. Never string-concatenate Tailwind classes.
- **Use semantic tokens** (`bg-surface`, `text-heading`, `brand`). **Never hardcode a hex value in a component** — extend the token set in `index.css` instead.
- **Local `useState` only.** No global store, no router. The site is intentionally one page.

Full rules: [`apps/web/CLAUDE.md`](apps/web/CLAUDE.md).

### The shared contract

[`packages/shared/src/index.ts`](packages/shared/src/index.ts) is the single source of truth for every shape crossing the web ↔ api boundary. Changing a wire shape means: **update `@repo/shared` first**, then both consumers.

---

## Contributing

**This project exists to be contributed to.** It was opened up specifically so developers looking for real open-source experience have somewhere substantial to land. First-time contributors are genuinely welcome — look for issues labelled **`good first issue`**, or take anything from Phase 1 above.

### Workflow

1. Branch from **`dev`**, not `main`. `main` stays stable.
2. Name your branch after its issue: `<issue-number>-short-slug` (e.g. `1-create-main-page-only-ui`).
3. Open your PR back into **`dev`**.

### Definition of done

A change is not done until:

- `pnpm build` and `pnpm lint` pass for the workspace you touched.
- There is **no `any`** — use `unknown` and narrow it.
- There are **no placeholder comments** (`// ... existing code ...`, `// TODO: implement later`) and no stubbed function bodies standing in for real logic.
- You changed **only what the task needed** — no drive-by reformatting.

### Read the house rules

Each package has a `CLAUDE.md` documenting its binding conventions:

- [`CLAUDE.md`](CLAUDE.md) — monorepo boundaries and universal standards
- [`apps/web/CLAUDE.md`](apps/web/CLAUDE.md) — component tiers, styling, a11y
- [`apps/api/CLAUDE.md`](apps/api/CLAUDE.md) — layering, ESM, validation, Prisma

These are written for humans and AI coding agents alike. **AI-assisted contributions are welcome** — the `CLAUDE.md` files exist so an agent produces code that matches the codebase. You remain responsible for what you submit: review it, run the build, and understand every line before you open the PR.

By contributing, you agree that your contributions are licensed under the AGPL-3.0.

---

## License

Licensed under the **GNU Affero General Public License v3.0**. See [`LICENSE`](LICENSE).

In plain English: you are free to use, modify, self-host, and redistribute Dymostride. But if you run a modified version **as a network service**, you must publish your source under the same license. Sharing goes both ways.

---

## Contact

Questions, ideas, or bug reports → [open an issue](https://github.com/DymoStride/dymostride-monorepo/issues).

Chat with the community or say hi → [join our Discord](https://discord.gg/6Rswqhkj7W).

<div align="center">
<sub>Built on momentum.</sub>
</div>
