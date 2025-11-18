import React from 'react'
import { Box } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthPageBox: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Box
            display='flex'
            flexDirection='column'
            maxW='1200px'
            minH='100dvh'
            mx='auto'
            px='16px'
            py={isDesktop ? '0' : '20px'}
            w='100%'
        >
            {children}
        </Box>
    )
}
