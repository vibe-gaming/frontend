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
import { useLocation, useNavigate } from '@tanstack/react-router'
import { User } from 'lucide-react'

import { useAuthState } from '@/entities/auth'
import logoIcon from '@/shared/assets/icons/logo.svg'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'

export const AppHeader = ({ isAuthPages = false }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isDesktop] = useMediaQuery(['(min-width: 768px)']) // 768px is the breakpoint for desktop
    const isOnline = useOnlineStatus()

    const onLogoClick = () => navigate({ to: '/' })
    const onBenefitsClick = () => navigate({ to: '/benefits' })
    const onLoginClick = () => navigate({ to: '/login' })
    const onProfileClick = () => navigate({ to: '/profile' })
    const onHomeClick = () => navigate({ to: '/' })

    const { isAuthenticated } = useAuthState()

    // Определяем, находимся ли мы на главной странице
    const isHomePage = location.pathname === '/'

    return (
        <Box
            maxW='1200px'
            mt={{ base: 4, md: 10 }}
            mb={{ base: 5, md: 0 }}
            mx='auto'
            position='sticky'
            top={0}
            w='100%'
            zIndex={1000}
        >
            <Box bg='white' py={{ base: 2, md: 5 }} px={{ base: 4, md: 6 }} rounded={{ base: '0', md: '3xl' }}>
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
                            onClick={() => {
                                if (!isAuthPages) onLogoClick()
                            }}
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

                    {/* Кнопка навигации и иконка профиля справа */}
                    <HStack gap='8px'>
                        {!isAuthPages && <Button
                            _hover={{ bg: 'blue.50' }}
                            bg='white'
                            borderColor='blue.muted'
                            borderRadius={{ base: 'xl', md: "2xl" }}
                            color='blue.solid'
                            fontSize={{ base: "lg", md: "xl" }}
                            fontWeight='medium'
                            px='32px'
                            size={{ base: "xl", md: "2xl" }}
                            variant='outline'
                            onClick={() => {
                                if (isHomePage) {
                                    onBenefitsClick()
                                } else {
                                    onHomeClick()
                                }
                            }}
                        >
                            {isHomePage ? 'Льготы' : 'Главная'}
                        </Button>}

                        {/* Кнопка профиля - скрыта в офлайне */}
                        {isOnline && !isAuthPages && (
                            <IconButton
                                _hover={{ bg: 'blue.50' }}
                                aria-label={isAuthenticated ? 'Профиль' : 'Войти'}
                                bg='white'
                                borderColor='blue.muted'
                                borderRadius={{ base: 'xl', md: "2xl" }}
                                color='blue.solid'
                                fontSize={{ base: "lg", md: "xl" }}
                                fontWeight='medium'
                                size={{ base: "xl", md: "2xl" }}
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
