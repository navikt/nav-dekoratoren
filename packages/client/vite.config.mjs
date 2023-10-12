import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import minifyLiterals from 'rollup-plugin-minify-html-literals-v3';
import path from 'path';
import { partytownRollup } from '@builder.io/partytown/utils';
import { typedCssModulesPlugin } from './typesafe-css-modules';

export default defineConfig({
  plugins: [tsconfigPaths(), typedCssModulesPlugin()],
  server: {
    origin: 'http://localhost:5173',
  },
  logLevel: 'info',
  build: {
    minify: false,
    manifest: true,
    rollupOptions: {
      plugins: [
        minifyLiterals(),
        partytownRollup({
          dest: path.join(__dirname, 'dist', '~partytown'),
        }),
      ],
      treeshake: 'smallest',
      input: ['src/main.ts', 'src/analytics/analytics.ts'],
    },
  },
});
