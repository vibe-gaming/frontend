import { Box, Button, Center, Heading, Text } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/entities/auth'
import { HeaderMobile } from '@/shared/ui/header-mobile'

export const RegisterCheckInfoPage = () => {
    const { profile, isLoading } = useAuth()
    const navigate = useNavigate()

    const fullName = [profile?.last_name, profile?.first_name, profile?.middle_name]
        .filter(Boolean)
        .join(' ')

    return (
        <Box bg='gray.50' minH='100dvh' paddingTop='56px' w='100dvw'>
            <HeaderMobile title='Проверьте ваши данные' />

            <Center pt='24px' px='16px'>
                <Box display='flex' flexDirection='column' gap='24px' w='100%'>
                    <Box bg='white' borderRadius='24px' boxShadow='sm' p='16px'>
                        <Box display='flex' flexDirection='column' gap='12px'>
                            <Heading as='h2' color='gray.800' fontSize='18px' fontWeight={600}>
                                Ваши данные
                            </Heading>

                            {isLoading ? (
                                <Text color='gray.500' fontSize='sm'>
                                    Загружаем данные профиля...
                                </Text>
                            ) : (
                                <Box display='flex' flexDirection='column' gap='8px'>
                                    <Box>
                                        <Text color='gray.500' fontSize='12px' mb='2px'>
                                            ФИО
                                        </Text>
                                        <Text color='gray.900' fontSize='14px'>
                                            {fullName || '—'}
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Text color='gray.500' fontSize='12px' mb='2px'>
                                            СНИЛС
                                        </Text>
                                        <Text color='gray.900' fontSize='14px'>
                                            {profile?.snils || '—'}
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Text color='gray.500' fontSize='12px' mb='2px'>
                                            Телефон
                                        </Text>
                                        <Text color='gray.900' fontSize='14px'>
                                            {profile?.phone_number || '—'}
                                        </Text>
                                    </Box>

                                    <Box>
                                        <Text color='gray.500' fontSize='12px' mb='2px'>
                                            Email
                                        </Text>
                                        <Text color='gray.900' fontSize='14px'>
                                            {profile?.email || '—'}
                                        </Text>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Button
                        borderRadius='999px'
                        colorScheme='blue'
                        h='56px'
                        w='100%'
                        onClick={() => navigate({ to: '/register/category' })}
                    >
                        Далее
                    </Button>
                </Box>
            </Center>
        </Box>
    )
}
