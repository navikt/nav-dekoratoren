import { plugin } from "bun";
import postcss from "postcss";
import { cssModulesScopedNameOption } from "decorator-shared/css-modules-config";
import { logger } from "decorator-shared/logger";

export async function getPostcssTokens(path: string) {
    try {
        const val = await postcss([
            require("postcss-modules")({
                getJSON: () => {},
                ...cssModulesScopedNameOption,
            }),
            require("postcss-import"),
        ]).process(await Bun.file(path).text(), { from: path });

        return val.messages.find(
            ({ type, plugin }) =>
                type === "export" && plugin === "postcss-modules",
        )?.exportTokens;
    } catch (e) {
        logger.error(`Error processing CSS modules for ${path} - ${e}`);
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
