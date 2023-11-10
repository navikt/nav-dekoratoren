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

const res = await Bun.build({
  entrypoints: ['./src/server.ts'],
  target: 'bun', // bun
  outdir: './dist',
  plugins: [cssModulesPlugin],
});

console.log(res);
