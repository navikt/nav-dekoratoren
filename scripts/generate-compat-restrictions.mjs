/**
 * Generates the `no-restricted-properties` denylist used by eslint.config.mjs.
 *
 * WHY THIS EXISTS
 * ---------------
 * Our browser-compat guard has three layers:
 *
 *   1. Vite build target  -> guards SYNTAX (derived from browserslist)
 *   2. TypeScript `lib`   -> guards ES BUILT-INS (Object.groupBy, Array#toSorted, ...)
 *   3. eslint-plugin-compat -> guards WEB APIs
 *
 * Layer 3 has a systematic hole: its dataset (ast-metadata-inferer) does not
 * emit AST nodes for *static* members. MDN's browser-compat-data names those
 * with a `_static` suffix (`AbortSignal.timeout_static`, `URL.canParse_static`)
 * and the inferer skips them entirely. The practical result is that
 * `AbortSignal.timeout()` -- Safari 16, i.e. above our floor -- is not reported
 * by any of the three layers.
 *
 * This script closes that hole by reading browser-compat-data directly and
 * emitting a plain `no-restricted-properties` list for every static member that
 * our browserslist floor does not support.
 *
 * The output is COMMITTED on purpose: it keeps lint fast (no 15MB JSON parse per
 * run) and, more importantly, makes floor changes reviewable -- raising or
 * lowering the floor shows up as an explicit diff of which APIs became legal.
 *
 * Regenerate with:  pnpm run generate:compat
 * Run this whenever the "browserslist" key changes or BCD is upgraded.
 */

import bcd from "@mdn/browser-compat-data" with { type: "json" };
import browserslist from "browserslist";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT_PATH = fileURLToPath(
    new URL("../eslint-compat-restrictions.generated.mjs", import.meta.url),
);

/**
 * browserslist target id -> BCD browser id.
 * Only browsers we actually care about enforcing; anything else in the
 * browserslist result is ignored.
 */
const BROWSERSLIST_TO_BCD = {
    safari: "safari",
    ios_saf: "safari_ios",
    chrome: "chrome",
    edge: "edge",
    firefox: "firefox",
    and_chr: "chrome_android",
    and_ff: "firefox_android",
    samsung: "samsunginternet_android",
};

/** Compute the minimum supported version per BCD browser id from browserslist. */
const getFloor = () => {
    const floor = {};
    for (const entry of browserslist()) {
        const [name, rawVersion] = entry.split(" ");
        const bcdName = BROWSERSLIST_TO_BCD[name];
        if (!bcdName) continue;
        // Ranges like "15.6-15.8" -> take the lower bound.
        const version = parseFloat(rawVersion.split("-")[0]);
        if (Number.isNaN(version)) continue;
        if (floor[bcdName] === undefined || version < floor[bcdName]) {
            floor[bcdName] = version;
        }
    }
    return floor;
};

/**
 * BCD support entries may be a single object or an array of historical ranges.
 * Take the earliest still-current "version_added".
 */
const firstVersionAdded = (support) => {
    if (!support) return undefined;
    if (!Array.isArray(support)) return support.version_added;
    const current = support.find((e) => e.version_added && !e.version_removed);
    return (current ?? support[0])?.version_added;
};

/**
 * Returns the list of floor browsers that do NOT support this API,
 * or an empty array if every floor browser supports it.
 */
const findUnsupportedBrowsers = (support, floor) => {
    const unsupported = [];
    for (const [bcdName, minVersion] of Object.entries(floor)) {
        const versionAdded = firstVersionAdded(support[bcdName]);
        // Explicitly never supported.
        if (versionAdded === false) {
            unsupported.push(bcdName);
            continue;
        }
        // No data at all -> treat as unsupported rather than silently allowing.
        if (versionAdded === undefined || versionAdded === null) {
            unsupported.push(bcdName);
            continue;
        }
        // `true` means "supported, version unknown" -> assume ancient, allow.
        if (versionAdded === true) continue;
        const added = parseFloat(String(versionAdded).replace(/^≤/, ""));
        if (Number.isNaN(added)) continue;
        if (added > minVersion) unsupported.push(`${bcdName} ${versionAdded}`);
    }
    return unsupported;
};

const floor = getFloor();

const restrictions = [];
for (const [interfaceName, members] of Object.entries(bcd.api)) {
    for (const [memberName, node] of Object.entries(members)) {
        if (!memberName.endsWith("_static")) continue;
        const support = node?.__compat?.support;
        if (!support) continue;

        const unsupported = findUnsupportedBrowsers(support, floor);
        if (unsupported.length === 0) continue;

        restrictions.push({
            object: interfaceName,
            property: memberName.replace(/_static$/, ""),
            unsupported,
        });
    }
}

restrictions.sort(
    (a, b) =>
        a.object.localeCompare(b.object) ||
        a.property.localeCompare(b.property),
);

const floorSummary = Object.entries(floor)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, version]) => `${name} ${version}`)
    .join(", ");

const body = restrictions
    .map(
        ({ object, property, unsupported }) =>
            `    {\n` +
            `        object: ${JSON.stringify(object)},\n` +
            `        property: ${JSON.stringify(property)},\n` +
            `        message:\n` +
            `            ${JSON.stringify(
                `${object}.${property} is above our browser floor (needs: ${unsupported.join(", ")}). See CONTRIBUTING.md.`,
            )},\n` +
            `    },`,
    )
    .join("\n");

const output = `/**
 * GENERATED FILE -- DO NOT EDIT BY HAND.
 *
 * Regenerate with: pnpm run generate:compat
 * Source: scripts/generate-compat-restrictions.mjs
 *
 * Static Web API members that our supported browser floor does not implement.
 * These are invisible to eslint-plugin-compat, whose dataset omits static
 * members. See the script header for the full explanation.
 *
 * Browser floor at generation time: ${floorSummary}
 * @mdn/browser-compat-data: ${bcd.__meta.version}
 */

/** @type {Array<{ object: string, property: string, message: string }>} */
export const compatRestrictedProperties = [
${body}
];
`;

writeFileSync(OUT_PATH, output);

console.log(
    `Wrote ${restrictions.length} restricted static members to ${OUT_PATH}\n` +
        `Browser floor: ${floorSummary}`,
);
