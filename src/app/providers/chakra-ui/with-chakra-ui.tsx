import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

import { LightMode } from '@/components/ui/color-mode'

import { customSystem } from './theme'

export const WithChakraUI: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <LightMode>
            <ChakraProvider value={customSystem}>{children}</ChakraProvider>
        </LightMode>
    )
}
