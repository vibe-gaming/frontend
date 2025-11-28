import React from 'react'
import { Button, type ButtonProps } from '@chakra-ui/react'

export const AuthButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <Button
            _active={{ bg: '#1e40af' }}
            borderRadius='2xl'
            colorPalette='blue'
            fontSize='xl'
            size='2xl'
            transition='all 0.2s'
            variant='solid'
            w={{ base: '100%', md: 'auto' }}
            {...props}
        >
            {children}
        </Button>
    )
}
