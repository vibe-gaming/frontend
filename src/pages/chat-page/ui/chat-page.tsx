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
    InputGroup,
} from '@chakra-ui/react'
import { X, SendHorizontal } from 'lucide-react'
import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'

import { usePostChatStart } from '@/shared/api/generated/hooks/usePostChatStart'
import { usePostChatMessage } from '@/shared/api/generated/hooks/usePostChatMessage'
import { AppHeader } from '@/shared/ui/app-header'
import { chatStorage, type ChatMessage } from '@/shared/utils/chat-storage'
import { ChatMessage as ChatMessageComponent } from './chat-message'
import { BenefitDrawer } from '@/pages/benefits-page/ui/benefit-drawer'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const ChatPage = () => {
    const navigate = useNavigate()
    const router = useRouter()
    const canGoBack = useCanGoBack()
    const { isMobile } = useDeviceDetect()
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isStartingChat, setIsStartingChat] = useState(false)
    const [isSendingMessage, setIsSendingMessage] = useState(false)
    const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
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

    // Устанавливаем синий фон для html элемента на странице чата
    useEffect(() => {
        const htmlElement = document.documentElement
        const originalBgColor = htmlElement.style.backgroundColor

        htmlElement.style.backgroundColor = '#2563eb' // blue.600

        return () => {
            // Восстанавливаем исходный цвет при размонтировании
            htmlElement.style.backgroundColor = originalBgColor || ''
        }
    }, [])

    // Прокрутка к последнему сообщению
    useEffect(() => {
        // Используем setTimeout чтобы дождаться рендеринга карточек
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 100)
        return () => clearTimeout(timer)
    }, [messages, isSendingMessage])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isSendingMessage) return

        scrollToBottom();

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
                scrollToBottom();
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

    const scrollToBottom = () => {
        const container = messagesContainerRef.current
        if (container) {
            container.scrollTop = container.scrollHeight + 32
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget
        console.log(container.scrollTop, container.clientHeight)
        // if (container.scrollTop + container.clientHeight >= container.scrollHeight - 32) {
        //     scrollToBottom()
        // }
    }

    return (
        <Box minH='100vh' bg='blue.600' display='flex' flexDirection='column'>
            <Box maxW='1200px' w='100%' mx='auto' flex={1} display='flex' flexDirection='column' pb={{ base: 24, md: 28 }}>
                <VStack align='stretch' gap={0} flex={1} minH={0} w='100%'>
                    {/* Заголовок с кнопкой назад */}
                    <Box position='relative' height='56px' borderBottomRadius='3xl'>
                        <Heading
                            height='100%'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            fontSize={{ base: 'xl', md: '2xl' }}
                            lineHeight={{ base: '30px', md: '30px' }}
                            fontWeight='bold'
                            w='100%'
                            textAlign='center'
                            color='white'
                        >
                            Чат бот
                        </Heading>
                        <IconButton
                            position='absolute'
                            variant='ghost'
                            right={0}
                            top={0}
                            aria-label='Назад'
                            minH={{ base: '56px', md: '56px' }}
                            minW={{ base: '56px', md: '56px' }}
                            onClick={() => canGoBack ? router.history.back() : navigate({ to: '/' })}
                        >
                            <X color='white' size={isMobile ? 24 : 24} />
                        </IconButton>
                    </Box>

                    {/* Кнопка начать новый чат */}
                    {/* {messages.length > 1 && (
                        <Box flexShrink={0} mx={4} borderBottomRadius='3xl' mt={2}>
                            <Button
                                variant='surface'
                                color='blue.fg'
                                colorPalette='blue'
                                borderRadius='2xl'
                                border='1px solid'
                                borderColor='blue.600'
                                size={{ base: '2xl', md: '2xl' }}
                                // variant='outline'
                                w={{ base: '100%', md: '100%' }}
                                onClick={handleNewChat}
                                disabled={isStartingChat}
                                minH={{ base: '48px', md: '48px' }}
                                fontSize={{ base: 'lg', md: 'lg' }}
                                _active={{
                                    bg: 'white',
                                }}
                                zIndex={1}
                            >
                                Начать новый чат
                            </Button>
                        </Box>
                    )} */}

                    {/* Область сообщений */}
                    <Box
                        ref={messagesContainerRef}
                        px={{ base: 4, md: 6 }}
                        // position='relative'
                        // mt={"-16px"}
                        mb={"-32px"}
                        // pt={"32px"}
                        pb={"16px"}
                        flex={1}
                        minH={0}
                        maxH={'calc(100vh - 120px)'}
                        w='100%'
                        overflowY='auto'
                        overflowX='hidden'
                        display='flex'
                        flexDirection='column'
                        style={{
                            WebkitOverflowScrolling: 'touch',
                        }}
                        onScroll={handleScroll}
                    >
                        <VStack
                            align='stretch'
                            gap={{ base: 4, md: 4 }}
                            flex={1}
                            justifyContent='flex-end'
                            flexDirection='column'
                            mb={"16px"}
                        >
                            {messages.length === 0 && isStartingChat && (
                                <Box textAlign='center' pb={8}>
                                    <Text color='white' fontSize='lg' lineHeight='28px'>
                                        Загрузка...
                                    </Text>
                                </Box>
                            )}

                            {/* {messages.length === 0 && !isStartingChat && (
                                <Box textAlign='center' pb={8}>
                                    <Text color='white' fontSize='lg' lineHeight='28px'>
                                        Нажмите кнопку выше, чтобы начать чат
                                    </Text>
                                </Box>
                            )} */}

                            {messages.map((message) => (
                                <ChatMessageComponent
                                    key={message.id}
                                    message={message}
                                    onBenefitClick={(benefitId) => {
                                        setSelectedBenefitId(benefitId)
                                        setIsDrawerOpen(true)
                                    }}
                                />
                            ))}
                            {isSendingMessage && (
                                <Flex justify='flex-start'>
                                    <Box
                                        bg='gray.100'
                                        borderRadius='xl'
                                        p={{ base: 4, md: 4 }}
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
                        </VStack>
                    </Box>
                </VStack>

                {/* Поле ввода - зафиксировано внизу */}
                <Box
                    bg='blue.600'
                    position='fixed'
                    bottom={0}
                    left={4}
                    right={4}
                    pb={4}
                    zIndex={100}
                    maxW='1200px'
                    mx='auto'
                    borderTopRadius='3xl'
                >
                    <InputGroup
                        bg='white'
                        gap={3}
                        w='100%'
                        h={{ base: '64px', md: '64px' }}
                        borderRadius='2xl'
                        position='relative'
                        endElement={
                            <IconButton
                                aria-label='Отправить сообщение'
                                variant='ghost'
                                disabled={!inputValue.trim() || isSendingMessage}
                                loading={isSendingMessage}
                                onClick={handleSendMessage}
                                px={4}
                                position='absolute'
                                right={5}
                                top={3}
                                h="40px"
                                w="40px"
                                color='blue.600'
                                zIndex={1000}
                            >
                                <SendHorizontal size={20} />
                            </IconButton>
                        }
                    >
                        <Input
                            placeholder='Введите запрос...'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage()
                                }
                            }}
                            fontSize='lg'
                            h="100%"
                            w="100%"
                            border='none'
                            bg='transparent'
                            borderRadius='2xl'
                            color='fg.subtle'
                        />
                    </InputGroup>
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

