import React from 'react'
import { Box, type BoxProps } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthContent: React.FC<BoxProps> = ({ children, ...props }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Box
            display='flex'
            flexDirection='column'
            flexGrow={1}
            mt='6'
            w='100%'
            {...(!isDesktop && { gap: '6' })}
            {...props}
        >
            {children}
        </Box>
    )
}
