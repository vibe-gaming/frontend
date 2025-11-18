import React from 'react'
import { Button, type ButtonProps } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Button
            bg='#2563EB'
            borderRadius='2xl'
            fontSize='xl'
            size='2xl'
            w={isDesktop ? 'auto' : '100%'}
            {...props}
        >
            {children}
        </Button>
    )
}
