import { Box, Button, Container, Grid, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { CircleCheckBig, FileCheck, HandHeart } from 'lucide-react'
import { LuSearchCheck } from 'react-icons/lu'

import { useAuthState } from '@/entities/auth'
import { AppHeader } from '@/shared/ui/app-header'
import { Footer } from '@/shared/ui/footer'
import { FeatureCard } from '@/shared/ui/feature-card'

import mainBannerImage from '@/shared/assets/images/main-banner.png'
import popular1Image from '@/shared/assets/images/popular-1.png'
import popular2Image from '@/shared/assets/images/popular-2.png'
import popular3Image from '@/shared/assets/images/popular-3.png'
import popular4Image from '@/shared/assets/images/popular-4.png'

export const HomePage = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthState()

    const popularBenefits = [
        {
            title: 'Бесплатные лекарства',
            image: popular1Image,
        },
        {
            title: 'Ежемесячные выплаты',
            image: popular2Image,
        },
        {
            title: 'Льготный проездной',
            image: popular4Image,
        },
        {
            title: 'Бесплатное лечение',
            image: popular3Image,
        },
    ]

    const features = [
        {
            icon: <HandHeart size={32} />,
            title: 'Нужные льготы — рядом',
            description: 'Без сложных поисков и лишних хлопот',
        },
        {
            icon: <LuSearchCheck size={32} />,
            title: 'Подберём льготы для вас',
            description: 'Учитываем возраст, семью и ситуацию',
        },
        {
            icon: <CircleCheckBig size={32} />,
            title: 'Подскажем, как оформить',
            description: 'Без бюрократии и запутанных слов',
        },
        {
            icon: <FileCheck size={32} />,
            title: 'Поможем с документами',
            description: 'Подскажем списки и что куда нести',
        },
    ]

    return (
        <Box minH="100vh">
            <AppHeader />

            <Container maxW="container.lg" pb="54px" pt="16px" px="16px">
                <VStack align="stretch" gap={6}>
                    {/* Hero Section */}
                    <Box
                        bgImage={`url(${mainBannerImage})`}
                        bgSize="cover"
                        borderRadius="20px"
                        h="500px"
                        p="20px"
                        position="relative"
                        style={{
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <VStack align="start" gap="10px">
                            <Heading
                                as="h1"
                                fontSize={{ base: '3xl', md: '3xl' }}
                                fontWeight="bold"
                                lineHeight="38px"
                            >
                                Все льготы —<br />в одном месте
                            </Heading>
                            <Text 
                            color="gray.800" 
                            fontSize={{ base: 'lg', md: 'xl' }} 
                            lineHeight="28px"
                            >
                                Найдите все положенные льготы и экономьте на аптечных покупках,
                                транспорте, ЖКУ и других услугах
                            </Text>
                        </VStack>
                    </Box>

                    {/* CTA Button */}
                    <Button
                            bg="blue.solid"
                            borderRadius="16px"
                            fontWeight="semibold"
                            fontSize="xl"
                            lineHeight="30px"
                            size="2xl"
                            w="full"
                            _hover={{ bg: 'blue.600' }}
                            onClick={() => navigate({ to: '/benefits' })}
                        >
                            Смотреть льготы
                        </Button>

                    {/* Features Section */}
                    <VStack align="stretch" gap={5}>
                        <Heading
                            as="h2"
                            fontSize={{ base: '2xl', md: '3xl' }}
                            fontWeight="bold"
                            lineHeight="32px"
                            textAlign="center"
                            mt={4}
                        >
                            Быстрый и понятный доступ к вашим льготам
                        </Heading>

                        <Stack gap={5}>
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            ))}
                        </Stack>
                    </VStack>

                    {/* Popular Benefits Section - только для неавторизованных */}
                    {!isAuthenticated && (
                        <VStack align="stretch" gap={5} py={5}>
                            <Heading
                                as="h2"
                                fontSize={{ base: '2xl', md: '3xl' }}
                                fontWeight="bold"
                                lineHeight="32px"
                                textAlign="center"
                            >
                                Популярные льготы
                            </Heading>
                            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' }} gap={4}>
                                {popularBenefits.map((benefit, index) => (
                                    <Box
                                        key={index}
                                        borderRadius="16px"
                                        cursor="pointer"
                                        h="208px"
                                        onClick={() => navigate({ to: '/login' })}
                                        transition="all 0.2s"
                                        _hover={{
                                            bg: 'gray.300',
                                            transform: 'scale(1.02)',
                                        }}
                                    >
                                        <VStack
                                            align="center"
                                            h="full"
                                            justify="center"
                                            gap={2}
                                        >
                                            <Image
                                                src={benefit.image}
                                                alt={benefit.title}
                                                borderRadius="16px"
                                                h="140px"
                                                w="140px"
                                                objectFit="cover"
                                            />
                                            <Text
                                                color="gray.800"
                                                fontSize="xl"
                                                fontWeight="bold"
                                                lineHeight="30px"
                                                textAlign="center"
                                            >
                                                {benefit.title}
                                            </Text>
                                        </VStack>
                                    </Box>
                                ))}
                            </Grid>
                        </VStack>
                    )}

                    <Footer />
                </VStack>
            </Container>
        </Box>
    )
}
