import React from 'react'
import { Box } from '@chakra-ui/react'

export const AuthPageBox: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Box
            display='flex'
            flexDirection='column'
            maxW='1200px'
            minH='100dvh'
            mx='auto'
            px='16px'
            py='20px'
            w='100%'
        >
            {children}
        </Box>
    )
}
