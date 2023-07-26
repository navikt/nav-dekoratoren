import { defineConfig } from "vite";

export default defineConfig({
  server: {
    origin: "http://localhost:5173",
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: "client/main.ts",
    },
  },
});
