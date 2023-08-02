import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths'
import minifyLiterals from 'rollup-plugin-minify-html-literals-v3';

export default defineConfig({
  plugins: [tsconfigPaths()],
  server: {
    origin: "http://localhost:5173",
  },
  build: {
    manifest: true,
    rollupOptions: {
        plugins: [
            minifyLiterals()
        ],
        input: {
            main: 'client/main.ts',
        },
    },
  },
});
