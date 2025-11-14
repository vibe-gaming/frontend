import { type Config, defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
    /**
     * Input of OPEN API Specification (OAS) file
     */
    input: {
        path: './swagger.json',
    },

    /**
     * Output of generated files
     */
    output: {
        path: './src/shared/api/generated',
        clean: true,
        extension: {
            '.ts': '',
        },
    },

    /**
     * Plugins to use for the generation
     */
    plugins: [
        /**
         * Plugin for OpenAPI Specification (OAS) support
         */
        pluginOas(),

        /**
         * Plugin for generating TypeScript entities from the OAS
         */
        pluginTs({
            output: {
                path: './entities',
            },
            enumType: 'enum',
        }),

        /**
         * Plugin for generating api service client using axios
         */
        pluginClient({
            output: {
                path: './api',
            },
            dataReturnType: 'data',
            client: 'axios',
            importPath: '../../axios-client',
        }),

        /**
         * Plugin for generating TypeScript schemas from the OAS using Zod
         */
        pluginZod({
            output: {
                path: './schemas',
            },
            typed: true,
        }),

        /**
         * Plugin for generating React hooks for API calls using tanstack-query
         */
        pluginReactQuery({
            output: {
                path: './hooks',
            },
            mutation: {
                methods: ['post', 'put', 'delete', 'patch'],
            },
            suspense: false,
            client: {
                importPath: '../../axios-client',
                dataReturnType: 'data',
            },
            infinite: false,
        }),
    ],
}) as Config
