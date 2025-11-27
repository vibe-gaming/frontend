import { useEffect, useRef } from 'react'
import * as isvek from '@blasdfaa/bvi'
import { Button, Show, useMediaQuery } from '@chakra-ui/react'
import { EyeIcon } from 'lucide-react'

import './bvi.css'

export const BviButton = () => {
    const bviRef = useRef<any>(null)
    const [isDesktop] = useMediaQuery(['(min-width: 768px)'])

    useEffect(() => {
        if (bviRef.current) return
        bviRef.current = new isvek.Bvi({
            target: '.bvi-open-btn',
        })
    }, [])

    return (
        <Button
            _active={{ bg: 'blue.50', borderColor: 'blue.300' }}
            borderRadius={{ base: 'xl', md: '2xl' }}
            className='bvi-open-btn'
            color='blue.solid'
            colorPalette='blue'
            fontSize={{ base: 'lg', md: 'xl' }}
            px={{ base: 3.5, md: 7 }}
            size={{ base: 'xl', md: '2xl' }}
            transition='all 0.2s'
            variant='outline'
            onClick={(event) => {
                event.preventDefault()
            }}
        >
            <EyeIcon />
            <Show when={isDesktop}>Версия для Слабовидящих</Show>
        </Button>
    )
}
