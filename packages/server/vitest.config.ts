import { defineConfig } from "vitest/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function parseEnvFile(path: string): Record<string, string> {
    return Object.fromEntries(
        readFileSync(path, "utf-8")
            .split("\n")
            .filter((line) => line.trim() && !line.startsWith("#"))
            .map((line) => {
                const idx = line.indexOf("=");
                return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
            }),
    );
}

const clientRoot = fileURLToPath(new URL("../client", import.meta.url));
const loggerMock = fileURLToPath(
    new URL("../shared/test/logger-mock.ts", import.meta.url),
);

export default defineConfig({
    resolve: {
        alias: {
            "decorator-client": clientRoot,
            "decorator-shared/logger": loggerMock,
        },
    },
    test: {
        env: parseEnvFile("./.env.sample"),
    },
});
