import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  server: {
    origin: "http://localhost:5173",
  },
  build: {

    manifest: true,
    rollupOptions: {
      // Add tsconfig
      input: "client/main.ts",
    },
  },
});
