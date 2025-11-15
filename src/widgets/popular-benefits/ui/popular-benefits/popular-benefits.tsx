import { Box, Button, Heading, Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'

import { useGetBenefits } from '@/shared/api/generated/hooks/useGetBenefits'

export const PopularBenefits = () => {
    const navigate = useNavigate()
    const { data, isLoading, isError, error } = useGetBenefits({ limit: 10 })

    const handleShowMore = () => {
        navigate({ to: '/benefits' })
    }

    // Отладка
    if (process.env.NODE_ENV === 'development') {
        console.log('PopularBenefits:', { data, isLoading, isError, error })
    }

    if (isLoading) {
        return (
            <Box p={8} textAlign="center">
                <Spinner size="lg" />
            </Box>
        )
    }

    if (isError) {
        return (
            <Box p={8}>
                <Text color="error.DEFAULT">Не удалось загрузить льготы</Text>
                {error && 'error_message' in error && error.error_message && (
                    <Text fontSize="sm" color="text.secondary" mt={2}>
                        {error.error_message}
                    </Text>
                )}
            </Box>
        )
    }

    if (!data?.benefits || data.benefits.length === 0) {
        return (
            <Box p={8}>
                <Text>Льготы не найдены</Text>
            </Box>
        )
    }

    return (
        <Box p={8}>
            <VStack gap={6} align="stretch">
                <Heading size="lg">Популярные льготы</Heading>

                <Stack gap={4}>
                    {data.benefits.map((benefit) => (
                        <Box
                            key={benefit.id}
                            p={4}
                            borderRadius="md"
                            bg="background.surface"
                            borderWidth="1px"
                            borderColor="border.primary"
                        >
                            <VStack align="stretch" gap={2}>
                                <Heading size="md">{benefit.title || 'Без названия'}</Heading>
                                {benefit.description && (
                                    <Text
                                        color="text.secondary"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {benefit.description}
                                    </Text>
                                )}
                                {benefit.type && (
                                    <Text fontSize="sm" color="text.secondary">
                                        Тип: {benefit.type}
                                    </Text>
                                )}
                            </VStack>
                        </Box>
                    ))}
                </Stack>

                <Button
                    bg="brand.500"
                    color="white"
                    size="lg"
                    onClick={handleShowMore}
                    _hover={{ bg: 'brand.600' }}
                >
                    Посмотреть больше
                </Button>
            </VStack>
        </Box>
    )
}

