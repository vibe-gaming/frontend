import { Box, IconButton } from '@chakra-ui/react'
import { MessageCircle } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const ChatWidget = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { isMobile } = useDeviceDetect()

    // Скрываем кнопку на странице чата
    const isChatPage = location.pathname === '/chat'

    const handleOpenChat = () => {
        navigate({ to: '/chat' })
    }

    if (isChatPage) {
        return null
    }

    return (
        <Box
            position='fixed'
            bottom={{ base: 4, md: 4 }}
            right={{ base: 4, md: 4 }}
            zIndex={1000}
        >
            <IconButton
                aria-label='Открыть чат'
                bg='blue.solid'
                borderRadius='full'
                color='white'
                colorPalette='blue'
                h={{ base: '56px', md: '64px' }}
                shadow='xl'
                size='xl'
                w={{ base: '56px', md: '64px' }}
                onClick={handleOpenChat}
                _hover={{
                    transform: 'scale(1.05)',
                    shadow: '2xl',
                }}
                _active={{
                    transform: 'scale(0.95)',
                }}
                transition='all 0.2s'
            >
                <MessageCircle size={isMobile ? 28 : 32} />
            </IconButton>
        </Box>
    )
}
