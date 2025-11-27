import { Box, Text } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { AuthButtonBox, AuthHeading, AuthPageBox, useAuth } from '@/entities/auth'
import { AuthButton } from '@/entities/auth/ui/auth-button'
import { AuthContentBox } from '@/entities/auth/ui/auth-content-box'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'
import { formatPhoneNumber } from '@/shared/utils/format-phone-number'
import { formatSnils } from '@/shared/utils/format-snils'

export const RegisterCheckInfoPage = () => {
    const { profile, isLoading } = useAuth()
    const navigate = useNavigate()

    const fullName = [profile?.last_name, profile?.first_name, profile?.middle_name]
        .filter(Boolean)
        .join(' ')

    const { isDesktop } = useDeviceDetect()

    return (
        <AuthPageBox>
            <AuthContentBox>
                <AuthHeading>Проверьте ваши данные</AuthHeading>
                <Box display='flex' flexDirection='column' flexGrow={1} mt='6'>
                    <Box
                        display='flex'
                        flexDirection='column'
                        flexGrow={1}
                        w='100%'
                        {...(!isDesktop && { gap: '6' })}
                    >
                        <Box
                            bg={isDesktop ? '#FAFAFA' : 'white'}
                            border={isDesktop ? 'none' : '1px solid'}
                            borderColor='blue.200'
                            borderRadius='20px'
                            p='16px'
                        >
                            {isLoading ? (
                                <Text color='gray.500' fontSize='sm'>
                                    Загружаем данные профиля...
                                </Text>
                            ) : (
                                <Box display='flex' flexDirection='column' gap='12px'>
                                    <Box display='flex' flexDirection='column' gap='16px'>
                                        <Box display='flex' flexDirection='column' gap='4px'>
                                            <Text color='gray.800' fontSize='lg' fontWeight='bold'>
                                                ФИО
                                            </Text>
                                            <Text
                                                color='#52525B'
                                                fontSize='lg'
                                                fontWeight='normal'
                                                lineHeight='28px'
                                            >
                                                {fullName || '—'}
                                            </Text>
                                        </Box>

                                        <Box display='flex' flexDirection='column' gap='4px'>
                                            <Text color='gray.800' fontSize='lg' fontWeight='bold'>
                                                Телефон
                                            </Text>
                                            <Text
                                                color='#52525B'
                                                fontSize='lg'
                                                fontWeight='normal'
                                                lineHeight='28px'
                                            >
                                                {formatPhoneNumber(profile?.phone_number) || '—'}
                                            </Text>
                                        </Box>

                                        <Box display='flex' flexDirection='column' gap='4px'>
                                            <Text color='gray.800' fontSize='lg' fontWeight='bold'>
                                                СНИЛС
                                            </Text>
                                            <Text
                                                color='#52525B'
                                                fontSize='lg'
                                                fontWeight='normal'
                                                lineHeight='28px'
                                            >
                                                {formatSnils(profile?.snils) || '—'}
                                            </Text>
                                        </Box>

                                        <Box display='flex' flexDirection='column' gap='4px'>
                                            <Text color='gray.800' fontSize='lg' fontWeight='bold'>
                                                Почта
                                            </Text>
                                            <Text
                                                color='#52525B'
                                                fontSize='lg'
                                                fontWeight='normal'
                                                lineHeight='28px'
                                            >
                                                {profile?.email || '—'}
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <AuthButtonBox>
                            <AuthButton onClick={() => navigate({ to: '/register/category' })}>
                                Далее <ArrowRightIcon />
                            </AuthButton>
                        </AuthButtonBox>
                    </Box>
                </Box>
            </AuthContentBox>
        </AuthPageBox>
    )
}
