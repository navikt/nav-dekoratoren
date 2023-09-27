import { plugin } from 'bun';
import postcss from 'postcss';

plugin({
  name: 'css-modules',
  setup(build) {
    build.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
      const val = await postcss([
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('postcss-modules')({
          getJSON: () => {},
        }),
      ]).process(await Bun.file(path).text(), { from: path });

      return {
        exports: {
          default: val.messages.find(
            ({ type, plugin }) =>
              type === 'export' && plugin === 'postcss-modules',
          )?.exportTokens,
        },
        loader: 'object',
      };
    });
  },
});
