import { partytownRollup } from "@builder.io/partytown/utils";
import path from "path";
import minifyLiterals from "rollup-plugin-minify-html-literals-v3";
import { defineConfig } from "vite";
import { cssModulesScopedNameOption } from "../shared/css-modules-config";

const mainConfig = defineConfig({
    server: {
        origin: "http://localhost:5173",
    },
    logLevel: "info",
    build: {
        minify: true,
        target: "esnext",
        manifest: true,
        sourcemap: true,
        // Prevent inlining any asset imports, always import as url
        assetsInlineLimit: 0,
        rollupOptions: {
            plugins: [
                minifyLiterals(),
                partytownRollup({
                    dest: path.join(__dirname, "dist", "~partytown"),
                }),
            ],
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
