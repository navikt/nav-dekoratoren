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
        setupFiles: ["./src/test-setup.ts"],
        environment: "jsdom",
        // Vitest otherwise fakes every clock it can find, including
        // requestAnimationFrame. No source file uses rAF — only @open-wc's
        // `fixture()` does, to await a frame — so faking it buys tests nothing
        // and costs a frame of wall-clock each. Naming the clocks we do want
        // faked leaves the fast rAF from test-setup.ts in place.
        fakeTimers: {
            toFake: [
                "setTimeout",
                "clearTimeout",
                "setInterval",
                "clearInterval",
                "Date",
            ],
        },
        environmentOptions: {
            jsdom: {
                url: "http://localhost",
            },
        },
    },
});
