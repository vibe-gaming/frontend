import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

// Кастомизация темы Chakra UI
const customConfig = defineConfig({
    theme: {
        tokens: {
            // Радиусы скругления
            radii: {
                none: { value: '0' },
                sm: { value: '4px' },
                md: { value: '8px' },
                lg: { value: '12px' },
                xl: { value: '16px' },
                '2xl': { value: '20px' },
                '3xl': { value: '24px' },
                full: { value: '9999px' },
            },
        },
        semanticTokens: {
            colors: {
                fg: {
                    value: { base: 'colors.gray.800' },
                },
            },
        },
    },
})

export const customSystem = createSystem(defaultConfig, customConfig)

