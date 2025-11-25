import React from 'react'
import { Button, type ButtonProps } from '@chakra-ui/react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const AuthBackButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Button
            _active={{ bg: 'blue.50', borderColor: 'blue.300' }}
            border='1px solid'
            borderColor='blue.muted'
            borderRadius='2xl'
            color='blue.fg'
            colorPalette='blue'
            fontSize='xl'
            size='2xl'
            transition='all 0.2s'
            variant='outline'
            w={isDesktop ? 'auto' : '100%'}
            {...props}
        >
            {children}
        </Button>
    )
}
