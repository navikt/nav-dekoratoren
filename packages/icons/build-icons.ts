import { createHash } from "node:crypto";
import {
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { writeFile } from "node:fs/promises";
import { enableCompileCache } from "node:module";
import { fileURLToPath } from "node:url";

// Cache V8 compilation of the svgo module graph, which is imported lazily below.
enableCompileCache();

const DIST = "./dist";
const SRC = "./src";
const MANIFEST_FILE = ".build-manifest.json";

const readUtf8 = (path: string) => readFileSync(path, "utf-8");

const localSvgNames = readdirSync(SRC)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.slice(0, -4))
    .sort();

/**
 * Content hash of everything that can change the generated output. Computed
 * before svgo and the icon metadata are imported, so an up-to-date `dist`
 * costs nothing beyond process startup.
 */
const inputHash = () => {
    const akselPackage = fileURLToPath(
        import.meta.resolve("@navikt/aksel-icons/package.json"),
    );
    const hash = createHash("sha256");
    hash.update(JSON.parse(readUtf8(akselPackage)).version);
    hash.update(readUtf8("./package.json"));
    hash.update(readUtf8(fileURLToPath(import.meta.url)));
    hash.update(readUtf8(`${SRC}/types.ts`));
    for (const name of localSvgNames) {
        hash.update(name);
        hash.update(readUtf8(`${SRC}/${name}.svg`));
    }
    return hash.digest("hex");
};

const expectedHash = inputHash();

const isUpToDate = () => {
    try {
        const manifest = JSON.parse(readUtf8(`${DIST}/${MANIFEST_FILE}`));
        return (
            manifest.hash === expectedHash &&
            manifest.fileCount === readdirSync(DIST).length
        );
    } catch {
        return false;
    }
};

if (isUpToDate()) {
    process.exit(0);
}

const [{ optimize }, { default: metadata }] = await Promise.all([
    import("svgo"),
    import("@navikt/aksel-icons/metadata"),
]);

const akselNames = Object.keys(metadata);

// Resolve the aksel svg directory once rather than once per icon.
const akselSvgDir = fileURLToPath(
    new URL(
        ".",
        import.meta.resolve(`@navikt/aksel-icons/svg/${akselNames[0]}.svg`),
    ),
);

const icons = [
    ...akselNames.map((name) => ({ name, path: `${akselSvgDir}${name}.svg` })),
    ...localSvgNames.map((name) => ({ name, path: `${SRC}/${name}.svg` })),
];

const svgoConfig = {
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
    // Pretty-printing costs nothing measurable here and keeps the generated
    // files readable without running a JS formatter over them.
    js2svg: { pretty: true, indent: 2 },
};

const jsString =
    '${htmlAttributes({ ariaHidden: ariaLabel ? "false" : "true", ...props })} ${ariaLabel ? html`aria-label="${ariaLabel}"` : ""}';

const fileTemplate = ({ svg, name }: { svg: string; name: string }) =>
    `import html, { htmlAttributes } from "decorator-shared/html";
import type { IconProps } from "./types";

export const ${name}Icon = ({ ariaLabel, ...props }: IconProps = {}) => html\`
${svg}\`;
`;

mkdirSync(DIST, { recursive: true });

const generated = icons.map(({ name, path }) => {
    const { data } = optimize(readUtf8(path), svgoConfig);
    return {
        file: `${name}.ts`,
        contents: fileTemplate({
            svg: data.replace("<svg", `<svg ${jsString}`),
            name,
        }),
    };
});

generated.push(
    {
        file: "index.ts",
        contents: `export * from "../src";\n${icons
            .map(({ name }) => `export * from "./${name}";`)
            .join("\n")}\n`,
    },
    { file: "types.ts", contents: readUtf8(`${SRC}/types.ts`) },
);

await Promise.all(
    generated.map(({ file, contents }) =>
        writeFile(`${DIST}/${file}`, contents),
    ),
);

// Drop files left behind by earlier builds, e.g. icons removed upstream.
const expectedFiles = new Set([
    ...generated.map(({ file }) => file),
    MANIFEST_FILE,
]);
for (const file of readdirSync(DIST)) {
    if (!expectedFiles.has(file)) {
        rmSync(`${DIST}/${file}`, { recursive: true, force: true });
    }
}

writeFileSync(
    `${DIST}/${MANIFEST_FILE}`,
    JSON.stringify({ hash: expectedHash, fileCount: generated.length + 1 }),
);
