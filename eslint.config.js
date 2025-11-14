import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { FlatCompat } from '@eslint/eslintrc'
import { defineConfig } from 'eslint/config'
import fileProgress from 'eslint-plugin-file-progress'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import { TanStackRouterEsbuild } from '@tanstack/router-plugin/esbuild'

import js from '@eslint/js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default defineConfig([
    {
        ignores: [
            'node_modules/*',
            'package.json',
            'dist',
            '*.js',
            '*.msw.ts',
            '*.gen.ts',
            '**/generated/',
            '**/mocks/**',
            '**/route-tree.generated.ts',
        ],
    },
    {
        plugins: {
            'tanstack-router-esbuild': TanStackRouterEsbuild({
                target: 'react',
                autoCodeSplitting: true,
            }),
            import: fixupPluginRules(eslintPluginImport),
            prettier: eslintPluginPrettier,
            '@typescript-eslint': typescriptEslint,
            'unused-imports': unusedImports,
            'file-progress': fileProgress,
            'simple-import-sort': simpleImportSort,
        },

        extends: [
            eslintPluginPrettierRecommended,
            unicorn.configs.recommended,
            ...fixupConfigRules(
                compat.extends(
                    'eslint:recommended',
                    'plugin:react-hooks/recommended',
                    'plugin:react/recommended',
                    'prettier'
                )
            ),
        ],

        languageOptions: {
            globals: {
                ...globals.browser,
                ...Object.fromEntries(Object.entries(globals.node).map(([key]) => [key, 'off'])),
                NodeJS: false,
            },

            parser: tsParser,
        },

        settings: {
            react: {
                version: '19.0.0',
            },

            progress: {
                successMessage: 'Good job!',
            },

            'import-x/resolver-next': [
                createTypeScriptImportResolver({
                    alwaysTryTypes: true,
                    project: 'tsconfig.json',
                }),
            ],
        },

        rules: {
            'no-unused-vars': 'off',
            'no-redeclare': 'off',
            'no-irregular-whitespace': 'off',
            'no-duplicate-imports': 'error',

            'sort-imports': 'off',

            semi: ['error', 'never'],
            'no-empty-pattern': [
                'error',
                {
                    allowObjectPatternsAsParameters: true,
                },
            ],
            'newline-before-return': 'error',

            // plugin:react
            'react/react-in-jsx-scope': 'off',
            'react/jsx-key': 'off',
            'react/self-closing-comp': 'error',
            'react/jsx-sort-props': [
                'error',
                {
                    callbacksLast: true,
                    shorthandFirst: true,
                    ignoreCase: true,
                    multiline: 'last',
                    reservedFirst: true,
                },
            ],

            // file-progress
            'file-progress/activate': 1,

            // prettier
            'prettier/prettier': 'error',

            // @typescript-eslint
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-redeclare': 'error',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off',

            // eslint-plugin-import
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',

            // unused-imports
            'unused-imports/no-unused-imports': 'warn',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            // simple-import-sort
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^react$', String.raw`^@?\w`],
                        [String.raw`^\u0000`],
                        [String.raw`^@?(?!mediu@nrwl/eslint-plugin-nxm-stories)\w`],
                        [String.raw`^@medium-stories?\w`],
                        ['^[^.]'],
                        [String.raw`^\.`],
                    ],
                },
            ],

            // eslint-plugin-unicorn
            'unicorn/no-useless-undefined': 'off',
            'unicorn/no-useless-fallback-in-spread': 'off',
            'unicorn/no-null': 'off',
            'unicorn/filename-case': [
                'error',
                {
                    cases: {
                        kebabCase: true,
                        camelCase: false,
                        snakeCase: true,
                        pascalCase: false,
                    },
                    ignore: [
                        String.raw`\.spec.ts(x)?`,
                        String.raw`\.types.ts(x)?`,
                        String.raw`\.stories.ts(x)?`,
                        String.raw`\.styled.ts(x)?`,
                        String.raw`\.styles.ts(x)?`,
                    ],
                },
            ],
            'unicorn/prefer-top-level-await': 'off',
            'unicorn/no-useless-promise-resolve-reject': 'off',
            'unicorn/prevent-abbreviations': [
                'error',
                {
                    replacements: {
                        props: false,
                        params: false,
                        env: false,
                        ref: false,
                    },
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.tsx'],
        rules: {
            'no-undef': 'off',
        },
    },
])
