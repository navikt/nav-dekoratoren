import minifyLiterals from "rollup-plugin-minify-html-literals-v3";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { cssModulesScopedNameOption } from "../shared/css-modules-config";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));

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
        target: "ES2022",
        // Browsers supported by the decorator. Without this esbuild cannot tell which CSS
        // features need lowering, and ships e.g. CSS nesting (Chrome 112+/Safari 16.5+) as-is.
        cssTarget: [
            "chrome108",
            "edge108",
            "firefox121",
            "safari16",
            "ios16",
            "opera95",
        ],
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
        manifest: ".vite/csr.manifest.json",
        rollupOptions: {
            input: ["src/csr.ts"],
        },
    },
});

export default defineConfig(({ mode }) => {
    return mode === "csr" ? csrConfig : mainConfig;
});
