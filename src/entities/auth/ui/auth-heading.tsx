import React, { type PropsWithChildren } from 'react'
import { Heading } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthHeading: React.FC<PropsWithChildren> = ({ children }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Heading as='h1' color='#27272A' fontSize={isDesktop ? '4xl' : '2xl'} fontWeight={700}>
            {children}
        </Heading>
    )
}
