import { BunPlugin } from 'bun';
import { getPostcssTokens } from './css-modules-plugin';

const cssModulesPlugin: BunPlugin = {
  name: 'css-modules',
  setup(build) {
    build.onLoad({ filter: /\.module.*\.css$/ }, async ({ path }) => {
      return {
        loader: 'json',
        contents: JSON.stringify(
            await getPostcssTokens(path)
        ),
      };
    });
  },
};

await Bun.build({
  entrypoints: ['./src/server.ts'],
  target: 'bun', // bun
  outdir: './output',
  plugins: [cssModulesPlugin],
});
