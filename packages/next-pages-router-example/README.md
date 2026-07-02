# Dekoratøren Next.js Pages Router example

This app is a local integration harness for testing Dekoratøren in a Next.js Pages Router application.

It verifies two integration points:

- SSR rendering through `fetchDecoratorReact` in `pages/_document.tsx`
- Client-side route changes that update Dekoratøren params from `pages/_app.tsx`

## Running locally

Start Dekoratøren and the example app in separate terminals:

```bash
pnpm run dev
```

```bash
pnpm run example
```

Open [http://localhost:3000](http://localhost:3000).

The page contains links and buttons that exercise both `next/link` and imperative `router.push`/`router.replace` navigation. The route state panel shows the params the app sends to Dekoratøren.

## Playwright

The root Playwright config starts this app together with Dekoratøren:

```bash
pnpm run playwright
```

Use `tests/next-pages-router.spec.ts` for focused SSR and client navigation coverage.
