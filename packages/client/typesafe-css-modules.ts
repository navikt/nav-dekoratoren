import postcss from "postcss";
import fs from "fs";
import path from "path";
import ts from "typescript";
import { HmrContext } from "vite";
import * as prettier from "prettier";
import postcssModules from "postcss-modules";
import prettierConfig from "../../.prettierrc.json";

// Directoryes to write file to
const targets = ["./", "../server/", "../shared/"];

const FILE_NAME = "./css-modules.d.ts";

async function processFile(path: string) {
    const file = fs.readFileSync(path, "utf-8");
    const val = await postcss([
        postcssModules({
            getJSON: () => {},
        }),
    ]).process(file.toString(), { from: path });

    const tokens = val.messages.find(
        ({ type, plugin }) => type === "export" && plugin === "postcss-modules",
    )?.exportTokens;

    return {
        path: path.split("/").pop(),
        tokens,
    };
}

type ProcessedFile = Awaited<ReturnType<typeof processFile>>;

function createTSModule(file: ProcessedFile) {
    const tokenProperties = Object.keys(file.tokens).map((token) =>
        ts.factory.createPropertySignature(
            undefined,
            token,
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ),
    );

    const classes = ts.factory.createTypeLiteralNode(tokenProperties);
    const classesDeclaration = ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
            [
                ts.factory.createVariableDeclaration(
                    "classes",
                    undefined,
                    classes,
                    undefined,
                ),
            ],
            ts.NodeFlags.Const,
        ),
    );

    const exportClassesStatement = ts.factory.createExportDefault(
        ts.factory.createIdentifier("classes"),
    );

    return ts.factory.createModuleDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
        ts.factory.createStringLiteral(`*/${file.path}`),
        ts.factory.createModuleBlock([
            classesDeclaration,
            exportClassesStatement,
        ]),
    );
}

async function createOutput(modules: ts.ModuleDeclaration[]) {
    const printer = ts.createPrinter();
    const sourceFile = ts.createSourceFile(
        FILE_NAME,
        "",
        ts.ScriptTarget.ES2015,
    );

    const output = modules
        .map((mod) =>
            printer.printNode(ts.EmitHint.Unspecified, mod, sourceFile),
        )
        .join("\n\n");

    return await prettier.format(output, {
        ...prettierConfig,
        trailingComma: "es5",
        parser: "typescript",
    });
}

const getFilePaths = (dir: string): string[] =>
    fs.readdirSync(dir).flatMap((name) => {
        const file = `${dir}/${name}`;
        return fs.lstatSync(file).isDirectory() ? getFilePaths(file) : file;
    });

export async function processAll() {
    const paths = getFilePaths(path.resolve(__dirname, "..")).filter((path) =>
        path.endsWith(".module.css"),
    );

    const processedFiles = await Promise.all(
        paths.map(async (f) => await processFile(f)),
    );
    const modules: ts.ModuleDeclaration[] = processedFiles.map(createTSModule);
    const output = await createOutput(modules);

    for (const target of targets) {
        fs.writeFileSync(path.resolve(target, FILE_NAME), output);
    }
}

// @NOTE: Can be made more efficient by only processing the file that changed and checking the source file. Perf gains not worth it for now.
export const typedCssModulesPlugin = () => {
    // let config: ResolvedConfig

    return {
        name: "typed-css-modules",
        configResolved() {
            //resolvedConfig: ResolvedConfig
            // config = resolvedConfig
            processAll();
        },
        handleHotUpdate(context: HmrContext) {
            const { file } = context;
            if (file.includes("module.css")) {
                processAll();
            }
        },
    };
};
