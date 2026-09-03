import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({ routesDirectory: './src/routes', autoCodeSplitting: true }),
        react(),
        svgr(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                loadPaths: [fileURLToPath(new URL('./src', import.meta.url))],
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return;
                    }
                    if (id.includes('react-dom') || id.match(/node_modules\/react\//)) {
                        return 'vendor-react';
                    }
                    if (
                        id.includes('@tanstack/react-router') ||
                        id.includes('@tanstack/router-core') ||
                        id.includes('@tanstack/history')
                    ) {
                        return 'vendor-router';
                    }
                    if (
                        id.includes('@tanstack/react-query') ||
                        id.includes('@tanstack/query-core')
                    ) {
                        return 'vendor-query';
                    }
                    if (id.includes('i18next')) {
                        return 'vendor-i18n';
                    }
                    if (id.includes('zod')) {
                        return 'vendor-zod';
                    }
                    return 'vendor';
                },
            },
        },
    },
});
