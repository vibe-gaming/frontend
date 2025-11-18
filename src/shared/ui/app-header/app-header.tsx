import { Box, Flex, IconButton, Button, HStack, Show, Heading, Text, useMediaQuery, VStack } from '@chakra-ui/react'
import { User } from 'lucide-react'

import { useAuthState } from '@/entities/auth'

import logoIcon from '@/shared/assets/icons/logo.svg'
import { useNavigate } from '@tanstack/react-router'

export const AppHeader = () => {
    const navigate = useNavigate();
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"]); // 768px is the breakpoint for desktop

    const onLogoClick = () => navigate({ to: '/' });
    const onBenefitsClick = () => navigate({ to: '/benefits' });
    const onLoginClick = () => navigate({ to: '/login' });
    const onProfileClick = () => navigate({ to: '/profile' });

    const { isAuthenticated } = useAuthState()

    return (
        <Box
            position="sticky"
            top={0}
            zIndex={1000}
            px={{ base: 4, md: 5 }}
            py={{ base: 0, md: 5 }}
            mt={{ base: 5, md: 0 }}
            mx="auto"
            maxW="1200px"
            w="100%"
            bg={{ base: 'transparent', md: 'gray.50' }}
        >
            <Box bg="white" borderRadius="16px" p={{ base: 2, md: 5 }} boxShadow={{ base: 'none', md: 'sm' }}>
                <Flex align="center" justify="space-between">
                    {/* Логотип слева */}
                    <HStack gap={2}>
                        <IconButton
                            aria-label="Логотип"
                            bg="transparent"
                            borderRadius="16px"
                            color="white"
                            size="lg"
                            minW="48px"
                            h="48px"
                            p={0}
                            _hover={{ opacity: 0.8 }}
                            onClick={onLogoClick}
                        >
                            <img
                                src={logoIcon}
                                alt="Логотип"
                                width="48"
                                height="48"
                                style={{ display: 'block' }}
                            />
                        </IconButton>
                        <Show when={isDesktop}>
                            <Heading as="h3" fontSize="3xl" fontWeight="extrabold" lineHeight="40px" >мои<Text as="span" color="blue.solid" fontWeight="extrabold" lineHeight="40px">льготы</Text></Heading>
                        </Show>
                    </HStack>


                    {/* Кнопка "Льготы" и иконка профиля справа */}
                    <HStack gap="8px">
                        <Button
                            variant="outline"
                            borderRadius="16px"
                            borderColor="blue.solid"
                            color="blue.solid"
                            fontWeight="medium"
                            size="md"
                            px="32px"
                            h="48px"
                            bg="white"
                            _hover={{ bg: 'blue.50' }}
                            onClick={onBenefitsClick}
                        >
                            Льготы
                        </Button>

                        <IconButton
                            aria-label={isAuthenticated ? 'Профиль' : 'Войти'}
                            variant="outline"
                            borderRadius="16px"
                            borderColor="blue.solid"
                            color="blue.solid"
                            size="lg"
                            minW="48px"
                            h="48px"
                            bg="white"
                            _hover={{ bg: 'blue.50' }}
                            onClick={isAuthenticated ? onProfileClick : onLoginClick}
                        >
                            <User size={24} />
                        </IconButton>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    )
}
