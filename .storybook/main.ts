import type { StorybookConfig } from '@storybook/html-vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

const config: StorybookConfig = {
	stories: ['../packages/**/*.stories.ts'],
	addons: ['@storybook/addon-docs'],
	framework: {
		name: '@storybook/html-vite',
		options: {},
	},
	core: {
		disableTelemetry: true,
	},
	viteFinal: (config) => ({
		...config,
		define: { 'process.env': {} },
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve?.alias,
				'@navikt/navno-logger': path.join(repoRoot, '.storybook/navno-logger-stub.ts'),
				'decorator-client': path.join(repoRoot, 'packages/client'),
				'decorator-shared': path.join(repoRoot, 'packages/shared'),
				'decorator-server': path.join(repoRoot, 'packages/server'),
			},
		},
	}),
};
export default config;
