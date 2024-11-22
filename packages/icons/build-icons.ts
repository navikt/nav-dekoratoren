import * as prettier from "prettier";
import metadata from "@navikt/aksel-icons/metadata";
import { optimize } from "svgo";
import * as fs from "fs";

const items = fs.readdirSync("./src");
const files = [];
for (const item of items) {
    if (item.endsWith(".svg")) {
        const filePath = `./src/${item}`;
        const unixPath = filePath.replaceAll("\\", "/");
        files.push({
            name: /([^/]+)\.svg$/.exec(unixPath)?.[1] ?? "wat",
            path: unixPath,
        });
    }
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
    const iconPath = require.resolve(path);
    const icon = fs.readFileSync(iconPath, "utf-8");
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

    fs.writeFileSync(
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

fs.mkdirSync("./dist", { recursive: true });
fs.writeFileSync(
    "./dist/index.ts",
    `
export * from '../src';
${[...Object.keys(metadata), ...files.map(({ name }) => name)]
    .map((name) => `export * from "./${name}";`)
    .join("\n")}
`,
);

fs.copyFileSync("./src/types.ts", "./dist/types.ts");
