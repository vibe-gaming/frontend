import React from 'react'
import { Box, type BoxProps } from '@chakra-ui/react'

export const AuthContentBox: React.FC<BoxProps> = ({ children, ...props }) => {
    return (
        <Box
            display='flex'
            flexDirection='column'
            flexGrow={1}
            pt={{ base: '20px', md: '34px' }}
            px={{ base: 0, md: 12 }}
            {...props}
        >
            {children}
        </Box>
    )
}
