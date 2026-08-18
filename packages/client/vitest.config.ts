import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const serverRoot = fileURLToPath(new URL("../server", import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            "decorator-server": serverRoot,
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
