import { tanstackRouter } from '@tanstack/router-plugin/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
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
