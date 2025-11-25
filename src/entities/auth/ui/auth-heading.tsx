import React, { type PropsWithChildren } from 'react'
import { Heading } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthHeading: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Heading as='h1' color='gray.800' fontSize={{ base: '2xl', md: '4xl' }} fontWeight={700}>
            {children}
        </Heading>
    )
}
