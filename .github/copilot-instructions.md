# Copilot Instructions

## Project Overview

Nav Dekoratøren is the shared header and footer for all external-facing nav.no applications. It provides server-side rendered HTML and client-side Web Components for consistent branding, user login state, navigation, consent banners, analytics, and more.

## Monorepo Structure

pnpm monorepo with five packages under `packages/`:

- **`decorator-client`** – Browser-side Web Components and styles. Vite bundles two outputs: `main` (for SSR injection) and `csr` (for client-side rendering).
- **`decorator-server`** – Hono HTTP server (port 8089) serving `/ssr`, `/api/*`, and static assets. Handles auth, feature flags (Unleash), CSP headers, and server-side rendering of the decorator HTML.
- **`decorator-shared`** – Shared utilities, types, and HTML templates used by both client and server.
- **`decorator-icons`** – Compiles custom SVG icons + `@navikt/aksel-icons` into a distributable.
- **`next-pages-router-example`** – Demo Next.js app showing integration via `@navikt/nav-dekoratoren-moduler`.

Packages reference each other as workspace dependencies (`"decorator-shared": "workspace:*"`). Build order: icons → client → server.

## Commands

```bash
# Development
pnpm run dev              # Starts client (Vite) + server (tsx --watch) concurrently on localhost:8089

# Building
pnpm run build            # Full build: icons → client → server → copies assets to packages/server/public/

# Testing
pnpm run test             # Run all Vitest test suites across packages
pnpm run playwright       # Run Playwright E2E tests

# Linting
pnpm run lint             # Run ESLint + tsc --noEmit across all packages

# Per-package (use --filter)
pnpm --filter decorator-client run test        # Run client tests once
pnpm --filter decorator-client run test:watch  # Watch mode
pnpm --filter decorator-server run test
pnpm --filter decorator-shared run test

# Single test file
cd packages/client && pnpm vitest run src/path/to/file.test.ts
cd packages/server && pnpm vitest run src/path/to/file.test.ts
```

> **Note:** `TZ=UTC` is set automatically for client tests (important for date-related assertions).

## Architecture

### No frameworks on the client

The client is built exclusively with **native Web Components** (`extends HTMLElement`). No React, Vue, or Angular. This keeps the bundle small and avoids framework churn. Components register themselves via `customElements.define()`.

### SSR + hydration pattern

The server renders full decorator HTML (header/footer) as a string and injects it into pages. The client bundle then hydrates and enhances these with Web Components. The `decorator-shared` package's `html` tagged template literal is used for server-side HTML generation.

### Dual-mode client build

Vite builds the client twice:

- `--mode main` → `dist/client.js` — loaded by the server for SSR injection
- `--mode csr` → `dist/csr.js` — loaded by client apps doing client-side rendering

### Event-driven inter-component communication

Web Components communicate via `window.dispatchEvent()` with custom events (e.g., consent changes, logout warnings, language changes). See `packages/client/src/events.ts` for the event catalog.

## Key Conventions

### HTML templates (`decorator-shared/html.ts`)

Use the custom `html` tagged template literal for all server-rendered HTML. It handles XSS escaping and i18n rendering:

```ts
import { html } from "decorator-shared/html";
const markup = html`<div>${userInput}</div>`.render({ language: "nb" });
```

### CSS Modules

Client components use CSS Modules with TypeScript typing via `typescript-plugin-css-modules`. Import styles as:

```ts
import styles from "./MyComponent.module.css";
// styles.myClass is typed
```

### TypeScript path aliases

Both client and server tsconfig define cross-package aliases:

- `decorator-server/src/*` → `packages/server/src/*`
- `decorator-client/src/*` → `packages/client/src/*`

Use these aliases when importing across packages rather than relative `../../` paths.

### Test file placement

- Unit tests are colocated with source: `*.test.ts` next to the file under test
- Shared package tests live in `packages/shared/test/`
- Playwright E2E tests live in `tests/` at the root

### ESLint flat config

ESLint uses the new flat config format (`eslint.config.mjs`), not `.eslintrc`. Don't create `.eslintrc` files.

### Logging

Use the shared `logger` from `decorator-shared/logger` in both client and server code — it outputs structured JSON on the server and readable console logs in the browser.

## Local Setup Prerequisites

- **Node.js** — check `engines` field in `package.json` for the required version
- **pnpm** — check `packageManager` field in `package.json` for the required version
- **`NODE_AUTH_TOKEN`** environment variable — a GitHub PAT with `packages:read` scope and `navikt` SSO authorization, needed to install `@navikt/*` packages from the private registry

## Deployment

The server runs on port 8089. The Docker image copies only `packages/server/dist` and `packages/client/dist/assets`. Deployed to NAIS (Norwegian Kubernetes). Health endpoints: `GET /api/isAlive` and `GET /api/isReady`. Metrics at `GET /metrics` (Prometheus).
