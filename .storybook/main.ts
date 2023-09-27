import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [{ from: '../packages/server/public', to: '/public' }],
  viteFinal: (config) => ({ ...config, define: { 'process.env': {} } }),
};
export default config;
