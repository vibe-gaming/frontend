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
            // Отступы
            spacing: {
                '0': { value: '0' },
                '1': { value: '0.25rem' }, // 4px
                '2': { value: '0.5rem' }, // 8px
                '3': { value: '0.75rem' }, // 12px
                '4': { value: '1rem' }, // 16px
                '5': { value: '1.25rem' }, // 20px
                '6': { value: '1.5rem' }, // 24px
                '8': { value: '2rem' }, // 32px
                '10': { value: '2.5rem' }, // 40px
                '12': { value: '3rem' }, // 48px
                '14': { value: '3.5rem' }, // 56px
                '16': { value: '4rem' }, // 64px
                '20': { value: '5rem' }, // 80px
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
    globalCss: {
        '*': {
            // Глобальная настройка focus ring - более заметное синее кольцо
            focusRingColor: 'blue.800 !important',
            focusRingWidth: '1px !important',
            focusVisibleRing: 'inside !important',
        },
    },
})

export const customSystem = createSystem(defaultConfig, customConfig)


