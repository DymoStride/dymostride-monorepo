# CLAUDE.md — `@repo/web` (Frontend)

Scope-specific rules for the Dymostride public site. Inherits everything in the
[root `CLAUDE.md`](../../CLAUDE.md); this file adds the frontend-specific contract. These rules
are **binding**.

---

## Stack

| Concern        | Tool                                                       |
| -------------- | ---------------------------------------------------------- |
| UI library     | **React `19.2`** (function components + hooks only)        |
| Build/dev      | **Vite `8`** (`@vitejs/plugin-react`)                      |
| Styling        | **Tailwind CSS v4** via `@tailwindcss/vite`                |
| Language       | **TypeScript `~6.0`** (bundler resolution)                 |
| Class utils    | `clsx` + `tailwind-merge`, wrapped as `cn()`               |
| Contracts      | `@repo/shared` (types shared with the API)                 |

### Commands

```bash
pnpm --filter @repo/web dev        # Vite dev server (:5173), /api proxied to :3000
pnpm --filter @repo/web build      # tsc -b && vite build
pnpm --filter @repo/web lint       # eslint .
pnpm --filter @repo/web preview    # preview the production build
```

---

## Single-page constraint (READ FIRST)

`apps/web` is **intentionally a single, router-less page**: `Navbar` + `Hero` +
coming-soon `Waitlist` + `Footer`, composed directly in [`src/App.tsx`](src/App.tsx).

- **Do NOT add a router** (`react-router` etc.), extra routes, or nav links to non-existent
  pages. The product has no prototype yet; the site only teases a launch and captures a waitlist.
- The waitlist form in [`src/components/sections/Waitlist.tsx`](src/components/sections/Waitlist.tsx)
  is **UI-only**. When the API is ready, wire it to `POST /api/waitlist` (through the Vite `/api`
  proxy) — do not invent other endpoints.
- Revisit this rule only when there is a real authenticated product surface to link to.

---

## Component architecture

Preserve the existing three-tier split under `src/components/`:

| Tier                    | Location               | Responsibility                                                        |
| ----------------------- | ---------------------- | --------------------------------------------------------------------- |
| **UI primitives**       | `components/ui/`       | Presentational, prop-driven, reusable (`Button`, `Card`, `Badge`, `Logo`). |
| **Sections**            | `components/sections/` | Composed page sections that own their own local state (`Hero`, `Waitlist`). |
| **Layout**              | `components/`          | App chrome (`Navbar`, `Footer`, `HeatmapBackground`).                 |

Rules:

- **Presentational vs. container separation.** UI primitives are **pure and stateless** — no
  `fetch`, no business logic, no app-specific knowledge. They take props and render. State,
  effects, and orchestration live in section/layout containers.
- **`ui/` primitives follow the established pattern:** `forwardRef` + `displayName`, a typed
  props interface extending the native element's props (see
  [`components/ui/Button.tsx`](src/components/ui/Button.tsx),
  [`components/ui/Card.tsx`](src/components/ui/Card.tsx)).
- **No business rules in `ui/`.** If a component needs to know about "waitlist" or "user", it
  belongs in `sections/`, not `ui/`.

---

## State management

- **Local `useState` only** — there is no global store, and none should be added until a real
  need appears (do not reach for Redux/Zustand/Context "just in case").
- **Colocate state** at the lowest component that needs it. Lift state up **only** when two
  siblings genuinely share it.
- Use `useId` for accessible id wiring (as `Waitlist.tsx` does), not hand-rolled string ids.
  Truly-shared constant ids live in `constants/` (e.g. `WAITLIST_EMAIL_ID`).

---

## Styling idioms (MANDATORY)

- **Always compose classes with `cn()`** from
  [`lib/utils/tailwindUtils.ts`](src/lib/utils/tailwindUtils.ts) — never string-concatenate
  Tailwind classes or spread raw `className` without merging.
- **Multi-variant components use the variant-resolver pattern**: a typed resolver function +
  `Record<Variant, string>` maps, mirroring
  [`lib/types/buttonVariants.ts`](src/lib/types/buttonVariants.ts). Don't inline giant ternaries.
- **Use semantic Tailwind tokens** (`bg-surface`, `text-heading`, `text-body`, `text-muted`,
  `border-line`, `brand`, `brand-ink`, …). **Never** hardcode raw hex or arbitrary colors in
  components — extend the token set instead.
- **Keep design constants in `constants/`** (opacities, ids, copy), not scattered as magic
  values in JSX.

---

## Type-safe data / API contract

- **All request/response types come from `@repo/shared`.** Never re-declare a `User` /
  `CreateUserRequest` shape locally.
- When data fetching is introduced: type every response against the shared contract, hit the
  backend through the relative `/api` path (Vite proxies it to `:3000` — see
  [`vite.config.ts`](vite.config.ts)), and never leave a `fetch` result as `any`/untyped.
- No direct imports of the API's Prisma types — the boundary is `@repo/shared` only.

---

## Loading / error / empty states

- **Every async surface renders all three states explicitly**: loading, error, and empty. No
  silent spinners-forever, no unhandled rejections.
- **Forms validate and surface errors accessibly**, matching the pattern already in
  [`Waitlist.tsx`](src/components/sections/Waitlist.tsx): `aria-invalid`, `aria-describedby`,
  `role="alert"` for errors, `role="status"` for success.
- When real fetching lands, wrap risky UI trees in an error boundary rather than letting a
  render throw take down the page.

---

## Accessibility baseline

- Semantic landmarks (`<main>`, `<nav>`, `<footer>`) and a working skip link (`sr-only` →
  `focus:not-sr-only`), as in `App.tsx`.
- Every input has an associated `<label>` (via `htmlFor`/`useId`).
- Interactive elements are real buttons/links with visible focus rings (`focus-visible:ring-*`).

---

## Universal engineering standard

### Clean code — SOLID / DRY

- One responsibility per component/hook/util; small and composable.
- DRY shared shapes via `@repo/shared`; DRY class logic via `cn()` + variant resolvers.
- Semantic, intent-revealing names for components, props, and handlers.

### Type safety

- **No `any`.** Use `unknown` + narrowing or a precise type. Type all props, handlers, and
  hook returns.
- Prefer typed props interfaces that extend the underlying DOM element's attribute type.
- Import contracts from `@repo/shared`; don't duplicate them.
- Do not weaken `tsconfig.app.json` (`noUnusedLocals`, `verbatimModuleSyntax`, etc.) to pass.

### AI Constraint & Definition of Done

When you (an AI agent) write or edit code here:

- **No lazy placeholders.** Forbidden in delivered code: `// rest of code remains the same`,
  `// ... existing JSX ...`, elided component bodies, or a `return null` standing in for the UI
  you were asked to build.
- **Fully implemented & typed.** Complete components with all imports, props typed, and every
  loading/error/empty branch actually rendered.
- **Match local conventions.** `cn()` for classes, semantic tokens for color, `forwardRef` +
  `displayName` for `ui/` primitives, `useId` for a11y wiring.
- **Prove it's done.** The change must pass `pnpm --filter @repo/web build` and
  `pnpm --filter @repo/web lint`. Report honestly if something failed.
- **No unrelated churn.** Don't restyle or reformat components the task didn't touch.
