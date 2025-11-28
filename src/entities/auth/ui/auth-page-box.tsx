import React from 'react'
import { Box } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthPageBox: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Box
            display='flex'
            flexDirection='column'
            maxW='1280px'
            minH={{ base: 'calc(100dvh - 80px)', md: 'calc(100dvh - 144px)' }}
            mx='auto'
            px={{ base: '16px', md: '0' }}
            py={isDesktop ? '0' : '20px'}
            w='100%'
        >
            {children}
        </Box>
    )
}
