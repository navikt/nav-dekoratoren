---
name: decorator-ssr-views
description: Use this skill when working on Nav Dekoratøren SSR/client shared markup, native Web Components, `decorator-shared/views`, `data-hydrate` contracts, `getRequiredElement`, `templateToFragment`, or `onParamsUpdated`. Trigger for tasks that add new shared SSR views, move duplicated server/client markup into shared renderers, update hydration selectors, clean up class-based behavior hooks, or refactor params-driven decorator components.
---

# Decorator SSR Views

Server views render stable HTML. Client Web Components attach behavior, listen for events, and update dynamic state. Shared view renderers belong in `packages/shared/views/` when server and client need the same stable markup or when the client regenerates markup already rendered by SSR.

Hydration-critical nodes use `data-hydrate`, not CSS-module classes or fragile structural selectors. CSS classes remain styling concerns. Preserve Aksel classes and all styling classes unless a class existed only as a behavior hook.

## Files and helpers

Use these existing helpers before adding new ones:

| Need                            | Use                                                                    |
| ------------------------------- | ---------------------------------------------------------------------- |
| SSR-safe markup                 | `decorator-shared/html`                                                |
| Hydration hook definitions      | `defineHydrationHooks` from `decorator-shared/hydration`               |
| Render hook attributes          | `hydrateAttr` or `hydrateAttrObject` from `decorator-shared/hydration` |
| Required client DOM lookup      | `getRequiredElement` from `packages/client/src/helpers/dom.ts`         |
| Shared template to DOM fragment | `templateToFragment` from `packages/client/src/helpers/dom.ts`         |
| Filtered params updates         | `onParamsUpdated` from `packages/client/src/helpers/params-updated.ts` |

Existing shared views and contracts live under `packages/shared/views/`.

## Creating a shared view

1. Search for existing server/client markup and behavior before editing.
2. Create or update `packages/shared/views/<name>.ts`.
3. Render markup with `decorator-shared/html`.
4. Define required hydration hooks once:

    ```ts
    import { defineHydrationHooks, hydrateAttr } from "../hydration";

    export const [exampleHook, exampleSelector] = defineHydrationHooks({
        trigger: "example.trigger",
        menu: "example.menu",
    });
    ```

5. Add `data-hydrate` only to nodes the client must find.
6. Keep styling classes for layout, state, and Aksel styling.
7. Export the renderer and hook/selector pair.
8. Update server code to re-export or wrap the shared renderer.
9. Update client code to use shared selectors with `getRequiredElement`.
10. Add server contract tests and client hydration/regeneration tests.

Prefer a server wrapper when the server owns localized copy, buttons, alerts, or composed content. Prefer a direct re-export when the shared renderer owns the full markup.

## Updating an existing component

Start by separating stable markup from behavior. The shared renderer describes the static structure; the custom element attaches listeners, updates state, logs analytics, and reacts to params or auth events.

Use this flow:

1. Identify duplicated markup or class-based behavior lookups.
2. Move stable markup decisions into `packages/shared/views/<name>.ts`.
3. Replace behavior lookups such as `querySelector(".className")`, `getRequiredElement(this, "form")`, or `:scope > button` with shared selectors.
4. Use `templateToFragment` when the client regenerates markup from a shared renderer.
5. Use `onParamsUpdated` for params-driven components. Keep the default `initial: false` to preserve SSR markup on connect; pass `initial: true` only when immediate sync is required.
6. Preserve public contracts: custom element names, IDs, form names, ARIA attributes, analytics attributes, and endpoint payload shapes.
7. Keep dynamic fetching, timers, browser APIs, and analytics in client code unless they are already server concerns.

## Hydration contracts

Use compact values in the form `<component>.<part>`, for example:

```ts
lang.trigger;
search.input;
screenshare.dialog;
logout.time;
```

Name hooks after behavior contracts, not CSS classes. If a node only needs styling, do not add a hydration hook.

When a shared renderer accepts a callback that must receive hydration attributes, make the shared renderer inject those attributes. `DropdownMenu` is the model: it owns the trigger hook and passes attributes to the button callback so callers cannot forget the contract.

## Failure behavior

Use `getRequiredElement` for required SSR nodes. It should fail fast with `Missing required element: <selector>` when a markup contract is broken.

Do not use broad `try/catch`, silent early returns, or optional chaining for required hydration nodes. Optional paths are fine only when the component genuinely supports missing markup, such as disabled screensharing modal form controls.

## Testing and validation

Add focused tests with the migration:

- Server contract tests for tags, IDs, ARIA attributes, form names, and `data-hydrate` hooks.
- Client tests for SSR hydration, regeneration, empty states, and disabled states.
- Real call-site tests when a shared renderer accepts callbacks.
- Playwright when the change affects header, footer, language selector, breadcrumbs, menu behavior, or CSR/SSR replacement.

Run the narrow tests first, then run the relevant package lints and build. If server lint fails because client Vite manifests are missing, run `pnpm run build` and rerun lint.

Useful commands:

```bash
pnpm --filter decorator-client run lint
pnpm --filter decorator-server run lint
pnpm --filter decorator-shared run lint
pnpm run test
pnpm run build
pnpm exec playwright test --workers=1
```

## Review checklist

Before finishing, verify:

- Shared markup still uses `decorator-shared/html`.
- Client hydration uses shared selectors instead of styling classes.
- Aksel and styling classes remain intact.
- SSR output still preserves public IDs, ARIA, form names, and custom element tags.
- Params-driven components use `onParamsUpdated` and unsubscribe on disconnect.
- Missing required markup fails clearly.
- Tests cover both server contract and client behavior.
