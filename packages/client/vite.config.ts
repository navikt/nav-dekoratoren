import minifyLiterals from "rollup-plugin-minify-html-literals-v3";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { cssModulesScopedNameOption } from "../shared/css-modules-config";
import NavBrowserTargets from "@navikt/browserslist-config/vite";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));

const mainConfig = defineConfig({
    plugins: [NavBrowserTargets()],
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
        // Minify CSS with Lightning CSS rather than esbuild. It applies the
        // full browserslist targets from build.cssTarget (supplied by
        // NavBrowserTargets)
        // Note this is only the minifier: css.transformer stays
        // on postcss so CSS module class names keep matching the ones the
        // server generates via postcss-modules.
        cssMinify: "lightningcss",
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
    plugins: [NavBrowserTargets()],
    build: {
        // Don't clear the output, we want to keep the main bundle
        emptyOutDir: false,
        minify: true,
        cssMinify: "lightningcss",
        manifest: ".vite/csr.manifest.json",
        rollupOptions: {
            input: ["src/csr.ts"],
        },
    },
});

export default defineConfig(({ mode }) => {
    return mode === "csr" ? csrConfig : mainConfig;
});
