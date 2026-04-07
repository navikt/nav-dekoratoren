import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import * as prettier from "prettier";
import metadata from "@navikt/aksel-icons/metadata";
import { optimize } from "svgo";
import { glob } from "glob";

mkdirSync("./dist", { recursive: true });

const svgFiles = await glob("./src/*.svg");

const files = svgFiles.map((filePath) => {
    // Prevent build errors on windows file systems
    const unixPath = filePath.replaceAll("\\", "/");
    return {
        name: /([^/]+)\.svg$/.exec(unixPath)?.[1] ?? "wat",
        path: unixPath,
    };
});
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
    const iconPath = path.startsWith("@")
        ? new URL(import.meta.resolve(path)).pathname
        : path;
    const icon = readFileSync(iconPath, "utf-8");
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

    writeFileSync(
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

writeFileSync(
    "./dist/index.ts",
    `
export * from '../src';
${[...Object.keys(metadata), ...files.map(({ name }) => name)]
    .map((name) => `export * from "./${name}";`)
    .join("\n")}
`,
);

writeFileSync("./dist/types.ts", readFileSync("./src/types.ts", "utf-8"));
