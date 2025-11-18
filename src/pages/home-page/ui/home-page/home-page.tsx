import { Box, Button, Grid, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react'
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

            <Box 
                pb="54px" 
                pt="16px" 
                px={{ base: '16px', lg: '80px' }}
            >
                <VStack align="stretch" gap={{ base: 6, lg: 8 }} maxW="1440px" mx="auto">
                    {/* Hero Section */}
                    <Box
                        bgImage={`url(${mainBannerImage})`}
                        bgSize="cover"
                        borderRadius={{ base: '20px', lg: '32px' }}
                        h={{ base: '500px', lg: '480px' }}
                        p={{ base: '20px', lg: '48px' }}
                        position="relative"
                        style={{
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <VStack 
                            align="start" 
                            gap={{ base: '10px', lg: '16px' }}
                            maxW={{ base: '100%', lg: '580px' }}
                        >
                            <Heading
                                as="h1"
                                fontSize={{ base: '3xl', lg: '56px' }}
                                fontWeight="bold"
                                lineHeight={{ base: '38px', lg: '64px' }}
                            >
                                Все льготы —<br />в одном месте
                            </Heading>
                            <Text 
                                color="gray.800" 
                                fontSize={{ base: 'lg', lg: '24px' }} 
                                lineHeight={{ base: '28px', lg: '36px' }}
                            >
                                Найдите все положенные льготы и экономьте на аптечных покупках,
                                транспорте, ЖКУ и других услугах
                            </Text>
                        </VStack>
                    </Box>

                    {/* CTA Button */}
                    <Button
                        bg="blue.solid"
                        borderRadius={{ base: '16px', lg: '20px' }}
                        fontWeight="semibold"
                        fontSize={{ base: 'xl', lg: '24px' }}
                        lineHeight={{ base: '30px', lg: '36px' }}
                        size="2xl"
                        h={{ base: 'auto', lg: '64px' }}
                        w={{ base: 'full', lg: '280px' }}
                        alignSelf={{ base: 'stretch', lg: 'flex-start' }}
                        _hover={{ bg: 'blue.600' }}
                        onClick={() => navigate({ to: '/benefits' })}
                    >
                        Смотреть льготы
                    </Button>

                    {/* Features Section */}
                    <VStack align="stretch" gap={{ base: 5, lg: 8 }} mt={{ base: 0, lg: 4 }}>
                        <Heading
                            as="h2"
                            fontSize={{ base: '2xl', lg: '48px' }}
                            fontWeight="bold"
                            lineHeight={{ base: '32px', lg: '56px' }}
                            textAlign="center"
                            mt={4}
                        >
                            Быстрый и понятный доступ к вашим льготам
                        </Heading>

                        <Grid 
                            templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} 
                            gap={{ base: 5, lg: 6 }}
                        >
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            ))}
                        </Grid>
                    </VStack>

                    {/* Popular Benefits Section - только для неавторизованных */}
                    {!isAuthenticated && (
                        <VStack align="stretch" gap={{ base: 5, lg: 8 }} py={{ base: 5, lg: 8 }}>
                            <Heading
                                as="h2"
                                fontSize={{ base: '2xl', lg: '48px' }}
                                fontWeight="bold"
                                lineHeight={{ base: '32px', lg: '56px' }}
                                textAlign="center"
                            >
                                Популярные льготы
                            </Heading>
                            <Grid 
                                templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} 
                                gap={{ base: 4, lg: 6 }}
                            >
                                {popularBenefits.map((benefit, index) => (
                                    <Box
                                        key={index}
                                        borderRadius={{ base: '16px', lg: '20px' }}
                                        cursor="pointer"
                                        h={{ base: '208px', lg: '240px' }}
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
                                            gap={{ base: 2, lg: 3 }}
                                        >
                                            <Image
                                                src={benefit.image}
                                                alt={benefit.title}
                                                borderRadius={{ base: '16px', lg: '20px' }}
                                                h={{ base: '140px', lg: '160px' }}
                                                w={{ base: '140px', lg: '160px' }}
                                                objectFit="cover"
                                            />
                                            <Text
                                                color="gray.800"
                                                fontSize={{ base: 'xl', lg: '22px' }}
                                                fontWeight="bold"
                                                lineHeight={{ base: '30px', lg: '32px' }}
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
            </Box>
        </Box>
    )
}
