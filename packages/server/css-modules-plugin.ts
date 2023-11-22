import { plugin } from 'bun';

export async function getPostcssTokens(path: string) {
    const name = path.split("/").pop()?.replace(".css", "");
    const jsonFile = `${__dirname}/styles/${name}.json`;
    const text = await Bun.file(jsonFile).text();
    return JSON.parse(text);
}

plugin({
  name: 'css-modules',
  setup(build) {
    build.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
      return {
          exports: {
              default: await getPostcssTokens(path)
          },
        loader: 'object',
      };
    });
  },
});
