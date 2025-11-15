import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

import { customSystem } from './theme'

export const WithChakraUI: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <ChakraProvider value={customSystem}>{children}</ChakraProvider>
}

