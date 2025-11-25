import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    IconButton,
    Input,
    Spinner,
    Text,
    VStack,
    HStack,
} from '@chakra-ui/react'
import { ArrowLeft, Send } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { usePostChatStart } from '@/shared/api/generated/hooks/usePostChatStart'
import { usePostChatMessage } from '@/shared/api/generated/hooks/usePostChatMessage'
import { AppHeader } from '@/shared/ui/app-header'
import { chatStorage, type ChatMessage } from '@/shared/utils/chat-storage'
import { renderMarkdown } from '@/shared/utils/markdown-parser'
import { ChatBenefitCard } from './chat-benefit-card'
import { BenefitDrawer } from '@/pages/benefits-page/ui/benefit-drawer'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const ChatPage = () => {
    const navigate = useNavigate()
    const { isMobile } = useDeviceDetect()
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isStartingChat, setIsStartingChat] = useState(false)
    const [isSendingMessage, setIsSendingMessage] = useState(false)
    const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const hasStartedChatRef = useRef(false)
    const chatStartMutation = usePostChatStart()
    const chatMessageMutation = usePostChatMessage()
    const chatStartMutationRef = useRef(chatStartMutation)
    
    // Обновляем ref при изменении мутации
    useEffect(() => {
        chatStartMutationRef.current = chatStartMutation
    }, [chatStartMutation])

    const handleStartChat = useCallback(async () => {
        if (isStartingChat || hasStartedChatRef.current) return // Предотвращаем множественные вызовы
        
        hasStartedChatRef.current = true
        setIsStartingChat(true)
        try {
            const response = await chatStartMutationRef.current.mutateAsync()
            if (response.message) {
                const botMessage: ChatMessage = {
                    id: `bot-${Date.now()}`,
                    text: response.message,
                    isBot: true,
                    timestamp: Date.now(),
                }
                const newMessages = [botMessage]
                setMessages(newMessages)
                chatStorage.saveMessages(newMessages)
            }
        } catch (error) {
            console.error('Failed to start chat:', error)
            hasStartedChatRef.current = false // Разрешаем повторную попытку при ошибке
        } finally {
            setIsStartingChat(false)
        }
    }, [isStartingChat])

    // Загружаем сообщения из local storage при монтировании (только один раз)
    useEffect(() => {
        const storedMessages = chatStorage.getMessages()
        if (storedMessages.length > 0) {
            setMessages(storedMessages)
            hasStartedChatRef.current = true // Помечаем, что чат уже был начат
        } else if (!hasStartedChatRef.current) {
            // Если сообщений нет и чат еще не был запущен, запускаем чат
            hasStartedChatRef.current = true
            setIsStartingChat(true)
            chatStartMutationRef.current.mutateAsync()
                .then((response) => {
                    if (response.message) {
                        const botMessage: ChatMessage = {
                            id: `bot-${Date.now()}`,
                            text: response.message,
                            isBot: true,
                            timestamp: Date.now(),
                        }
                        const newMessages = [botMessage]
                        setMessages(newMessages)
                        chatStorage.saveMessages(newMessages)
                    }
                })
                .catch((error) => {
                    console.error('Failed to start chat:', error)
                    hasStartedChatRef.current = false // Разрешаем повторную попытку при ошибке
                })
                .finally(() => {
                    setIsStartingChat(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Прокрутка к последнему сообщению
    useEffect(() => {
        // Используем setTimeout чтобы дождаться рендеринга карточек
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
        return () => clearTimeout(timer)
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isSendingMessage) return

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            text: inputValue.trim(),
            isBot: false,
            timestamp: Date.now(),
        }

        const messageText = inputValue.trim()
        setInputValue('')
        setIsSendingMessage(true)

        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        chatStorage.saveMessages(newMessages)

        try {
            const response = await chatMessageMutation.mutateAsync({
                data: { message: messageText },
            })

            const botMessage: ChatMessage = {
                id: `bot-${Date.now()}`,
                text: response.message || 'Ответ получен',
                isBot: true,
                timestamp: Date.now(),
                benefits: response.benefits,
            }

            const updatedMessages = [...newMessages, botMessage]
            setMessages(updatedMessages)
            chatStorage.saveMessages(updatedMessages)
            
            // Прокручиваем к концу после добавления карточек
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 200)
        } catch (error) {
            console.error('Failed to send message:', error)
            const errorMessage: ChatMessage = {
                id: `bot-${Date.now()}`,
                text: 'Извините, произошла ошибка при обработке вашего сообщения. Попробуйте еще раз.',
                isBot: true,
                timestamp: Date.now(),
            }
            const updatedMessages = [...newMessages, errorMessage]
            setMessages(updatedMessages)
            chatStorage.saveMessages(updatedMessages)
        } finally {
            setIsSendingMessage(false)
        }
    }

    const handleNewChat = async () => {
        chatStorage.clearMessages()
        setMessages([])
        setInputValue('')
        hasStartedChatRef.current = false
        // Сразу начинаем новый чат
        await handleStartChat()
        hasStartedChatRef.current = true
    }

    return (
        <Box minH='100vh' bg='gray.50' display='flex' flexDirection='column'>
            <AppHeader />
            <Box maxW='1200px' mx='auto' px={{ base: 4, md: 6 }} flex={1} display='flex' flexDirection='column' pb={{ base: 24, md: 28 }}>
                <VStack align='stretch' gap={{ base: 4, md: 6 }} pt={{ base: 6, md: 8 }} flex={1} minH={0}>
                    {/* Заголовок с кнопкой назад */}
                    <HStack gap={4} flexShrink={0}>
                        <IconButton
                            aria-label='Назад'
                            borderRadius='xl'
                            colorPalette='blue'
                            variant='ghost'
                            size={{ base: 'xl', md: 'lg' }}
                            minH={{ base: '48px', md: '40px' }}
                            minW={{ base: '48px', md: '40px' }}
                            onClick={() => navigate({ to: '/benefits' })}
                        >
                            <ArrowLeft size={isMobile ? 28 : 24} />
                        </IconButton>
                        <Heading size={{ base: '2xl', md: '4xl' }} fontWeight='bold'>
                            Чат-бот
                        </Heading>
                    </HStack>

                    {/* Кнопка начать новый чат */}
                    {messages.length > 0 && (
                        <Box flexShrink={0}>
                            <Button
                                colorPalette='gray'
                                size={{ base: 'lg', md: 'lg' }}
                                variant='outline'
                                w={{ base: '100%', md: 'fit-content' }}
                                onClick={handleNewChat}
                                disabled={isStartingChat}
                                minH={{ base: '48px', md: '48px' }}
                                fontSize={{ base: 'md', md: 'lg' }}
                            >
                                Начать новый чат
                            </Button>
                        </Box>
                    )}

                    {/* Область сообщений */}
                    <Box
                        bg='white'
                        borderRadius='2xl'
                        borderBottomRadius={{ base: '2xl', md: '2xl' }}
                        flex={1}
                        minH={0}
                        overflowY='auto'
                        overflowX='hidden'
                        p={{ base: 4, md: 6 }}
                        shadow='sm'
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            borderBottomLeftRadius: '24px',
                            borderBottomRightRadius: '24px',
                        }}
                    >
                        <VStack align='stretch' gap={{ base: 4, md: 6 }}>
                            {messages.length === 0 && isStartingChat && (
                                <Box textAlign='center' pt={8}>
                                    <Text color='gray.500' fontSize='lg' lineHeight='28px'>
                                        Загрузка...
                                    </Text>
                                </Box>
                            )}

                            {messages.length === 0 && !isStartingChat && (
                                <Box textAlign='center' pt={8}>
                                    <Text color='gray.500' fontSize='lg' lineHeight='28px'>
                                        Нажмите кнопку выше, чтобы начать чат
                                    </Text>
                                </Box>
                            )}

                            {messages.map((message) => (
                                <VStack key={message.id} align='stretch' gap={3}>
                                    <Flex justify={message.isBot ? 'flex-start' : 'flex-end'}>
                                        <Box
                                            bg={message.isBot ? 'gray.100' : 'blue.solid'}
                                            borderRadius='xl'
                                            color={message.isBot ? 'gray.800' : 'white'}
                                            maxW='80%'
                                            p={{ base: 4, md: 5 }}
                                        >
                                            <Text
                                                fontSize='lg'
                                                lineHeight='28px'
                                                whiteSpace='pre-wrap'
                                            >
                                                {renderMarkdown(message.text)}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    {/* Отображаем карточки льгот если они есть */}
                                    {message.isBot && message.benefits && message.benefits.length > 0 && (
                                        <Box mt={3}>
                                            <Grid
                                                gap={3}
                                                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                                            >
                                                {message.benefits.map((benefit) => (
                                                    <ChatBenefitCard
                                                        key={benefit.id}
                                                        benefit={benefit}
                                                        onClick={(benefitId) => {
                                                            setSelectedBenefitId(benefitId)
                                                            setIsDrawerOpen(true)
                                                        }}
                                                    />
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}
                                </VStack>
                            ))}
                            {isSendingMessage && (
                                <Flex justify='flex-start'>
                                    <Box
                                        bg='gray.100'
                                        borderRadius='xl'
                                        p={{ base: 4, md: 5 }}
                                    >
                                        <HStack gap={3}>
                                            <Spinner size={{ base: 'md', md: 'md' }} />
                                            <Text color='gray.600' fontSize='lg' lineHeight='28px'>
                                                Обработка...
                                            </Text>
                                        </HStack>
                                    </Box>
                                </Flex>
                            )}
                            <div ref={messagesEndRef} />
                        </VStack>
                    </Box>
                </VStack>

                {/* Поле ввода - зафиксировано внизу */}
                <Box
                    bg='white'
                    borderTop='1px solid'
                    borderColor='gray.200'
                    borderRadius='2xl'
                    position='fixed'
                    bottom={0}
                    left={0}
                    right={0}
                    zIndex={100}
                    px={{ base: 4, md: 6 }}
                    py={{ base: 4, md: 5 }}
                    pb={{ base: 6, md: 6 }}
                    maxW='1200px'
                    mx='auto'
                    shadow='lg'
                    style={{
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        borderBottomLeftRadius: '24px',
                        borderBottomRightRadius: '24px',
                    }}
                >
                    <HStack gap={3} maxW='1200px' mx='auto'>
                        <Input
                            placeholder='Введите сообщение...'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage()
                                }
                            }}
                            fontSize='lg'
                            size={{ base: 'xl', md: 'xl' }}
                            minH={{ base: '56px', md: '64px' }}
                        />
                        <Button
                            aria-label='Отправить сообщение'
                            colorPalette='blue'
                            disabled={!inputValue.trim() || isSendingMessage}
                            loading={isSendingMessage}
                            onClick={handleSendMessage}
                            size='xl'
                            minH={{ base: '56px', md: '64px' }}
                            minW={{ base: '56px', md: '64px' }}
                            px={4}
                            fontSize='lg'
                        >
                            <Send size={24} />
                        </Button>
                    </HStack>
                </Box>
            </Box>
            <BenefitDrawer
                benefitId={selectedBenefitId}
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false)
                    setSelectedBenefitId(null)
                }}
            />
        </Box>
    )
}

