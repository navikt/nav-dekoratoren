import postcss from 'postcss';
import fs from 'fs';
import path from 'path';

const FILE_NAME = 'packages/client/css-modules.d.ts';
import * as ts from 'typescript';

async function process(path: string) {
  const val = await postcss([
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('postcss-modules')({
      getJSON: () => {},
    }),
  ]).process(await Bun.file(path).text(), { from: path });

  const tokens = val.messages.find(
    ({ type, plugin }) => type === 'export' && plugin === 'postcss-modules',
  )?.exportTokens;

  return {
    path: path.split('/').pop(),
    tokens,
  };
}

const root = path.resolve(__dirname, './src/styles');
const paths = fs
  .readdirSync(root)
  .filter((path) => path.endsWith('.module.css'));

const modules: ts.ModuleDeclaration[] = [];

for (const filePath of paths) {
  const result = await process(path.resolve(root, filePath));
  const tokenProperties = Object.keys(result.tokens).map((token) =>
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
          'classes',
          undefined,
          classes,
          undefined,
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );

  const exportClassesStatement = ts.factory.createExportDefault(
    ts.factory.createIdentifier('classes'),
  );

  const tsModule = ts.factory.createModuleDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
    ts.factory.createStringLiteral(`*${result.path}`),
    ts.factory.createModuleBlock([classesDeclaration, exportClassesStatement]),
  );

  modules.push(tsModule);
}

const printer = ts.createPrinter();
const sourceFile = ts.createSourceFile(FILE_NAME, '', ts.ScriptTarget.ES2015);

const output = modules
  .map((mod) => printer.printNode(ts.EmitHint.Unspecified, mod, sourceFile))
  .join('\n\n');

Bun.write(FILE_NAME, output);
