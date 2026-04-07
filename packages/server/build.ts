import { build, type Plugin } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";

import { resolve } from "node:path";
import { getPostcssTokens } from "./css-modules-plugin";
import { minify } from "esbuild-minify-templates";
import { logger } from "decorator-shared/logger";

const cssModulesPlugin: Plugin = {
    name: "css-modules",
    setup(build) {
        build.onLoad(
            { filter: /\.module.*\.css$/ },
            async ({ path: filePath }) => {
                return {
                    loader: "json",
                    contents: JSON.stringify(await getPostcssTokens(filePath)),
                };
            },
        );
    },
};

const result = await build({
    entryPoints: ["./src/server.ts"],
    target: "node24",
    platform: "node",
    outdir: "./dist",
    bundle: true,
    packages: "external",
    minify: false,
    format: "esm",
    plugins: [cssModulesPlugin],
    metafile: true,
    alias: {
        "decorator-client": resolve("../client"),
    },
});

const outFile = Object.keys(result.metafile!.outputs)[0];
const outPath = resolve(outFile);
logger.info(`Build output: ${outFile}`);

const text = readFileSync(outPath, "utf-8");
const minified = minify(text, {
    taggedOnly: true,
}).toString();

writeFileSync(outPath, minified);
