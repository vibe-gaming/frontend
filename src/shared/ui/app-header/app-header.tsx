import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Show,
    Text,
    useMediaQuery,
} from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { User } from 'lucide-react'

import { useAuthState } from '@/entities/auth'
import logoIcon from '@/shared/assets/icons/logo.svg'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'

export const AppHeader = () => {
    const navigate = useNavigate()
    const [isDesktop] = useMediaQuery(['(min-width: 768px)']) // 768px is the breakpoint for desktop
    const isOnline = useOnlineStatus()

    const onLogoClick = () => navigate({ to: '/' })
    const onBenefitsClick = () => navigate({ to: '/benefits' })
    const onLoginClick = () => navigate({ to: '/login' })
    const onProfileClick = () => navigate({ to: '/profile' })

    const { isAuthenticated } = useAuthState()

    return (
        <Box
            maxW='1200px'
            mt={{ base: 5, md: 0 }}
            mx='auto'
            position='sticky'
            top={0}
            w='100%'
            zIndex={1000}
        >
            <Box bg='white' borderRadius='16px' p={{ base: 2, md: 5 }}>
                <Flex align='center' justify='space-between'>
                    {/* Логотип слева */}
                    <HStack gap={2}>
                        <IconButton
                            _hover={{ opacity: 0.8 }}
                            aria-label='Логотип'
                            bg='transparent'
                            borderRadius='16px'
                            color='white'
                            h='48px'
                            minW='48px'
                            p={0}
                            size='lg'
                            onClick={onLogoClick}
                        >
                            <img
                                alt='Логотип'
                                height='48'
                                src={logoIcon}
                                style={{ display: 'block' }}
                                width='48'
                            />
                        </IconButton>
                        <Show when={isDesktop}>
                            <Heading
                                as='h3'
                                fontSize='3xl'
                                fontWeight='extrabold'
                                lineHeight='40px'
                            >
                                мои
                                <Text
                                    as='span'
                                    color='blue.solid'
                                    fontWeight='extrabold'
                                    lineHeight='40px'
                                >
                                    льготы
                                </Text>
                            </Heading>
                        </Show>
                    </HStack>

                    {/* Кнопка "Льготы" и иконка профиля справа */}
                    <HStack gap='8px'>
                        <Button
                            _hover={{ bg: 'blue.50' }}
                            bg='white'
                            borderColor='blue.solid'
                            borderRadius='16px'
                            color='blue.solid'
                            fontWeight='medium'
                            h='48px'
                            px='32px'
                            size='md'
                            variant='outline'
                            onClick={onBenefitsClick}
                        >
                            Льготы
                        </Button>

                        {/* Кнопка профиля - скрыта в офлайне */}
                        {isOnline && (
                            <IconButton
                                _hover={{ bg: 'blue.50' }}
                                aria-label={isAuthenticated ? 'Профиль' : 'Войти'}
                                bg='white'
                                borderColor='blue.solid'
                                borderRadius='16px'
                                color='blue.solid'
                                h='48px'
                                minW='48px'
                                size='lg'
                                variant='outline'
                                onClick={isAuthenticated ? onProfileClick : onLoginClick}
                            >
                                <User size={24} />
                            </IconButton>
                        )}
                    </HStack>
                </Flex>
            </Box>
        </Box>
    )
}
