import { Button, Box, Text, VStack } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
    onEnter: () => {
        document.title = 'Авторизация'
    },
    component: LoginPage,
})

function LoginPage() {
    return (
        <Box p={8}>
            <VStack gap={4} align="center">
                <Text fontSize="2xl" fontWeight="bold">
                    LoginPage
                </Text>
                <Button bg="brand.500" color="white" size="lg" _hover={{ bg: 'brand.600' }}>
                    Брендовая (тёмно-зелёная)
                </Button>
                <Button bg="accent.500" color="white" _hover={{ bg: 'accent.600' }}>
                    Акцентная (синяя)
                </Button>
                <Button bg="success.500" color="white" _hover={{ bg: 'success.600' }}>
                    Успех (зелёная)
                </Button>
                <Button bg="error.500" color="white" _hover={{ bg: 'error.600' }}>
                    Ошибка (красная)
                </Button>
                <Button bg="warning.500" color="black" _hover={{ bg: 'warning.600' }}>
                    Предупреждение (жёлтая)
                </Button>
                <Button bg="info.500" color="white" _hover={{ bg: 'info.600' }}>
                    Информация (синяя)
                </Button>
                <Button bg="primary.500" color="white" _hover={{ bg: 'primary.600' }}>
                    Primary (тёмно-зелёная)
                </Button>
            </VStack>
        </Box>
    )
}
