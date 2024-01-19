import { defineConfig } from 'vite';
import minifyLiterals from 'rollup-plugin-minify-html-literals-v3';
import path from 'path';
import { partytownRollup } from '@builder.io/partytown/utils';
import { typedCssModulesPlugin } from './typesafe-css-modules';

export const mainBundleConfig = defineConfig({
    plugins: [typedCssModulesPlugin()],
    server: {
        origin: 'http://localhost:5173',
    },
    logLevel: 'info',
    build: {
        minify: true,
        target: 'esnext',
        manifest: true,
        sourcemap: true,
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
                // @TODO: Burde tweakes i nav-dekoreatoren-moduler for å støtte moduler
                format: 'commonjs'
                // esModule: true
            },
            plugins: [
                minifyLiterals(),
                partytownRollup({
                    dest: path.join(__dirname, 'dist', '~partytown'),
                }),
            ],
            input: ['src/main.ts'],
        },
    },
});


export const lazyConfig = defineConfig({
    build: {
        // Don't clear the output, we want to keep the main bundle
        emptyOutDir: false,
        minify: true,
        manifest: '.vite/analytics.manifest.json',
        rollupOptions: {
            input: ['src/analytics/analytics.ts'],
        },
    },
});

export const csrConfig = defineConfig({
    build: {
        // Don't clear the output, we want to keep the main bundle
        emptyOutDir: false,
        minify: true,
        manifest: '.vite/csr.manifest.json',
        rollupOptions: {
            input: ['src/csr.ts'],
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
    if (mode === 'csr') return csrConfig;

    return mainBundleConfig;
})
