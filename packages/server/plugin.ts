import { plugin } from 'bun';
import fs from 'fs';
import postcss from 'postcss';

plugin({
  name: 'css-modules',
  setup(build) {
    fs.unlinkSync('./public/styles.css');

    build.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
      const val = await postcss([
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('postcss-modules')({
          getJSON: () => {},
        }),
      ]).process(fs.readFileSync(path, 'utf8'), { from: path });

      fs.appendFileSync('./public/styles.css', val.css);

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
