import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import browserCompat from "eslint-plugin-compat";
import globals from "globals";
import { compatRestrictedProperties } from "./eslint-compat-restrictions.generated.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ["**/*.js", "**/*.cjs"],
    },
    {
        // All .mjs files in this repo are Node-executed tooling (eslint config,
        // build scripts, next.config). Give them the Node global scope.
        files: ["**/*.mjs"],
        languageOptions: {
            globals: { ...globals.nodeBuiltin, process: "readonly" },
        },
    },
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
    {
        /**
         * Browser compatibility guard.
         *
         * Our supported browser floor is defined by the "browserslist" key in the
         * root package.json. That single value drives three layers:
         *
         *   1. The Vite build target (packages/client/vite.config.ts) guards
         *      SYNTAX. esbuild downlevels what it can and fails the build on what
         *      it cannot.
         *   2. The TypeScript `lib` setting guards ES BUILT-INS. With
         *      lib: ["ES2022", ...], calls like Object.groupBy or Array#toSorted
         *      are already type errors.
         *   3. This config guards WEB APIs, which neither of the above can see.
         *      `AbortSignal.timeout()` is just a method call: the bundler emits it
         *      untouched and lib.dom.d.ts is unversioned, so only a compat-data
         *      aware lint rule can catch it.
         *
         * Layer 3 is itself two rules, because one is not enough:
         *
         *   - compat/compat covers instance methods, properties and constructors.
         *     Its dataset (ast-metadata-inferer) omits STATIC members entirely, so
         *     it does not catch AbortSignal.timeout, URL.canParse, and similar.
         *   - no-restricted-properties fills exactly that hole, from a list
         *     generated straight out of @mdn/browser-compat-data. See
         *     scripts/generate-compat-restrictions.mjs.
         *
         * We spread the plugin's own flat/recommended config because it supplies
         * the browser globals the rule needs to resolve identifiers. Without those
         * globals compat/compat silently reports nothing.
         *
         * Scoped to the packages whose code actually executes in the browser.
         * decorator-server is deliberately excluded: it targets node24 and would
         * report false positives for everything.
         *
         * To use an API above the floor, polyfill it and record the exemption:
         * add it to settings.polyfills (for compat/compat) and/or disable
         * no-restricted-properties at the call site with a comment explaining
         * where the polyfill comes from. See CONTRIBUTING.md.
         */
        ...browserCompat.configs["flat/recommended"],
        files: [
            "packages/client/**/*.ts",
            "packages/shared/**/*.ts",
            "packages/icons/**/*.ts",
        ],
        ignores: [
            "**/*.test.ts",
            "**/*.spec.ts",
            "**/*.stories.ts",
            "**/test/**",
            "**/tests/**",
            "**/*.config.ts",
        ],
        settings: {
            // Also check ES built-ins (Array.prototype.at, ...), not just Web APIs.
            lintAllEsApis: true,
            // Web APIs we knowingly ship above the browser floor because they are
            // polyfilled or otherwise guaranteed to be present at runtime.
            polyfills: [],
        },
        rules: {
            ...browserCompat.configs["flat/recommended"].rules,
            "no-restricted-properties": [
                "error",
                ...compatRestrictedProperties,
            ],
        },
    },
];
