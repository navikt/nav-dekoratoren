import { readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { app } from "./routes";

const [staticAsset] = readdirSync("../client/dist/assets");

// "" is the root mount, used by the internal version apps.
const PREFIXES = ["", "/dekoratoren", "/common-html/v4/navno"];

const OK_PATHS = [
    "/",
    "/metrics",
    "/api/isAlive",
    "/api/isReady",
    "/api/version",
    "/api/csp",
    "/ops-messages",
    "/header",
    "/footer",
    "/main-menu",
    "/ssr",
    "/env",
    "/csr",
    "/auth",
];

const requestsTotalFor = async (route: string) => {
    const body = await (await app.request("/metrics")).text();
    const line = body
        .split("\n")
        .find(
            (it) =>
                it.startsWith("http_requests_total{") &&
                it.includes(`route="${route}"`),
        );

    return line ? Number(line.split(" ").at(-1)) : 0;
};

describe.each(PREFIXES)("prefix '%s'", (prefix) => {
    test.each(OK_PATHS)("%s returns 200", async (path) => {
        const response = await app.request(
            `${prefix}${path}?consumer=dekoratoren`,
        );

        expect(response.status).toBe(200);
    });

    test.each([
        "/client.abc123.js",
        "/csr/client.abc123.js",
        "/css/client.abc123.css",
        "/csr/css/client.abc123.css",
        // (.*) spans "/", so nested paths match too
        "/clientfoo/bar.js",
        "/csr/clientfoo/bar.js",
    ])("%s redirects", async (path) => {
        const response = await app.request(`${prefix}${path}`);

        expect(response.status).toBe(302);
    });

    test.each(["/notclient.abc.js", "/client.abc123.css"])(
        "%s does not match the client script routes",
        async (path) => {
            const response = await app.request(`${prefix}${path}`);

            expect(response.status).toBe(404);
        },
    );

    test("unknown route returns 404", async () => {
        const response = await app.request(`${prefix}/does-not-exist`);

        expect(response.status).toBe(404);
    });

    test("serves static assets", async () => {
        const response = await app.request(
            `${prefix}/public/assets/${staticAsset}`,
        );

        expect(response.status).toBe(200);
    });
});

test("serves the same static asset under every prefix", async () => {
    const bodies = await Promise.all(
        PREFIXES.map(async (prefix) =>
            (
                await app.request(`${prefix}/public/assets/${staticAsset}`)
            ).text(),
        ),
    );

    expect(new Set(bodies).size).toBe(1);
});

// Regression: the app used to be mounted onto itself, so both "*" and
// "/dekoratoren/*" matched and every global middleware ran twice.
test("counts each request once, also behind a prefix", async () => {
    const route = "/dekoratoren/api/isAlive";
    const before = await requestsTotalFor(route);

    await app.request(route);

    expect(await requestsTotalFor(route)).toBe(before + 1);
});

test("no double-prefixed routes", () => {
    const doublePrefixed = app.routes
        .map((route) => route.path)
        .filter((path) =>
            /\/(dekoratoren|common-html)\/.*\/(dekoratoren|common-html)\//.test(
                path,
            ),
        );

    expect(doublePrefixed).toEqual([]);
});

test("only global middleware is registered as catch-all", () => {
    const catchAll = app.routes.filter((route) => route.path === "/*");

    // headers, versionProxyHandler, registerMetrics - once each.
    expect(catchAll).toHaveLength(3);
});
