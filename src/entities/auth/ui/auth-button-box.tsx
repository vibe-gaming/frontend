import React from 'react'
import { Box, type BoxProps } from '@chakra-ui/react'

export const AuthButtonBox: React.FC<BoxProps> = ({ children, ...props }) => {
    return (
        <Box mt={{ base: 'auto', md: '40px' }} {...props}>
            {children}
        </Box>
    )
}
