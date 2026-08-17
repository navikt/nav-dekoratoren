import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { INGRESS_PATH_PREFIXES } from "./routes";

// The nais ingresses and the prefixes we mount the app on must be kept in sync
// manually - the image is built once and deployed to every environment, so the
// prefixes can't be derived from the config at build time. This test fails if
// the two drift apart.
const VARS_DIR = "../../.nais/vars";

// The ingresses are a flat list of urls under an "ingresses:" key. Parsed by
// hand to avoid pulling in a yaml dependency for a single test.
const parseIngresses = (yaml: string) => {
    const lines = yaml.split("\n");
    const start = lines.findIndex((line) => line.trimEnd() === "ingresses:");

    if (start === -1) {
        return [];
    }

    const urls: string[] = [];

    for (const line of lines.slice(start + 1)) {
        const match = line.match(/^\s+-\s+(\S+)\s*$/);
        if (!match) {
            break;
        }
        urls.push(match[1]);
    }

    return urls;
};

// "/" is always mounted (health probes and the internal version apps are served
// from the root), so it is never expected to show up as an ingress path.
const normalizePath = (url: string) =>
    new URL(url).pathname.replace(/\/+$/, "");

const varsFiles = readdirSync(VARS_DIR).filter((file) => file.endsWith(".yml"));

const ingressPathsByFile = varsFiles.map(
    (file) =>
        [
            file,
            parseIngresses(readFileSync(`${VARS_DIR}/${file}`, "utf-8"))
                .map(normalizePath)
                .filter(Boolean),
        ] as const,
);

describe("ingress path prefixes", () => {
    test("vars files were found and parsed", () => {
        expect(varsFiles.length).toBeGreaterThan(0);
        expect(
            ingressPathsByFile.flatMap(([, paths]) => paths).length,
        ).toBeGreaterThan(0);
    });

    test.each(ingressPathsByFile)(
        "every ingress path in %s is mounted",
        (file, paths) => {
            const missing = paths.filter(
                (path) =>
                    !(INGRESS_PATH_PREFIXES as readonly string[]).includes(
                        path,
                    ),
            );

            expect(
                missing,
                `Ingress path(s) in .nais/vars/${file} are not mounted by the server. Add them to INGRESS_PATH_PREFIXES in routes.ts: ${missing.join(", ")}`,
            ).toEqual([]);
        },
    );

    test("every mounted prefix is used by an ingress", () => {
        const ingressPaths = new Set(
            ingressPathsByFile.flatMap(([, paths]) => paths),
        );

        const unused = INGRESS_PATH_PREFIXES.filter(
            (prefix) => prefix !== "/" && !ingressPaths.has(prefix),
        );

        expect(
            unused,
            `INGRESS_PATH_PREFIXES in routes.ts contains prefixes without a matching ingress in .nais/vars: ${unused.join(", ")}`,
        ).toEqual([]);
    });
});
