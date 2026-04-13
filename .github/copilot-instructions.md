# Copilot Instructions

## Project Overview

Nav Dekoratøren is the shared header and footer for external nav.no applications. It serves server-rendered HTML and client-side Web Components for branding, auth state, navigation, consent, and analytics.

## Monorepo Structure

pnpm workspace under `packages/`:

- **`decorator-client`**: Web Components and styles, Vite builds `main` (for SSR injection) and `csr` (for client-side rendering)
- **`decorator-server`**: Hono server on port 8089 serving `/ssr`, `/api/*`, and static assets. Handles auth, feature flags (Unleash), CSP headers, and server-side rendering of the decorator HTML.
- **`decorator-shared`**: Shared utilities, types, and HTML templates
- **`decorator-icons`**: Icon build package
- **`next-pages-router-example`**: Integration example app

Packages use workspace dependencies. Build order: icons → client → server.

## Commands

```bash
pnpm run dev              # Starts client (Vite) + server (tsx --watch) concurrently on localhost:8089
pnpm run build            # Full build: icons → client → server → copies assets to packages/server/public/
pnpm run test             # Run all Vitest test suites across packages
pnpm run playwright       # Run Playwright E2E tests
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

The client is built with native Web Components (`extends HTMLElement`), not React, Vue, or Angular. Components register themselves via `customElements.define()`.

### SSR + hydration pattern

The server renders decorator HTML as a string and the client enhances it with Web Components. Use the `decorator-shared/html` tagged template literal for server-rendered HTML.

### Dual-mode client build

Vite builds the client twice:

- `--mode main` builds the `src/main.ts` entry and writes a Vite manifest at `dist/.vite/manifest.json` that the server uses to resolve the generated JS and CSS assets for SSR injection
- `--mode csr` builds the `src/csr.ts` entry and writes a separate manifest at `dist/.vite/csr.manifest.json` that client apps use to resolve the generated CSR bundle

### Event-driven inter-component communication

Web Components communicate with `window.dispatchEvent()`. See `packages/client/src/events.ts` for the event catalog.

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

Use the cross-package aliases from tsconfig, especially `decorator-server/src/*` and `decorator-client/src/*`, instead of relative `../../` imports.

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

Runs on port 8089. The Docker image copies `packages/server/dist` and `packages/client/dist/assets`. Health endpoints: `GET /api/isAlive` and `GET /api/isReady`. Metrics: `GET /metrics`.
