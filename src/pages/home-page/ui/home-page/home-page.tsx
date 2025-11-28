import { Box, Button, Grid, Heading, Image, Show, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { CircleCheckBig, FileCheck, HandHeart } from 'lucide-react'
import { LuSearchCheck } from 'react-icons/lu'

import { useAuthState } from '@/entities/auth'
import bannerDesktopImage from '@/shared/assets/images/banner-desktop.webp'
import mainBannerImage from '@/shared/assets/images/banner-mobile.webp'
import popular1Image from '@/shared/assets/images/popular-1.webp'
import popular2Image from '@/shared/assets/images/popular-2.webp'
import popular3Image from '@/shared/assets/images/popular-3.webp'
import popular4Image from '@/shared/assets/images/popular-4.webp'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'
import { FeatureCard } from '@/shared/ui/feature-card'

export const HomePage = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthState()
    const isOnline = useOnlineStatus()
    const { isDesktop } = useDeviceDetect()

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
            image: popular3Image,
        },
        {
            title: 'Бесплатное лечение',
            image: popular4Image,
        },
    ]

    const features = [
        {
            icon: <HandHeart size={isDesktop ? 40 : 32} />,
            title: 'Нужные льготы — рядом',
            description: 'Без сложных поисков и лишних хлопот',
        },
        {
            icon: <LuSearchCheck size={isDesktop ? 40 : 32} />,
            title: 'Подберём льготы для вас',
            description: 'Учитываем возраст, семью и ситуацию',
        },
        {
            icon: <CircleCheckBig size={isDesktop ? 40 : 32} />,
            title: 'Подскажем, как оформить',
            description: 'Без бюрократии и запутанных слов',
        },
        {
            icon: <FileCheck size={isDesktop ? 40 : 32} />,
            title: 'Поможем с документами',
            description: 'Подскажем списки и что куда нести',
        },
    ]

    return (
        <Box minH='100dvh'>
            <Box
                maxW='1280px'
                mx='auto'
                {...(isDesktop && { pt: '22px' })}
                {...(!isDesktop && { px: '16px' })}
            >
                <VStack align='stretch' gap={{ base: 6, md: 12 }}>
                    {/* Hero Section */}
                    <Box
                        bg={isOnline ? undefined : 'blue.50'}
                        bgSize='cover'
                        borderRadius={{ base: '20px', md: '32px' }}
                        h={{ base: '500px', md: '558px' }}
                        p={{ base: '20px', md: '60px' }}
                        position='relative'
                        bgImage={
                            isOnline
                                ? {
                                      base: `url(${mainBannerImage})`,
                                      md: `url(${bannerDesktopImage})`,
                                  }
                                : undefined
                        }
                        style={
                            isOnline
                                ? {
                                      backgroundPosition: 'center',
                                      backgroundRepeat: 'no-repeat',
                                  }
                                : undefined
                        }
                    >
                        <VStack
                            align='start'
                            gap={{ base: '8px', md: '28px' }}
                            h={{ base: 'auto', md: 'full' }}
                            justify={{ base: 'flex-start', md: 'space-between' }}
                            maxW={{ base: '100%', md: '580px' }}
                        >
                            <VStack align='start' gap={{ base: '10px', md: '16px' }}>
                                <Heading
                                    as='h1'
                                    fontSize={{ base: '3xl', md: '7xl' }}
                                    fontWeight='bold'
                                    lineHeight={{ base: '38px', md: '92px' }}
                                >
                                    Все льготы <Show when={!isDesktop}>—</Show>
                                    <br />в одном месте
                                </Heading>
                                <Text
                                    fontSize={{ base: 'lg', md: '3xl' }}
                                    lineHeight={{ base: '28px', md: '38px' }}
                                >
                                    Найдите все положенные льготы и экономьте на аптечных покупках,
                                    транспорте, ЖКУ и других услугах
                                </Text>
                            </VStack>

                            {/* CTA Button - внутри баннера только на desktop */}
                            <Button
                                _active={{ bg: 'blue.700' }}
                                colorPalette='blue'
                                display={{ base: 'none', md: 'flex' }}
                                fontSize='xl'
                                fontWeight='semibold'
                                lineHeight='30px'
                                rounded='2xl'
                                size='2xl'
                                transition='all 0.2s'
                                variant='solid'
                                w='343px'
                                onClick={() => navigate({ to: '/benefits' })}
                            >
                                Смотреть льготы
                            </Button>
                        </VStack>
                    </Box>

                    {/* CTA Button - вне баннера только на mobile */}
                    <Button
                        _active={{ bg: 'blue.700' }}
                        colorPalette='blue'
                        display={{ base: 'flex', md: 'none' }}
                        fontSize='xl'
                        fontWeight='medium'
                        lineHeight='30px'
                        rounded='2xl'
                        size='2xl'
                        transition='all 0.2s'
                        variant='solid'
                        w='full'
                        colorPalette='blue'
                        onClick={() => navigate({ to: '/benefits' })}
                    >
                        Смотреть льготы
                    </Button>

                    {/* Features Section */}
                    <VStack
                        align='stretch'
                        gap={{ base: 5, md: 8 }}
                        maxW='1020px'
                        mt={{ base: 4, md: 3 }}
                        mx='auto'
                        w='100%'
                    >
                        <Heading
                            as='h2'
                            fontSize={{ base: '2xl', md: '6xl' }}
                            fontWeight='bold'
                            lineHeight={{ base: '32px', md: '72px' }}
                            textAlign={isDesktop ? 'start' : 'center'}
                        >
                            Быстрый и понятный <br />
                            доступ к вашим льготам
                        </Heading>

                        <Grid
                            gap={{ base: 5, md: 8 }}
                            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                        >
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    description={feature.description}
                                    icon={feature.icon}
                                    title={feature.title}
                                />
                            ))}
                        </Grid>
                    </VStack>

                    <VStack
                        align='stretch'
                        gap={{ base: 5, md: 10 }}
                        maxW='1020px'
                        mb={{ base: 0, md: 9 }}
                        mt={{ base: 4, md: 3 }}
                        mx='auto'
                        w='100%'
                    >
                        <Heading
                            as='h2'
                            fontSize={{ base: '2xl', md: '5xl' }}
                            fontWeight='bold'
                            lineHeight={{ base: '32px', md: '60px' }}
                            textAlign={isDesktop ? 'start' : 'center'}
                        >
                            Популярные льготы
                        </Heading>
                        <Grid
                            gap={{ base: 4, md: 12 }}
                            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                        >
                            {popularBenefits.map((benefit, index) => (
                                <Box
                                    key={index}
                                    cursor='pointer'
                                    transition='all 0.2s'
                                    _active={{
                                        transform: 'translateY(2px)',
                                    }}
                                    _hover={{
                                        transform: 'translateY(-6px)',
                                    }}
                                    onClick={() =>
                                        navigate({ to: isAuthenticated ? '/benefits' : '/login' })
                                    }
                                >
                                    <VStack
                                        align='center'
                                        gap={{ base: 2, md: 4 }}
                                        h='full'
                                        justify='center'
                                    >
                                        <Image
                                            alt={benefit.title}
                                            borderRadius={{ base: '16px', md: '20px' }}
                                            h={{ base: '140px', md: '200px' }}
                                            objectFit='cover'
                                            src={benefit.image}
                                            w={{ base: '140px', md: '200px' }}
                                        />
                                        <Text
                                            color='gray.800'
                                            fontSize={{ base: 'xl', md: '2xl' }}
                                            fontWeight='bold'
                                            lineHeight={{ base: '30px', md: '32px' }}
                                            textAlign='center'
                                        >
                                            {benefit.title}
                                        </Text>
                                    </VStack>
                                </Box>
                            ))}
                        </Grid>
                    </VStack>
                </VStack>
            </Box>
        </Box>
    )
}
