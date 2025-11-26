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
import { BviButton } from '@/shared/libs/bvi'

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
            mb={{ base: 5, md: 0 }}
            mt={{ base: 4, md: 10 }}
            mx='auto'
            position='sticky'
            top={0}
            w='100%'
            zIndex={1000}
        >
            <Box
                bg='white'
                px={{ base: 4, md: 6 }}
                py={{ base: 2, md: 5 }}
                rounded={{ base: '0', md: '3xl' }}
            >
                <Flex align='center' justify='space-between'>
                    {/* Логотип слева */}
                    <HStack gap={2}>
                        <IconButton
                            _active={{ bg: 'rgba(255, 255, 255, 0.1)', opacity: 0.9 }}
                            _hover={{ opacity: 0.8 }}
                            aria-label='Логотип'
                            bg='transparent'
                            borderRadius='16px'
                            color='white'
                            colorPalette='gray'
                            h='48px'
                            minW='48px'
                            p={0}
                            size='lg'
                            transition='all 0.2s'
                            variant='ghost'
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
                                fontSize='4xl'
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
                        <BviButton />

                        {!isAuthPages && (
                            <Button
                                _active={{ bg: 'blue.50', borderColor: 'blue.300' }}
                                borderColor='blue.muted'
                                borderRadius={{ base: 'xl', md: '2xl' }}
                                color='blue.solid'
                                colorPalette='blue'
                                fontSize={{ base: 'lg', md: 'xl' }}
                                fontWeight='medium'
                                px={{ base: 5, md: 7 }}
                                size={{ base: 'xl', md: '2xl' }}
                                transition='all 0.2s'
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
                            </Button>
                        )}

                        {/* Кнопка профиля - скрыта в офлайне */}
                        {isOnline && !isAuthPages && (
                            <IconButton
                                _active={{ bg: 'blue.50', borderColor: 'blue.300' }}
                                aria-label={isAuthenticated ? 'Профиль' : 'Войти'}
                                borderColor='blue.muted'
                                borderRadius={{ base: 'xl', md: '2xl' }}
                                color='blue.solid'
                                colorPalette='blue'
                                fontSize={{ base: 'lg', md: 'xl' }}
                                fontWeight='medium'
                                size={{ base: 'xl', md: '2xl' }}
                                transition='all 0.2s'
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
