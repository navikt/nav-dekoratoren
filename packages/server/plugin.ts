import { plugin } from 'bun';

plugin({
  name: 'css-modules',
  setup(build) {
    build.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
      const name = path.match(/([^/]+?)$/)?.at(1);
      if (!name) {
        return {
          exports: {},
          loader: 'object',
        };
      }

      return {
        exports: await import(`decorator-client/build/${name}.json`),
        loader: 'object',
      };
    });
  },
});
