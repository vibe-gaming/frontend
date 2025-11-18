import { Box, Flex, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react'

import logoIcon from '@/shared/assets/icons/logo.svg'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export const Footer = () => {
    const helpItems = ['Как пользоваться', 'Поддержка']
    const aboutItems = ['Контакты', 'Конфиденциальность', 'Условия использования']

    const { isDesktop } = useDeviceDetect()

    return (
        <Box
            bg='gray.100'
            borderTopRadius={'2xl'}
            maxW='1280px'
            mt={isDesktop ? '12' : '10'}
            mx='auto'
            pb='48px'
            pt='24px'
            px={{ base: '16px', lg: '60px' }}
            w='100%'
        >
            {/* Mobile: Vertical layout */}
            <VStack align='start' display={{ base: 'flex', lg: 'none' }} gap='20px' w='full'>
                {/* My Benefits */}
                <VStack align='start' gap='10px' w='full'>
                    <HStack align='center' gap='10px'>
                        <img
                            alt='Логотип'
                            height='48'
                            src={logoIcon}
                            style={{ display: 'block' }}
                            width='48'
                        />
                        <Heading as='h3' fontSize='3xl' fontWeight='extrabold' lineHeight='40px'>
                            мои
                            <Text
                                as='span'
                                color='blue.solid'
                                fontWeight='extrabold'
                                lineHeight='40px'
                            >
                                льготы
                            </Text>
                        </Heading>
                    </HStack>
                    <Text color='gray.600' fontSize='lg' lineHeight='28px'>
                        Сервис для поиска и получения социальных льгот
                    </Text>
                </VStack>

                {/* Help Section */}
                <VStack align='start' gap='8px' w='full'>
                    <Heading as='h3' fontSize='xl' fontWeight='bold' lineHeight='32px'>
                        Помощь
                    </Heading>
                    <VStack align='start' gap='8px' w='full'>
                        {helpItems.map((item, index) => (
                            <Link
                                key={index}
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                                color='gray.700'
                                cursor='pointer'
                                fontSize='lg'
                                lineHeight='28px'
                                w='full'
                            >
                                {item}
                            </Link>
                        ))}
                    </VStack>
                </VStack>

                {/* About Section */}
                <VStack align='start' gap='8px' w='full'>
                    <Heading as='h3' fontSize='xl' fontWeight='bold' lineHeight='30px'>
                        О сервисе
                    </Heading>
                    <VStack align='start' gap='8px' w='full'>
                        {aboutItems.map((item, index) => (
                            <Link
                                key={index}
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                                color='gray.700'
                                cursor='pointer'
                                fontSize='lg'
                                lineHeight='28px'
                                w='full'
                            >
                                {item}
                            </Link>
                        ))}
                    </VStack>
                </VStack>
            </VStack>

            {/* Desktop: Horizontal layout */}
            <Flex display={{ base: 'none', lg: 'flex' }} gap='24px' w='full'>
                {/* My Benefits - Left */}
                <VStack align='start' flex='0 1 570px' gap='12px'>
                    <HStack align='center' gap='12px'>
                        <img
                            alt='Логотип'
                            height='56'
                            src={logoIcon}
                            style={{ display: 'block' }}
                            width='56'
                        />
                        <Heading as='h3' fontSize='32px' fontWeight='extrabold' lineHeight='40px'>
                            мои
                            <Text
                                as='span'
                                color='blue.solid'
                                fontWeight='extrabold'
                                lineHeight='40px'
                            >
                                льготы
                            </Text>
                        </Heading>
                    </HStack>
                    <Text color='gray.600' fontSize='lg' lineHeight='28px'>
                        Сервис для поиска и получения социальных льгот
                    </Text>
                </VStack>

                {/* Help Section - Center */}
                <VStack align='start' flex='0 1 250px' gap='12px'>
                    <Heading as='h3' fontSize='2xl' fontWeight='bold' lineHeight='32px'>
                        Помощь
                    </Heading>
                    <VStack align='start' gap='8px'>
                        {helpItems.map((item, index) => (
                            <Link
                                key={index}
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                                color='gray.700'
                                cursor='pointer'
                                fontSize='lg'
                                lineHeight='28px'
                            >
                                {item}
                            </Link>
                        ))}
                    </VStack>
                </VStack>

                {/* About Section - Right */}
                <VStack align='start' flex='0 1 250px' gap='12px'>
                    <Heading as='h3' fontSize='2xl' fontWeight='bold' lineHeight='32px'>
                        О сервисе
                    </Heading>
                    <VStack align='start' gap='8px'>
                        {aboutItems.map((item, index) => (
                            <Link
                                key={index}
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                                color='gray.700'
                                cursor='pointer'
                                fontSize='lg'
                                lineHeight='28px'
                            >
                                {item}
                            </Link>
                        ))}
                    </VStack>
                </VStack>
            </Flex>
        </Box>
    )
}
