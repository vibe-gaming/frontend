import { Box, Flex, IconButton, Button, HStack } from '@chakra-ui/react'
import { Heart, User } from 'lucide-react'

import { useAuthState } from '@/entities/auth'

export interface AppHeaderProps {
    onLogoClick?: () => void
    onHomeClick?: () => void
    onProfileClick?: () => void
    onLoginClick?: () => void
}

export const AppHeader = ({
    onLogoClick,
    onHomeClick,
    onProfileClick,
    onLoginClick,
}: AppHeaderProps) => {
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
                        bg="blue.solid"
                        borderRadius="16px"
                        color="white"
                        size="lg"
                        minW="48px"
                        h="48px"
                        _hover={{ bg: 'blue.600' }}
                        onClick={onLogoClick}
                    >
                        <Heart size={24} fill="white" />
                    </IconButton>

                    {/* Кнопка "Главная" и иконка профиля справа */}
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
                            onClick={onHomeClick}
                        >
                            Главная
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
