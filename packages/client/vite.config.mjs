import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import minifyLiterals from 'rollup-plugin-minify-html-literals-v3';
import path from 'path';
import { partytownRollup } from '@builder.io/partytown/utils';
import { typedCssModulesPlugin } from './typesafe-css-modules';

export const mainBundleConfig = defineConfig({
    plugins: [tsconfigPaths(), typedCssModulesPlugin()],
    server: {
        origin: 'http://localhost:5173',
    },
    logLevel: 'info',
    build: {
        minify: true,
        target: 'es2015',
        manifest: true,
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
            plugins: [
                minifyLiterals(),
                partytownRollup({
                    dest: path.join(__dirname, 'dist', '~partytown'),
                }),
            ],
            // inlineDynamic imports works for main, but not when multiple inputs are defined. Need to fix it.
            // ''
            input: ['src/main.ts'],
        },
    },
});


export const lazyConfig = defineConfig({
    build: {
        emptyOutDir: false,
        minify: true,
        manifest: 'analytics.manifest.json',
        rollupOptions: {
            input: ['src/analytics/analytics.ts'],
        },
    },
});


export default defineConfig(({ mode }) => {
    if (mode === 'development') {
        return mainBundleConfig;
    }
    // Build steps
    if (mode === 'main') return mainBundleConfig;
    if (mode === 'lazy') return lazyConfig;

    return mainBundleConfig;
})
