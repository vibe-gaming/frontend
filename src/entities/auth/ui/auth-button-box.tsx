import React from 'react'
import { Box, type BoxProps } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthButtonBox: React.FC<BoxProps> = ({ children, ...props }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Box mt={isDesktop ? '40px' : 'auto'} {...props}>
            {children}
        </Box>
    )
}
