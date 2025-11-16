import { Box, Button, Flex } from '@chakra-ui/react'

export interface AppHeaderProps {
    onLogoClick?: () => void
    onLoginClick?: () => void
    showLogin?: boolean
}

export const AppHeader = ({ onLogoClick, onLoginClick, showLogin = true }: AppHeaderProps) => {
    return (
        <Box
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            position="sticky"
            top={0}
            zIndex={10}
            px="16px"
            py="12px"
        >
            <Flex align="center" justify="space-between" maxW="container.lg" mx="auto">
                <Button
                    bg="blue.solid"
                    borderRadius="16px"
                    color="white"
                    fontWeight="bold"
                    size="md"
                    minW="48px"
                    h="48px"
                    _hover={{ bg: 'blue.solid' }}
                    onClick={onLogoClick}
                >
                    О
                </Button>
                {showLogin && (
                    <Button
                        bg="blue.solid"
                        borderRadius="16px"
                        color="white"
                        fontWeight="medium"
                        size="md"
                        px="32px"
                        h="48px"
                        _hover={{ bg: 'blue.solid' }}
                        onClick={onLoginClick}
                    >
                        Войти
                    </Button>
                )}
            </Flex>
        </Box>
    )
}

