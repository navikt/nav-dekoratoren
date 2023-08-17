import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import minifyLiterals from 'rollup-plugin-minify-html-literals-v3';

export default defineConfig({
  plugins: [
      tsconfigPaths(),
  ]
    ,
  server: {
    origin: 'http://localhost:5173',
  },
  build: {
      minify: false,

    manifest: true,
    rollupOptions: {
      plugins: [minifyLiterals()],
      treeshake: {
        manualPureFunctions: ['html'],
      },
      // Add tsconfig
      input: 'client/main.ts',
    },
  },
});
