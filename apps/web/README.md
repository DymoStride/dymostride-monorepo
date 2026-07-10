# @repo/web — Dymostride (Web)

The frontend for **Dymostride**, a habit tracker built on momentum. This package is the
public-facing site: a React + Vite single-page app.

> **Status: early development.**
> Right now this is a **coming-soon landing page** with a waitlist sign-up form. The form is
> UI-only — it validates the email and shows a confirmation, but does **not** submit anywhere
> yet. There is no product behind it; that is what we are building.

For the full project overview, the complete tech stack, and how the monorepo fits together,
see the [root README](../../README.md).

---

## Tech

- **React 19** + **TypeScript**
- **Vite 8** (dev server + build)
- **Tailwind CSS v4** (CSS-first, no config file — tokens live in `src/index.css`)

## Getting started

Run everything from the **repository root** with pnpm.

```bash
# install once, from the repo root
pnpm install

# start the dev server → http://localhost:5173
pnpm --filter @repo/web dev
```

Other commands:

```bash
pnpm --filter @repo/web build      # type-check + production build
pnpm --filter @repo/web lint       # lint
pnpm --filter @repo/web preview    # preview the production build
```

## Project structure

```
src/
├── components/
│   ├── ui/          Reusable primitives (Button, Card, Badge, Logo)
│   ├── sections/    Page sections (Hero, Waitlist)
│   └── *.tsx        Layout (Navbar, Footer, HeatmapBackground)
├── constants/       Design constants and shared ids
├── lib/             Helpers — cn(), canvas animation math
├── App.tsx          Composes the single page
└── index.css        Tailwind v4 theme + design tokens
```

The site is intentionally a **single, router-less page** while the product is pre-launch.

## Contributing

This package has house rules for components, styling, and state. Please read
[`CLAUDE.md`](CLAUDE.md) before making changes.
