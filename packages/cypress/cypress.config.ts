import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: false,
    screenshotsFolder: false,
    baseUrl: process.env.IS_OLD
      ? 'http://localhost:8088'
      : 'http://localhost:8089',
  },
});
