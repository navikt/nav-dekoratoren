import { BunPlugin } from 'bun';
import postcss from 'postcss';

const cssModulesPlugin: BunPlugin = {
  name: 'css-modules',
  setup(build) {
    build.onLoad({ filter: /\.module.*\.css$/ }, async ({ path }) => {
      const val = await postcss([
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('postcss-modules')({
          getJSON: () => {},
        }),
      ]).process(await Bun.file(path).text(), { from: path });

      return {
        loader: 'json',
        contents: JSON.stringify(
          val.messages.find(
            ({ type, plugin }) =>
              type === 'export' && plugin === 'postcss-modules',
          )?.exportTokens,
        ),
      };
    });
  },
};

const res = await Bun.build({
  entrypoints: ['./src/server.ts'],
  target: 'bun',
  outdir: './dist',
  plugins: [cssModulesPlugin],
});

console.log(res);
