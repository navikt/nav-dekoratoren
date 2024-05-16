import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
    stories: ["../packages/**/*.stories.ts"],
    addons: ["@storybook/addon-essentials", "@storybook/addon-viewport"],
    framework: {
        name: "@storybook/html-vite",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    viteFinal: (config) => ({ ...config, define: { "process.env": {} } }),
};
export default config;
