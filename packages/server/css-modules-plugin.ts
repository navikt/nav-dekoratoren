import { plugin } from "bun";
import postcss from "postcss";
import { cssModulesScopedNameOption } from "decorator-shared/css-modules-config";
import { logger } from "decorator-shared/logger";

export async function getPostcssTokens(path: string) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const postcssModules = require("postcss-modules");
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const postcssImport = require("postcss-import");
        const val = await postcss([
            postcssModules({
                getJSON: () => {},
                ...cssModulesScopedNameOption,
            }),
            postcssImport,
        ]).process(await Bun.file(path).text(), { from: path });

        return val.messages.find(
            ({ type, plugin }) =>
                type === "export" && plugin === "postcss-modules",
        )?.exportTokens;
    } catch (e) {
        logger.error("Error processing CSS modules for ${path}", { error: e });
    }
}

plugin({
    name: "css-modules",
    setup(build) {
        build.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
            return {
                exports: {
                    default: await getPostcssTokens(path),
                },
                loader: "object",
            };
        });
    },
});
