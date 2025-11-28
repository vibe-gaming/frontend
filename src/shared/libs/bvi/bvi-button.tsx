import { useEffect } from 'react'
import * as isvek from '@blasdfaa/bvi'
import { Button, Show, useMediaQuery } from '@chakra-ui/react'
import { useLocation } from '@tanstack/react-router'
import { EyeIcon } from 'lucide-react'

export const BviButton = () => {
    const [isMobile] = useMediaQuery(['(max-width: 1023px)'])
    const location = useLocation()

    useEffect(() => {
        new isvek.Bvi()
    }, [])

    return (
        <Button
            _active={{ bg: 'blue.50', borderColor: 'blue.300' }}
            borderRadius={{ base: 'xl', md: '2xl' }}
            className='bvi-open'
            color='blue.solid'
            colorPalette='blue'
            cursor={location.pathname === '/benefits' ? 'not-allowed' : 'pointer'}
            fontSize={{ base: 'lg', md: 'xl' }}
            opacity={location.pathname === '/benefits' ? 0 : 1}
            pointerEvents={location.pathname === '/benefits' ? 'none' : 'auto'}
            px={{ base: 3.5, lg: 7 }}
            size={{ base: 'xl', md: '2xl' }}
            transition='all 0.2s'
            variant='outline'
            onClick={(event) => {
                event.preventDefault()
            }}
        >
            <EyeIcon />
            <Show when={!isMobile}>Версия для Слабовидящих</Show>
        </Button>
    )
}
