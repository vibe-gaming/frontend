import React from 'react'
import { Button, type ButtonProps } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Button
            _active={{ bg: '#1e40af' }}
            borderRadius='2xl'
            colorPalette='blue'
            fontSize='xl'
            size='2xl'
            transition='all 0.2s'
            variant='solid'
            w={isDesktop ? 'auto' : '100%'}
            {...props}
        >
            {children}
        </Button>
    )
}
