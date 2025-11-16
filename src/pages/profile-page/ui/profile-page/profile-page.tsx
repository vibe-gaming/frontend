import { Box, Button, Container, Heading, Spinner, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/entities/auth'
import { AppHeader } from '@/shared/ui/app-header'

export const ProfilePage = () => {
    const { profile, isLoading } = useAuth()
    const navigate = useNavigate()

    const fullName = [profile?.last_name, profile?.first_name, profile?.middle_name]
        .filter(Boolean)
        .join(' ')

    if (isLoading) {
        return (
            <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
                <Spinner color="blue.500" size="xl" />
            </Box>
        )
    }

    return (
        <Box bg="gray.50" minH="100vh">
            {/* Header */}
            <AppHeader />

            <Container maxW="container.lg" pb="16px" pt="16px" px="16px">
                <VStack align="stretch" gap="16px">
                    {/* Header */}
                    <Box>
                        <Heading as="h1" fontSize="2xl" fontWeight="bold" mb="8px">
                            Личный кабинет
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Ваши данные и настройки профиля
                        </Text>
                    </Box>

                    {/* Profile Info Card */}
                    <Box bg="white" borderRadius="16px" p="20px">
                        <VStack align="stretch" gap="16px">
                            <Heading as="h2" fontSize="lg" fontWeight="bold">
                                Личные данные
                            </Heading>

                            <VStack align="stretch" gap="12px">
                                <Box>
                                    <Text color="gray.500" fontSize="xs" mb="4px">
                                        ФИО
                                    </Text>
                                    <Text color="gray.900" fontSize="md" fontWeight="medium">
                                        {fullName || '—'}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text color="gray.500" fontSize="xs" mb="4px">
                                        СНИЛС
                                    </Text>
                                    <Text color="gray.900" fontSize="md" fontWeight="medium">
                                        {profile?.snils || '—'}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text color="gray.500" fontSize="xs" mb="4px">
                                        Телефон
                                    </Text>
                                    <Text color="gray.900" fontSize="md" fontWeight="medium">
                                        {profile?.phone_number || '—'}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text color="gray.500" fontSize="xs" mb="4px">
                                        Email
                                    </Text>
                                    <Text color="gray.900" fontSize="md" fontWeight="medium">
                                        {profile?.email || '—'}
                                    </Text>
                                </Box>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Navigation Buttons */}
                    <VStack align="stretch" gap="10px">
                        <Button
                            bg="blue.solid"
                            borderRadius="16px"
                            color="white"
                            fontWeight="semibold"
                            fontSize="md"
                            h="56px"
                            _hover={{ bg: 'blue.600' }}
                            onClick={() => navigate({ to: '/benefits' })}
                        >
                            Мои льготы
                        </Button>

                        <Button
                            borderRadius="16px"
                            variant="outline"
                            fontWeight="semibold"
                            fontSize="md"
                            h="56px"
                            onClick={() => navigate({ to: '/' })}
                        >
                            На главную
                        </Button>
                    </VStack>
                </VStack>
            </Container>
        </Box>
    )
}
