import { tanstackRouter } from '@tanstack/router-plugin/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

const plugins = [
    tanstackRouter({
        target: 'react',
        autoCodeSplitting: false, // Отключаем автоматический code splitting для работы в офлайне
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
                {
                    // Стратегия для JS и CSS файлов, которая корректно обрабатывает 304 Not Modified
                    // StaleWhileRevalidate отдает кэш сразу и обновляет в фоне, лучше работает с 304 на Honor
                    urlPattern: /\.(?:js|css)$/,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'js-css-cache',
                        expiration: {
                            maxEntries: 100,
                            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                        },
                    },
                },
                {
                    // Стратегия для шрифтов, корректно обрабатывает 304 Not Modified
                    urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'fonts-cache',
                        expiration: {
                            maxEntries: 30,
                            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                        },
                    },
                },
                {
                    // Стратегия для webmanifest и других манифестов
                    urlPattern: /\.(?:webmanifest|manifest\.json)$/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'manifest-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24, // 1 day
                        },
                        networkTimeoutSeconds: 3,
                    },
                },
            ],
        },
    }),
]

const server: Record<string, any> = {}

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
        cssMinify: false,
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
                            test: /node_modules\/@tanstack /,
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
        transformer: 'postcss',
    },

    define: {
        VITE_APP_PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
    },
})
