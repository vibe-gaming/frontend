import { Box, IconButton } from '@chakra-ui/react'
import { useLocation, useNavigate } from '@tanstack/react-router'

import chatBotIcon from '@/shared/assets/icons/chat-bot.svg'

export const ChatWidget = () => {
    const navigate = useNavigate()
    const location = useLocation()

    // Скрываем кнопку на странице чата и страницах регистрации
    const isChatPage = location.pathname === '/chat' || location.pathname.startsWith('/chat/')
    const isRegisterPage = location.pathname.startsWith('/register') || location.pathname.startsWith('/login')

    const handleOpenChat = () => {
        navigate({ to: '/chat' })
    }

    if (isChatPage || isRegisterPage) {
        return null
    }

    return (
        <Box
            position='fixed'
            right={{ base: 3, md: 6 }}
            bottom='40px'
            // transform='translateY(-50%)'
            zIndex={1000}
        >
            <IconButton
                aria-label='Открыть чат'
                variant='ghost'
                borderRadius='full'

                h={{ base: '88px', md: '88px' }}
                shadow='xl'
                size='xl'
                w={{ base: '88px', md: '88px' }}
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
                <img
                    alt='Чат бот'
                    src={chatBotIcon}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </IconButton>
        </Box>
    )
}
