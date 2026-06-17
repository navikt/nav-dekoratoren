# Skill: Cross-platform script helpers

Use this skill when a change makes shell commands or package scripts harder to run on both Windows and POSIX systems.

## Preferred approach

1. Keep package build entrypoints where they already belong.
2. Move script logic into small helper files under `scripts/`.
3. Use native `node:fs` and `node:path` in helper files instead of inline `node -e` snippets.
4. Keep `cross-env` for environment variables that must work in both Windows and POSIX shells.
5. Make only the minimal file changes needed to support the behavior change.

## What to move into helper files

Move logic into a helper file when a package script needs any of these:

- `mkdir -p`
- `rm -rf`
- `cp`
- shell conditionals
- path handling that is easier to read in JavaScript than in JSON

Prefer helper files named for the action they perform, for example:

- `scripts/copy-assets.mjs`
- `packages/server/scripts/setup-env.mjs`

Use `.mjs` unless the repo already has a stronger convention.

## What should stay in `package.json`

Keep `package.json` scripts as short launchers only:

- `node scripts/copy-assets.mjs`
- `cross-env NODE_ENV=production tsx build.ts`
- `node scripts/setup-env.mjs`

Do not add extra shell logic to the script line if the same logic can live in a helper file.

## Package layout rules

- If the file is the actual build program for a package, keep it at the package root.
- Do **not** move a package build entrypoint into `scripts/` just to make the repo look cleaner.
- Put only small utility commands in `scripts/`.

Examples:

- Keep `packages/server/build.ts` at the package root because it is the server build pipeline.
- Move asset-copying or `.env` bootstrap logic into `scripts/*.mjs`.

## Dependency rules

- Add a dependency only if a package imports it directly.
- Remove a dependency only after the last direct import is gone.
- If a helper file replaces a shell command, remove the now-unused package dependency.
- Prefer native `node:fs` over adding a new dependency when Node already supports the needed operation.

## Scope rules

- Do not change unrelated files.
- Do not rename files unless the rename is required for the new helper structure.
- Do not rewrite build behavior unless the change is required for cross-platform compatibility.
- Do not add “nice to have” cleanup in the same change.

## Verification rules

After the change:

1. Run the existing build command for the repo or package.
2. Run the existing lint/typecheck command for the touched package when available.
3. Confirm the new helper file is called from `package.json`.
4. Confirm the old shell fragment or inline `node -e` snippet is gone.
5. Confirm no unrelated files changed.

## Good patterns

Use native file APIs:

```js
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
```

Use them like this:

```js
mkdirSync(resolve("packages/server/public"), { recursive: true });
cpSync(
    resolve("packages/client/dist/assets"),
    resolve("packages/server/public/assets"),
    {
        recursive: true,
    },
);
```

```js
rmSync(resolve("packages/server/public/assets"), {
    recursive: true,
    force: true,
});
```

## Bad patterns

- Inline `node -e` for multi-step file operations.
- Adding a new dependency when native `node:fs` already covers the need.
- Moving a package build pipeline into `scripts/` without a clear reason.
- Bundling unrelated dependency bumps into the same refactor.
