import React from 'react'
import { Box } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthContentBox: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Box
            display='flex'
            flexDirection='column'
            flexGrow={1}
            pt={isDesktop ? '34px' : '20px'}
            px={isDesktop ? '20px' : 0}
        >
            {children}
        </Box>
    )
}
