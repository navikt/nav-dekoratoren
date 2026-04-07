import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import postcss from "postcss";
import { cssModulesScopedNameOption } from "decorator-shared/css-modules-config";
import { logger } from "decorator-shared/logger";

const require = createRequire(import.meta.url);

export async function getPostcssTokens(path: string) {
    try {
        const postcssModules = require("postcss-modules");
        const postcssImport = require("postcss-import");
        const val = await postcss([
            postcssModules({
                getJSON: () => {},
                ...cssModulesScopedNameOption,
            }),
            postcssImport,
        ]).process(readFileSync(path, "utf-8"), { from: path });

        return val.messages.find(
            ({ type, plugin }) =>
                type === "export" && plugin === "postcss-modules",
        )?.exportTokens;
    } catch (e) {
        logger.error(`Error processing CSS modules for ${path}`, { error: e });
    }
}
