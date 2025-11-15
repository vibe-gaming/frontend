import { tanstackRouter } from '@tanstack/router-plugin/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import autoprefixer from 'autoprefixer'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const plugins = [
    tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './src/app/routes',
        generatedRouteTree: './src/app/route-tree.generated.ts',
    }),
    react({
        babel: {
            plugins: [['babel-plugin-react-compiler']],
        },
    }),
    tsconfigPaths(),
    VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
            name: 'Мои льготы',
            short_name: 'Мои льготы',
            description: 'Сайт для поиска льгот и субсидий',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            icons: [
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
            ],
        },
        workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images-cache',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                        },
                    },
                },
            ],
        },
    }),
]

const server: Record<string, any> = {
    proxy: {
        '/api': {
            target: 'https://backend-production-10ec.up.railway.app',
            changeOrigin: true,
            secure: true,
        },
    },
}

const ALREADY_EXIST_SSL_CERT = fs.existsSync('./.cert/key.pem')

if (ALREADY_EXIST_SSL_CERT) {
    server['https'] = {
        key: './.cert/key.pem',
        cert: './.cert/cert.pem',
    }
} else {
    plugins.push(basicSsl())
}

// https://vite.dev/config/
export default defineConfig({
    plugins,
    server,
    build: {
        sourcemap: true,
        target: browserslistToEsbuild(),
        rollupOptions: {
            output: {
                advancedChunks: {
                    groups: [
                        {
                            name: 'vendor',
                            test: /node_modules\/react|react-dom|react-dom\/client/,
                        },
                        {
                            test: /node_modules\/(react-spring|jotai\/esm|xstate|sonner|axios|axios-auth-refresh|dayjs|zod)/,
                            name: 'lib',
                        },
                        {
                            name: 'tanstack',
                            test: /node_modules\/@tanstack/,
                        },
                    ],
                },
            },
        },
    },

    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },

    define: {
        VITE_APP_PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
    },
})
