import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const serverRoot = fileURLToPath(new URL("../server", import.meta.url));
// Mirrors the self-referential alias in vite.config.ts, used by modules that
// import their own package by name (e.g. "decorator-client/src/styles/...")
const packageRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            "decorator-server": serverRoot,
            "decorator-client": packageRoot,
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        environmentOptions: {
            jsdom: {
                url: "http://localhost",
            },
        },
    },
});
