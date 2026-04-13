import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Mirror the logic in decorator-shared/css-modules-config.ts
const generateScopedName =
    process.env.NODE_ENV === "development" ? "[name]__[local]" : undefined;

export async function load(url, context, nextLoad) {
    if (!url.endsWith(".module.css")) {
        return nextLoad(url, context);
    }

    const filePath = fileURLToPath(url);
    const css = readFileSync(filePath, "utf-8");

    const postcss = require("postcss");
    const postcssModules = require("postcss-modules");
    const postcssImport = require("postcss-import");

    let classNames = {};
    await postcss([
        postcssImport,
        postcssModules({
            getJSON: (_, json) => {
                classNames = json;
            },
            ...(generateScopedName ? { generateScopedName } : {}),
        }),
    ]).process(css, { from: filePath });

    return {
        format: "module",
        shortCircuit: true,
        source: `export default ${JSON.stringify(classNames)};`,
    };
}
