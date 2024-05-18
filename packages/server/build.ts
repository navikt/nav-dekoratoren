import { BunPlugin } from "bun";
import { getPostcssTokens } from "./css-modules-plugin";
import { minify } from "esbuild-minify-templates";

const cssModulesPlugin: BunPlugin = {
    name: "css-modules",
    setup(build) {
        build.onLoad({ filter: /\.module.*\.css$/ }, async ({ path }) => {
            return {
                loader: "json",
                contents: JSON.stringify(await getPostcssTokens(path)),
            };
        });
    },
};

const result = await Bun.build({
    entrypoints: ["./src/server.ts"],
    target: "bun",
    outdir: "./dist",
    minify: false,
    plugins: [cssModulesPlugin],
});

const [output] = result.outputs;
console.log(`Build output: ${output}`);

if (output) {
    const text = await output.text();
    const minified = minify(text, {
        taggedOnly: true,
    }).toString();

    await Bun.write(Bun.file(output.path), minified);
}
