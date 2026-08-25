import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // `isValidNavUrl` reads APP_URL to decide whether localhost targets are
        // acceptable. Default the suite to the local dev value from
        // `packages/server/.env.sample`; tests that care stub it themselves.
        env: { APP_URL: "http://localhost:8089" },
    },
});
