import { plugin } from 'bun';
import fs from 'fs';
import postcss from 'postcss';

plugin({
  name: 'css-modules',
  setup(build) {
    const dir = './public/assets';
    const fileName = `${dir}/styles.css`;

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fileName, '');

    build.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
      const val = await postcss([
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('postcss-modules')({
          getJSON: () => {},
        }),
      ]).process(fs.readFileSync(path, 'utf8'), { from: path });

      fs.appendFileSync(fileName, val.css);

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
