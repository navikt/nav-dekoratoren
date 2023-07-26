import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.IS_OLD ? "https://nav.no" : "http://localhost:3001",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
