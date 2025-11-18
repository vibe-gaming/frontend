import React from 'react'
import { Button, type ButtonProps } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthBackButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Button
            bg='white'
            border='1px solid'
            borderColor='blue.muted'
            borderRadius='2xl'
            color='blue.fg'
            fontSize='xl'
            size='2xl'
            w={isDesktop ? 'auto' : '100%'}
            {...props}
        >
            {children}
        </Button>
    )
}
