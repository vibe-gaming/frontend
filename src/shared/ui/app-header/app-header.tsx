import { Box, Flex, IconButton, Button, HStack } from '@chakra-ui/react'
import { User } from 'lucide-react'

import { useAuthState } from '@/entities/auth'

import logoIcon from '@/shared/assets/icons/logo.svg'
import { useNavigate } from '@tanstack/react-router'

export const AppHeader = () => {
    const navigate = useNavigate();

    const onLogoClick = () => navigate({ to: '/' });
    const onBenefitsClick = () => navigate({ to: '/benefits' });
    const onLoginClick = () => navigate({ to: '/login' });
    const onProfileClick = () => navigate({ to: '/profile' });

    const { isAuthenticated } = useAuthState()

    return (
        <Box
            position="sticky"
            top={0}
            zIndex={10}
            px="12px"
            py="8px"
            bg="white"
        >
            {/* Серая карточка с хедером */}
            <Box
                bg="rgba(250, 250, 250, 1)"
                borderRadius="16px"
                px="12px"
                py="8px"
                maxW="container.lg"
                mx="auto"
            >
                <Flex align="center" justify="space-between">
                    {/* Логотип слева */}
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
                            width="44"
                            height="44"
                            style={{ display: 'block' }}
                        />
                    </IconButton>

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
