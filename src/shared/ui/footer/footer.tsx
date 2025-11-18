import { Box, Flex, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react'
import logoIcon from '@/shared/assets/icons/logo.svg'

export const Footer = () => {
    const helpItems = ['Как пользоваться', 'Поддержка']
    const aboutItems = ['Контакты', 'Конфиденциальность', 'Условия использования']

    return (
        <Box 
            bg="gray.100" 
            borderRadius={"2xl"} 
            px={{ base: 5, lg: 10 }} 
            py={{ base: 6, lg: 10 }} 
            mx={{ base: "-16px", lg: 0 }}
        >
            {/* Mobile: Vertical layout */}
            <VStack 
                align="start" 
                gap="20px" 
                w="full"
                display={{ base: 'flex', lg: 'none' }}
            >
                {/* My Benefits */}
                <VStack align="start" gap="10px" w="full">
                    <HStack align="center" gap="10px">
                        <img
                            src={logoIcon}
                            alt="Логотип"
                            width="48"
                            height="48"
                            style={{ display: 'block' }}
                        />
                        <Heading as="h3" fontSize="3xl" fontWeight="extrabold" lineHeight="40px" >
                            мои<Text as="span" color="blue.solid" fontWeight="extrabold" lineHeight="40px">льготы</Text>
                        </Heading>
                    </HStack>
                    <Text color="gray.600" fontSize="lg" lineHeight="28px">
                        Сервис для поиска и получения социальных льгот
                    </Text>
                </VStack>

                {/* Help Section */}
                <VStack align="start" gap="8px" w="full">
                    <Heading as="h3" fontSize="xl" fontWeight="bold" lineHeight="32px">
                        Помощь
                    </Heading>
                    <VStack align="start" gap="8px" w="full">
                        {helpItems.map((item, index) => (
                            <Link
                                key={index}
                                color="gray.700"
                                fontSize="lg"
                                lineHeight="28px"
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
                <VStack align="start" gap="8px" w="full">
                    <Heading as="h3" fontSize="xl" fontWeight="bold" lineHeight="30px">
                        О сервисе
                    </Heading>
                    <VStack align="start" gap="8px" w="full">
                        {aboutItems.map((item, index) => (
                            <Link
                                key={index}
                                color="gray.700"
                                fontSize="lg"
                                lineHeight="28px"
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

            {/* Desktop: Horizontal layout */}
            <Flex 
                gap="80px" 
                w="full"
                display={{ base: 'none', lg: 'flex' }}
                justify="space-between"
            >
                {/* My Benefits - Left */}
                <VStack align="start" gap="12px" flex="0 0 auto" maxW="420px">
                    <HStack align="center" gap="12px">
                        <img
                            src={logoIcon}
                            alt="Логотип"
                            width="56"
                            height="56"
                            style={{ display: 'block' }}
                        />
                        <Heading as="h3" fontSize="32px" fontWeight="extrabold" lineHeight="40px">
                            мои<Text as="span" color="blue.solid" fontWeight="extrabold" lineHeight="40px">льготы</Text>
                        </Heading>
                    </HStack>
                    <Text color="gray.600" fontSize="lg" lineHeight="28px">
                        Сервис для поиска и получения социальных льгот
                    </Text>
                </VStack>

                {/* Help Section - Center */}
                <VStack align="start" gap="12px" flex="0 0 auto">
                    <Heading as="h3" fontSize="2xl" fontWeight="bold" lineHeight="32px">
                        Помощь
                    </Heading>
                    <VStack align="start" gap="8px">
                        {helpItems.map((item, index) => (
                            <Link
                                key={index}
                                color="gray.700"
                                fontSize="lg"
                                lineHeight="28px"
                                cursor="pointer"
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                            >
                                {item}
                            </Link>
                        ))}
                    </VStack>
                </VStack>

                {/* About Section - Right */}
                <VStack align="start" gap="12px" flex="0 0 auto">
                    <Heading as="h3" fontSize="2xl" fontWeight="bold" lineHeight="32px">
                        О сервисе
                    </Heading>
                    <VStack align="start" gap="8px">
                        {aboutItems.map((item, index) => (
                            <Link
                                key={index}
                                color="gray.700"
                                fontSize="lg"
                                lineHeight="28px"
                                cursor="pointer"
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
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

