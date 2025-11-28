import { useEffect, useState } from 'react'
import { Box, IconButton, Text, useMediaQuery, VStack } from '@chakra-ui/react'
import { X } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'

import chatBotIcon from '@/shared/assets/icons/chat-bot.svg'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

let hasAnimationBeenShownInSession = false
let hasTooltipBeenShownInSession = false

export const ChatWidget = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isVisible, setIsVisible] = useState(hasAnimationBeenShownInSession)
    const [isTooltipVisible, setIsTooltipVisible] = useState(false)
    const { isMobile } = useDeviceDetect()

    // Скрываем кнопку на странице чата и страницах регистрации
    const isChatPage = location.pathname === '/chat' || location.pathname.startsWith('/chat/')
    const isRegisterPage = location.pathname.startsWith('/register') || location.pathname.startsWith('/login')

    const handleOpenChat = () => {
        navigate({ to: '/chat' })
    }

    useEffect(() => {
        if (hasAnimationBeenShownInSession) {
            setIsVisible(true)
            // Если бот уже был показан, но тултип еще не показывался, показываем тултип
            if (!hasTooltipBeenShownInSession) {
                const tooltipTimer = setTimeout(() => {
                    setIsTooltipVisible(true)
                    hasTooltipBeenShownInSession = true
                }, 500) // Задержка после появления бота
                return () => clearTimeout(tooltipTimer)
            }
            return
        }

        const timer = setTimeout(() => {
            setIsVisible(true)
            hasAnimationBeenShownInSession = true

            // Показываем тултип после появления бота
            if (!hasTooltipBeenShownInSession) {
                const tooltipTimer = setTimeout(() => {
                    setIsTooltipVisible(true)
                    hasTooltipBeenShownInSession = true
                }, 500) // Задержка после появления бота
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    const handleCloseTooltip = () => {
        setIsTooltipVisible(false)
    }

    if (isChatPage || isRegisterPage) {
        return null
    }

    return (
        <Box
            position='fixed'
            right={{ base: 3, md: 10 }}
            bottom='40px'
            zIndex={1000}
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            gap={{ base: 2, md: 4 }}
        >
            {/* Тултип */}
            <Box
                bg='blue.100'
                borderRadius={{ base: 'md', md: 'xl' }}
                maxW='280px'
                position='relative'
                boxSizing='border-box'
                transformOrigin='bottom right'
                transform={
                    isTooltipVisible
                        ? 'scale(1) translateY(0) translateX(0)'
                        : 'scale(0.3) translateY(20px) translateX(20px)'
                }
                opacity={isTooltipVisible ? 0.95 : 0}
                pointerEvents={isTooltipVisible ? 'auto' : 'none'}
                transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                visibility={isTooltipVisible ? 'visible' : 'hidden'}
            >
                <IconButton
                    aria-label='Закрыть подсказку'
                    variant='ghost'
                    position='absolute'
                    top={"0"}
                    right={"-4px"}
                    w={{ base: '32px', md: '40px' }}
                    h={{ base: '32px', md: '40px' }}
                    maxW={{ base: '32px', md: '40px' }}
                    maxH={{ base: '32px', md: '40px' }}
                    onClick={handleCloseTooltip}
                    color='blue.700'
                    fontSize={{ base: 'md', md: 'xl' }}
                >
                    <X size={20} />
                </IconButton>
                <VStack
                    align='flex-start'
                    gap={1}
                    pr={6}
                    boxSizing='border-box'
                    py={{ base: 1, md: 3 }}
                    pl={{ base: 3, md: 4 }}>
                    <Text
                        fontSize={{ base: 'md', md: 'xl' }}
                        lineHeight={{ base: '24px', md: '32px' }}
                        color='blue.700'
                        fontWeight='medium'
                        whiteSpace='pre-line'
                    >
                        Привет,{'\n'}я виртуальный{'\n'}помощник
                    </Text>
                </VStack>
            </Box>

            {/* Кнопка бота */}
            <IconButton
                aria-label='Открыть чат'
                variant='ghost'
                borderRadius='full'
                h={{ base: '88px', md: '88px' }}
                // shadow='xl'
                size='xl'
                w={{ base: '88px', md: '88px' }}
                onClick={handleOpenChat}
                _hover={{
                    transform: isVisible ? 'scale(1.05) translateX(0)' : 'translateX(100px)',
                    // shadow: '2xl',
                }}
                _active={{
                    transform: isVisible ? 'scale(0.95) translateX(0)' : 'translateX(100px)',
                }}
                transition='all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                transform={isVisible ? 'translateX(0)' : 'translateX(100px)'}
                opacity={isVisible ? 1 : 0}
            >
                <img
                    alt='Чат бот'
                    src={chatBotIcon}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        boxShadow: '0 0 16px rgba(0, 0, 0, 0.3)',
                        borderRadius: '100%',
                    }}
                />
            </IconButton>
        </Box>
    )
}
