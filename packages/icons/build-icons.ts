import * as prettier from "prettier";
import metadata from "@navikt/aksel-icons/metadata";
import { optimize } from "svgo";

const jsString =
    'focusable="false" role="img" ${htmlAttributes({ ariaHidden: ariaLabel ? "false" : "true", ...props, })} ${ariaLabel && html`aria-label="${ariaLabel}"`}';

const fileTemplate = ({ svg, name }: { svg: string; name: string }) => `
import html, { htmlAttributes } from "decorator-shared/html";
import type { IconProps } from "./types";

export const ${name}Icon = ({ ariaLabel, ...props }: IconProps = {}) => html\`
${svg}
\`;
`;

Object.keys(metadata).forEach(async (name) => {
    const iconPath = (await import(`@navikt/aksel-icons/svg/${name}.svg`))
        .default;
    const icon = await Bun.file(iconPath).text();
    const result = optimize(icon, { path: iconPath });

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
${Object.keys(metadata)
    .map((name) => `export * from "./${name}";`)
    .join("\n")}
`,
);
