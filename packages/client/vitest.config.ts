import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const serverRoot = fileURLToPath(new URL("../server", import.meta.url));
const loggerMock = fileURLToPath(
    new URL("../shared/test/logger-mock.ts", import.meta.url),
);

export default defineConfig({
    resolve: {
        alias: {
            "decorator-server": serverRoot,
            "decorator-shared/logger": loggerMock,
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
    },
});
