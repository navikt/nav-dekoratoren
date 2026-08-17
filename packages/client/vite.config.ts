import minifyLiterals from "rollup-plugin-minify-html-literals-v3";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { cssModulesScopedNameOption } from "../shared/css-modules-config";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));

/**
 * Derived from the "browserslist" key in the repo root package.json, which is
 * the single source of truth for our supported browser floor.
 *
 * This makes esbuild downlevel syntax that the floor cannot parse, and fail the
 * build outright on syntax it cannot downlevel.
 *
 * NOTE: this only guards *syntax*. Runtime APIs (AbortSignal.timeout,
 * Object.groupBy, structuredClone, ...) are invisible to the bundler and are
 * guarded separately by eslint-plugin-compat. See CONTRIBUTING.md.
 */
const browserTargets = browserslistToEsbuild();

const mainConfig = defineConfig({
    resolve: {
        alias: {
            "decorator-client": packageRoot,
        },
    },
    server: {
        origin: "http://localhost:5173",
    },
    logLevel: "info",
    build: {
        minify: true,
        target: browserTargets,
        manifest: true,
        sourcemap: true,
        // Prevent inlining any asset imports, always import as url
        assetsInlineLimit: 0,
        rollupOptions: {
            treeshake: false,
            plugins: [minifyLiterals()],
            input: ["src/main.ts"],
        },
    },
    css: {
        modules: {
            ...cssModulesScopedNameOption,
        },
    },
});

const csrConfig = defineConfig({
    build: {
        // Don't clear the output, we want to keep the main bundle
        emptyOutDir: false,
        minify: true,
        target: browserTargets,
        manifest: ".vite/csr.manifest.json",
        rollupOptions: {
            input: ["src/csr.ts"],
        },
    },
});

export default defineConfig(({ mode }) => {
    return mode === "csr" ? csrConfig : mainConfig;
});
