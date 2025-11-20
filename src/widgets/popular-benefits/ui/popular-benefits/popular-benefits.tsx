import { Box, Button, Heading, Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'

import { useGetBenefits } from '@/shared/api/generated/hooks/useGetBenefits'
import type { V1BenefitsListResponse } from '@/shared/api/generated'

export const PopularBenefits = () => {
    const navigate = useNavigate()
    const { data, isLoading, isError, error } = useGetBenefits<V1BenefitsListResponse>({ limit: 10 })

    const handleShowMore = () => {
        navigate({ to: '/benefits' })
    }

    // Отладка
    if (process.env.NODE_ENV === 'development') {
        console.log('PopularBenefits:', { data, isLoading, isError, error })
    }

    if (isLoading) {
        return (
            <Box p={8} textAlign='center'>
                <Spinner size='lg' />
            </Box>
        )
    }

    if (isError) {
        const errorMessage = error && typeof error === 'object' && 'error_message' in error 
            ? String(error.error_message) 
            : null;
        
        return (
            <Box p={8}>
                <Text color='error.DEFAULT'>Не удалось загрузить льготы</Text>
                {errorMessage && (
                    <Text color='text.secondary' fontSize='sm' mt={2}>
                        {errorMessage}
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
            <VStack align='stretch' gap={6}>
                <Heading size='lg'>Популярные льготы</Heading>

                <Stack gap={4}>
                    {data.benefits.map((benefit) => (
                        <Box
                            key={benefit.id}
                            bg='background.surface'
                            borderColor='border.primary'
                            borderRadius='md'
                            borderWidth='1px'
                            p={4}
                        >
                            <VStack align='stretch' gap={2}>
                                <Heading size='md'>{benefit.title || 'Без названия'}</Heading>
                                {benefit.description && (
                                    <Text
                                        color='text.secondary'
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
                                    <Text color='text.secondary' fontSize='sm'>
                                        Тип: {benefit.type}
                                    </Text>
                                )}
                            </VStack>
                        </Box>
                    ))}
                </Stack>

                <Button
                    _hover={{ bg: 'brand.600' }}
                    bg='brand.500'
                    color='white'
                    size='lg'
                    onClick={handleShowMore}
                >
                    Посмотреть больше
                </Button>
            </VStack>
        </Box>
    )
}
