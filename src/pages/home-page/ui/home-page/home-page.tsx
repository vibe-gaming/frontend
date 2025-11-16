import { Box, Button, Container, Heading, Link, Stack, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { CircleCheckBig, FileCheck, HandHeart } from 'lucide-react'
import { LuSearchCheck } from 'react-icons/lu'

import { AppHeader } from '@/shared/ui/app-header'
import { FeatureCard } from '@/shared/ui/feature-card'

export const HomePage = () => {
    const navigate = useNavigate()

    const features = [
        {
            icon: <HandHeart />,
            title: 'Нужные льготы — рядом',
            description: 'Без сложных поисков и лишних хлопот',
        },
        {
            icon: <LuSearchCheck />,
            title: 'Подберём льготы для вас',
            description: 'Учитываем возраст, семью и ситуацию',
        },
        {
            icon: <CircleCheckBig />,
            title: 'Подскажем, как оформить',
            description: 'Без бюрократии и запутанных слов',
        },
        {
            icon: <FileCheck />,
            title: 'Поможем с документами',
            description: 'Подскажем списки и что куда нести',
        },
    ]

    const helpItems = ['Как пользоваться', 'Частые вопросы', 'Поддержка']

    const aboutItems = ['Конфиденциальность', 'Условия использования', 'Контакты']

    return (
        <Box bg="gray.50" minH="100vh">
            {/* Header */}
            <AppHeader
                onLogoClick={() => navigate({ to: '/' })}
                onHomeClick={() => navigate({ to: '/' })}
                onLoginClick={() => navigate({ to: '/login' })}
                onProfileClick={() => navigate({ to: '/profile' })}
            />

            <Container maxW="container.lg" pb="16px" pt="16px" px="16px">
                <VStack align="stretch" gap="10px">
                    {/* Hero Section */}
                    <Box bg="blue.50" borderRadius="16px" p="20px">
                        <VStack align="start" gap="10px">
                            <Heading
                                as="h1"
                                fontSize={{ base: '2xl', md: '3xl' }}
                                fontWeight="bold"
                                lineHeight="shorter"
                            >
                                Все льготы — в одном месте
                            </Heading>
                            <Text color="gray.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall">
                                Найдите все положенные льготы и экономьте на аптечных покупках,
                                транспорте, ЖКУ и других услугах
                            </Text>
                        </VStack>
                    </Box>

                    {/* Features Section */}
                    <VStack align="stretch" gap="10px">
                        <Heading
                            as="h2"
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight="bold"
                            textAlign="center"
                            lineHeight="shorter"
                        >
                            Быстрый и понятный доступ к вашим льготам
                        </Heading>

                        <Stack gap="10px">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            ))}
                        </Stack>

                        {/* CTA Button */}
                        <Button
                            bg="blue.solid"
                            borderRadius="16px"
                            color="white"
                            fontWeight="semibold"
                            fontSize="md"
                            h="56px"
                            mt="10px"
                            size="lg"
                            w="full"
                            _hover={{ bg: 'blue.600' }}
                            onClick={() => navigate({ to: '/benefits' })}
                        >
                            Получить льготу
                        </Button>
                    </VStack>

                    {/* Combined Info Section */}
                    <Box bg="white" borderRadius="16px" p="20px">
                        <VStack align="start" gap="20px" w="full">
                            {/* My Benefits */}
                            <VStack align="start" gap="10px" w="full">
                                <Heading as="h3" fontSize="lg" fontWeight="bold">
                                    Мои льготы
                                </Heading>
                                <Text color="gray.600" fontSize="sm" lineHeight="tall">
                                    Сервис для поиска и получения социальных льгот
                                </Text>
                            </VStack>

                            {/* Help Section */}
                            <VStack align="start" gap="16px" w="full">
                                <Heading as="h3" fontSize="lg" fontWeight="bold">
                                    Помощь
                                </Heading>
                                <VStack align="start" gap="12px" w="full">
                                    {helpItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            color="gray.700"
                                            fontSize="sm"
                                            w="full"
                                            cursor="pointer"
                                            _hover={{ color: 'blue.500', textDecoration: 'none' }}
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </VStack>
                            </VStack>

                            {/* About Section */}
                            <VStack align="start" gap="16px" w="full">
                                <Heading as="h3" fontSize="lg" fontWeight="bold">
                                    О сервисе
                                </Heading>
                                <VStack align="start" gap="12px" w="full">
                                    {aboutItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            color="gray.700"
                                            fontSize="sm"
                                            w="full"
                                            cursor="pointer"
                                            _hover={{ color: 'blue.500', textDecoration: 'none' }}
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </VStack>
                            </VStack>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    )
}
