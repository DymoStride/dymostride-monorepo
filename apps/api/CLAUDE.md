# CLAUDE.md — `@repo/api` (Backend)

Scope-specific rules for the Dymostride HTTP API. Inherits everything in the
[root `CLAUDE.md`](../../CLAUDE.md); this file adds the backend-specific contract. These rules
are **binding**.

---

## Stack

| Concern      | Tool                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| HTTP server  | **Fastify `5`**                                                         |
| ORM          | **Prisma `7`** with the **`@prisma/adapter-pg` driver adapter**         |
| Database     | **PostgreSQL**                                                          |
| Language     | **TypeScript `5.9`**, `strict: true`                                    |
| Module system| **ESM** (`"type": "module"`, `NodeNext` resolution)                     |
| Dev runner   | **tsx** (`tsx watch`); build via `tsc`                                  |
| Validation   | **Fastify JSON Schema** (per-route `schema`) — see rules below          |

### Commands

```bash
pnpm --filter @repo/api dev        # tsx watch src/server.ts (:3000)
pnpm --filter @repo/api build      # tsc -> dist/
pnpm --filter @repo/api start      # node dist/server.js
pnpm --filter @repo/api migrate    # prisma migrate dev
pnpm --filter @repo/api generate   # prisma generate (regenerate the client)
```

### ESM rules (non-negotiable)

- **Relative imports MUST carry the `.js` extension**, even though the source is `.ts`
  (`import { buildApp } from "./app.js"`). This is `NodeNext` — omitting it breaks the build.
- No CommonJS (`require`, `module.exports`). `import`/`export` only.
- Respect `tsconfig.json` `strict: true`; never loosen it to make code compile.

---

## Layered architecture (MANDATORY)

Every feature is a **module** under `src/modules/<name>/`, split into four single-responsibility
layers. Dependencies flow **downward only**:

```
routes  →  controller  →  service  →  repository  →  (Prisma)
transport   HTTP glue     business      data access
```

### `*.routes.ts` — Transport layer

- Registers path + method and **declares the Fastify JSON Schema** for `body` / `params` /
  `querystring`. This is the fail-fast validation boundary.
- **No business logic, no Prisma.** Delegates the handler to the controller.
- Pattern reference: [`modules/user/user.routes.ts`](src/modules/user/user.routes.ts).

### `*.controller.ts` — HTTP glue

- Thin. Reads the already-validated request, calls the service, and shapes the HTTP
  reply/status code (e.g. `reply.code(201).send(...)`).
- **No business rules, no Prisma calls.**
- Pattern reference: [`modules/user/user.controller.ts`](src/modules/user/user.controller.ts).

### `*.service.ts` — Business logic

- Owns domain rules, orchestration, and invariants.
- **Depends on the repository — never touches Prisma directly.**
- Throws typed domain errors (see error handling); it does **not** send HTTP replies.

### `*.repository.ts` — Data access (NEW, REQUIRED)

- **The ONLY place Prisma is called.** One repository per module.
- Exposes intent-named methods (`findAll`, `create`, `findByEmail`) returning domain data;
  callers never see Prisma query objects.
- **Migration target:** the current [`modules/user/user.service.ts`](src/modules/user/user.service.ts)
  calls `this.prisma.user.*` directly. That is the *old* shape. New/edited modules MUST extract
  a `user.repository.ts` that holds the Prisma calls, and slim the service to depend on it:

  ```ts
  // user.repository.ts — the only file that imports/uses Prisma for this module
  import type { PrismaClient } from "../../generated/prisma/client.js";
  import type { CreateUserRequest } from "@repo/shared";

  export class UserRepository {
    constructor(private readonly prisma: PrismaClient) {}
    findAll() { return this.prisma.user.findMany(); }
    create(data: CreateUserRequest) { return this.prisma.user.create({ data }); }
  }

  // user.service.ts — business logic only, no Prisma
  import { UserRepository } from "./user.repository.js";
  import type { CreateUserRequest } from "@repo/shared";

  export class UserService {
    constructor(private readonly users: UserRepository) {}
    findAll() { return this.users.findAll(); }
    create(data: CreateUserRequest) { return this.users.create(data); }
  }
  ```

- **Never `new PrismaClient()` inside a module.** Use the shared client injected via the plugin
  (`req.server.prisma`), threaded into the repository.

---

## Validation — fail fast (Fastify JSON Schema)

- **Every mutating or parameterized route MUST declare a JSON Schema** on its route options
  (`schema.body`, `schema.params`, `schema.querystring`), as in `user.routes.ts`. Invalid input
  is rejected at the transport boundary **before** the controller runs.
- Mark required fields, constrain formats (`format: "email"`), and reject unknown shapes.
- **Keep the DTO types in `@repo/shared` in lockstep with the schema.** The JSON Schema enforces
  at runtime; the `@repo/shared` interface (`CreateUserRequest`, …) types it at compile time —
  both must describe the same shape.
- Controllers may assume `req.body`/`req.params` already satisfy the schema; still cast to the
  shared DTO type for compile-time safety (`req.body as CreateUserRequest`).

> Decision of record: this project validates with **Fastify JSON Schema**, not Zod/class-validator.
> Do not introduce a rival validation library.

---

## Global error handling (REQUIRED — currently missing, close this gap)

- Register **one** `app.setErrorHandler(...)` in [`src/app.ts`](src/app.ts). Handlers,
  services, and repositories **throw typed errors**; they never format error responses inline.
- The handler returns a **consistent error envelope** and maps error kinds to status codes:
  - validation / bad input → **400**
  - not found → **404**
  - unexpected / unhandled → **500** (log the full error via `app.log.error`, but **never leak**
    stack traces, SQL, or internal messages to the client).
- Do not swallow errors or return `200` with an error payload. Fail loudly and consistently.

---

## Plugins & lifecycle

- Cross-cutting concerns are Fastify plugins wrapped with **`fastify-plugin`** so decorators
  are visible app-wide (pattern: [`src/plugins/prisma.ts`](src/plugins/prisma.ts)).
- **DB connection lifecycle stays in `plugins/prisma.ts`**: `$connect` on register,
  `$disconnect` on the `onClose` hook. Don't open connections elsewhere.
- Register plugins and routes in [`src/app.ts`](src/app.ts) (`buildApp()`); keep
  [`src/server.ts`](src/server.ts) as the thin `listen` entrypoint only.
- **Config comes from env** (`DATABASE_URL`) via `dotenv` — never hardcode connection strings,
  ports as magic literals scattered around, or secrets. `.env` is gitignored.

---

## Prisma rules

- The schema is [`prisma/schema.prisma`](prisma/schema.prisma). Change the model there, then
  run `pnpm --filter @repo/api migrate` to produce a migration — never edit generated SQL by hand.
- `src/generated/**` is **generated and gitignored**. Treat it as read-only build output:
  regenerate with `pnpm --filter @repo/api generate`; never hand-edit it, never commit it.
- The Prisma client is instantiated once in [`src/lib/prisma.ts`](src/lib/prisma.ts) with the
  pg adapter. Import that singleton (through the plugin/repository), don't construct new clients.

---

## Universal engineering standard

### Clean code — SOLID / DRY

- One responsibility per layer — do not let logic bleed upward (Prisma in a controller) or
  downward (HTTP status codes in a service).
- DRY shared shapes via `@repo/shared`; DRY data access via the repository.
- Semantic, intent-revealing names for routes, methods, and errors.

### Type safety

- **No `any`.** Use `unknown` + narrowing or a precise type. Type request/reply handlers with
  Fastify's generics or the shared DTOs.
- Explicit return types on service/repository public methods.
- Import contracts from `@repo/shared`; keep them synced with the JSON Schemas.

### AI Constraint & Definition of Done

When you (an AI agent) write or edit code here:

- **No lazy placeholders.** Forbidden in delivered code: `// rest of code remains the same`,
  `// ... existing handlers ...`, elided service/repository bodies, or a stub that returns fake
  data instead of the logic you were asked to implement.
- **Fully implemented & typed.** Complete modules across all four layers, every relative import
  carrying its `.js` extension, every handler typed.
- **Match local conventions.** ESM `.js` specifiers, `fastify-plugin` for cross-cutting concerns,
  Prisma only in repositories, validation only in routes.
- **Prove it's done.** The change must pass `pnpm --filter @repo/api build` (tsc, `strict`) and
  `pnpm --filter @repo/api lint`. Report honestly if a step failed.
- **No unrelated churn.** Change what the task needs; leave untouched modules alone.
