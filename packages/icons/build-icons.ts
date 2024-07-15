import * as prettier from "prettier";
import metadata from "@navikt/aksel-icons/metadata";
import { optimize } from "svgo";
import { Glob } from "bun";

const glob = new Glob("./src/*.svg");

const files = [];
for await (const path of glob.scan(".")) {
    files.push({ name: /([^/]+)\.svg$/.exec(path)?.[1] ?? "wat", path });
}
const jsString =
    '${htmlAttributes({ ariaHidden: ariaLabel ? "false" : "true", ...props })} ${ariaLabel ? html`aria-label="${ariaLabel}"` : ""}';

const fileTemplate = ({ svg, name }: { svg: string; name: string }) => `
import html, { htmlAttributes } from "decorator-shared/html";
import type { IconProps } from "./types";

export const ${name}Icon = ({ ariaLabel, ...props}: IconProps = {}) => html\`
${svg}
\`;
`;

[
    ...Object.keys(metadata).map((name) => ({
        name,
        path: `@navikt/aksel-icons/svg/${name}.svg`,
    })),
    ...files,
].forEach(async ({ name, path }) => {
    const iconPath = (await import(path)).default;
    const icon = await Bun.file(iconPath).text();
    const result = optimize(icon, {
        path: iconPath,
        plugins: [
            "preset-default",
            {
                name: "addAttributesToSVGElement",
                params: {
                    attribute: {
                        focusable: "false",
                        role: "img",
                    },
                },
            },
        ],
    });

    const optimizedSvgString = result.data;

    Bun.write(
        `./dist/${name}.ts`,
        await prettier.format(
            fileTemplate({
                svg: optimizedSvgString.replace("<svg", `<svg ${jsString}`),
                name,
            }),
            { filepath: `${name}.ts` },
        ),
    );
});

Bun.write(
    "./dist/index.ts",
    `
export * from '../src';
${[...Object.keys(metadata), ...files.map(({ name }) => name)]
    .map((name) => `export * from "./${name}";`)
    .join("\n")}
`,
);

const file = Bun.file("./src/types.ts");
await Bun.write("./dist/types.ts", file);
