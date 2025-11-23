import { useState } from 'react'
import {
    Badge,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { LuChevronRight } from 'react-icons/lu'

import { useAuth } from '@/entities/auth'
import { AXIOS_INSTANCE } from '@/shared/api/axios-client'
import { type DomainUserDocument } from '@/shared/api/generated'
import { useGetBenefitsUserStats } from '@/shared/api/generated/hooks/useGetBenefitsUserStats'
import { AppHeader } from '@/shared/ui/app-header'
import { Footer } from '@/shared/ui/footer'
import { formatPhoneNumber } from '@/shared/utils/format-phone-number'
import { formatSnils } from '@/shared/utils/format-snils'

import { CertificateDrawer } from '../certificate-drawer'

// Константы для типов групп
const GROUP_TYPES = {
    PENSIONERS: 'pensioners',
    DISABLED: 'disabled',
    YOUNG_FAMILIES: 'young_families',
    LOW_INCOME: 'low_income',
    STUDENTS: 'students',
    LARGE_FAMILIES: 'large_families',
    CHILDREN: 'children',
    VETERANS: 'veterans',
} as const

// Константы для статусов верификации
const VERIFICATION_STATUS = {
    VERIFIED: 'verified',
    PENDING: 'pending',
    REJECTED: 'rejected',
    EXPIRED: 'expired',
} as const

// Маппинг типов групп на человекочитаемые названия
const getGroupTypeLabel = (type?: string): string => {
    switch (type) {
        case GROUP_TYPES.PENSIONERS: {
            return 'Пенсионеры'
        }
        case GROUP_TYPES.DISABLED: {
            return 'Люди с ограниченными возможностями'
        }
        case GROUP_TYPES.YOUNG_FAMILIES: {
            return 'Молодые семьи'
        }
        case GROUP_TYPES.LOW_INCOME: {
            return 'Малоимущие'
        }
        case GROUP_TYPES.STUDENTS: {
            return 'Студенты'
        }
        case GROUP_TYPES.LARGE_FAMILIES: {
            return 'Многодетные семьи'
        }
        case GROUP_TYPES.CHILDREN: {
            return 'Дети'
        }
        case GROUP_TYPES.VETERANS: {
            return 'Ветераны'
        }
        default: {
            return 'Неизвестная категория'
        }
    }
}

// Маппинг статусов на человекочитаемые названия и цвета
const getStatusConfig = (status?: string): { label: string; bg: string; color: string } => {
    switch (status) {
        case VERIFICATION_STATUS.VERIFIED: {
            return { label: 'Подтверждено', bg: 'green.subtle', color: 'green.fg' }
        }
        case VERIFICATION_STATUS.PENDING: {
            return { label: 'На проверке', bg: '#FEF3C7', color: '#92400E' }
        }
        case VERIFICATION_STATUS.REJECTED: {
            return { label: 'Отклонено', bg: '#FEE2E2', color: '#991B1B' }
        }
        case VERIFICATION_STATUS.EXPIRED: {
            return { label: 'Истекло', bg: '#F3F4F6', color: '#374151' }
        }
        default: {
            return { label: 'Неизвестно', bg: '#F3F4F6', color: '#374151' }
        }
    }
}

// Форматирование даты
const formatDate = (dateString?: string): string => {
    if (!dateString) return '—'
    try {
        const date = new Date(dateString)

        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    } catch {
        return '—'
    }
}

// Функция для получения документа по типу
const getDocumentByType = (
    documents: DomainUserDocument[] | undefined,
    type: string
): DomainUserDocument | undefined => {
    return documents?.find((document_) => document_.document_type === type)
}

export const ProfilePage = () => {
    const { profile, isLoading, onLogout } = useAuth()
    const navigate = useNavigate()
    const { data: statsData } = useGetBenefitsUserStats()
    const [isCertificateDrawerOpen, setIsCertificateDrawerOpen] = useState(false)
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
    const [selectedGroupType, setSelectedGroupType] = useState<string>('pensioners')

    const fullName = [profile?.last_name, profile?.first_name, profile?.middle_name]
        .filter(Boolean)
        .join(' ')

    // Получаем документы
    const passportDocument = getDocumentByType(profile?.documents, 'passport')
    const snilsDocument = getDocumentByType(profile?.documents, 'snils')

    // Функция скачивания PDF
    const handleDownloadPDF = async () => {
        try {
            setIsDownloadingPDF(true)
            const response = await AXIOS_INSTANCE.get('/users/pdfdownload', {
                responseType: 'blob',
                params: {
                    group_type: selectedGroupType, // Отправляем тип группы на бэкенд
                },
            })

            // Создаем ссылку для скачивания
            const url = globalThis.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const documentName = getGroupTypeLabel(selectedGroupType) || 'Документ'
            link.setAttribute('download', `${documentName}_${fullName || 'пользователя'}.pdf`)
            document.body.append(link)
            link.click()
            link.remove()
            globalThis.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Ошибка при скачивании PDF:', error)
        } finally {
            setIsDownloadingPDF(false)
        }
    }

    const handleOpenCertificate = (groupType: string) => {
        setSelectedGroupType(groupType)
        setIsCertificateDrawerOpen(true)
    }

    console.log(profile)

    if (isLoading) {
        return (
            <Box
                alignItems='center'
                bg='gray.50'
                display='flex'
                justifyContent='center'
                minH='100vh'
            >
                <Spinner color='blue.500' size='xl' />
            </Box>
        )
    }

    return (
        <Box bg={{ base: 'white', md: 'gray.100' }} minH='100vh'>
            {/* Header */}
            <Box maxW='1280px' mx='auto' position='sticky' top={0} w='100%' zIndex={1000}>
                <AppHeader />
            </Box>

            <Container maxW='640px' mx='auto' pb='16px' pt={{ base: 0, md: 10 }} px='20px'>
                <VStack align='stretch' gap='40px'>
                    {/* Benefits Section */}
                    <Box>
                        <VStack align='stretch' gap={{ base: '16px', md: '20px' }}>
                            <Heading
                                as='h2'
                                fontSize={{ base: '2xl', md: '4xl' }}
                                fontWeight='bold'
                            >
                                Мои льготы
                            </Heading>

                            <Flex gap={{ base: '16px', md: '24px' }}>
                                <Box
                                    _hover={{ bg: { base: 'gray.100', md: 'gray.50' } }}
                                    bg={{ base: 'gray.50', md: 'white' }}
                                    borderRadius={{ base: '16px', md: '20px' }}
                                    cursor='pointer'
                                    flex='1'
                                    height={{ base: '88px', md: 'auto' }}
                                    p={{ base: '12px', md: '24px' }}
                                    transition='all 0.2s'
                                    onClick={() =>
                                        navigate({ to: '/benefits', search: { favorites: true } })
                                    }
                                >
                                    <VStack align='flex-start' gap='4px'>
                                        <HStack
                                            align='center'
                                            gap='4px'
                                            justify='space-between'
                                            width='full'
                                        >
                                            <Text
                                                color='gray.600'
                                                fontSize={{ base: 'lg', md: 'xl' }}
                                                fontWeight='medium'
                                            >
                                                Для вас
                                            </Text>
                                            <LuChevronRight size={24} />
                                        </HStack>
                                        <Heading
                                            as='h3'
                                            color='blue.solid'
                                            fontSize={{ base: '2xl', md: '5xl' }}
                                            fontWeight='bold'
                                            lineHeight={{ base: '32px', md: '60px' }}
                                        >
                                            {statsData?.total_benefits ?? 0}
                                        </Heading>
                                    </VStack>
                                </Box>

                                <Box
                                    _hover={{ bg: { base: 'gray.100', md: 'gray.50' } }}
                                    bg={{ base: 'gray.50', md: 'white' }}
                                    borderRadius={{ base: '16px', md: '20px' }}
                                    cursor='pointer'
                                    flex='1'
                                    height={{ base: '88px', md: 'auto' }}
                                    p={{ base: '12px', md: '24px' }}
                                    transition='all 0.2s'
                                    onClick={() => navigate({ to: '/benefits' })} // TODO когда будет реализована страница с льготами (query url)
                                >
                                    <VStack align='flex-start' gap='4px'>
                                        <HStack
                                            align='center'
                                            gap='4px'
                                            justify='space-between'
                                            width='full'
                                        >
                                            <Text
                                                color='gray.600'
                                                fontSize={{ base: 'lg', md: 'xl' }}
                                                fontWeight='medium'
                                            >
                                                Сохранено
                                            </Text>
                                            <LuChevronRight size={24} />
                                        </HStack>
                                        <Heading
                                            as='h3'
                                            color='blue.solid'
                                            fontSize={{ base: '2xl', md: '5xl' }}
                                            fontWeight='bold'
                                            lineHeight={{ base: '32px', md: '60px' }}
                                        >
                                            {statsData?.total_favorites ?? 0}
                                        </Heading>
                                    </VStack>
                                </Box>
                            </Flex>
                        </VStack>
                    </Box>

                    {/* Personal Information Section */}
                    <Box>
                        <VStack align='stretch' gap={{ base: '16px', md: '20px' }}>
                            <Heading
                                as='h2'
                                fontSize={{ base: '2xl', md: '4xl' }}
                                fontWeight='bold'
                            >
                                Личная информация
                            </Heading>

                            <Box
                                bg='white'
                                borderColor='border.default'
                                borderRadius={{ base: '16px', md: '20px' }}
                                borderWidth={{ base: '1px', md: '0' }}
                                p={{ base: '16px', md: '24px' }}
                            >
                                <VStack align='stretch' gap='0'>
                                    <Box borderBottom='1px solid' borderColor='#E4E4E7' pb='16px'>
                                        <VStack align='stretch' gap='4px'>
                                            <Text
                                                fontSize={{ base: 'lg', md: 'xl' }}
                                                fontWeight='bold'
                                                lineHeight={{ base: '24px', md: '30px' }}
                                            >
                                                ФИО
                                            </Text>
                                            <Text
                                                color='gray.600'
                                                fontSize={{ base: 'lg', md: 'xl' }}
                                                fontWeight='normal'
                                                lineHeight={{ base: '28px', md: '30px' }}
                                            >
                                                {fullName || '—'}
                                            </Text>
                                        </VStack>
                                    </Box>

                                    <Box borderBottom='1px solid' borderColor='#E4E4E7' py='16px'>
                                        <VStack align='stretch' gap='4px'>
                                            <Text
                                                fontSize={{ base: 'lg', md: 'xl' }}
                                                fontWeight='bold'
                                                lineHeight={{ base: '24px', md: '30px' }}
                                            >
                                                Телефон
                                            </Text>
                                            <Text
                                                color='gray.600'
                                                fontSize={{ base: 'lg', md: 'xl' }}
                                                fontWeight='normal'
                                                lineHeight={{ base: '28px', md: '30px' }}
                                            >
                                                {formatPhoneNumber(profile?.phone_number)}
                                            </Text>
                                        </VStack>
                                    </Box>

                                    <Box pt='16px'>
                                        <VStack align='stretch' gap='4px'>
                                            <Text
                                                fontSize={{ base: 'lg', md: 'xl' }}
                                                fontWeight='bold'
                                                lineHeight={{ base: '24px', md: '30px' }}
                                            >
                                                Почта
                                            </Text>
                                            <Text
                                                color='gray.600'
                                                fontSize={{ base: 'lg', md: 'xl' }}
                                                fontWeight='normal'
                                                lineHeight={{ base: '28px', md: '30px' }}
                                            >
                                                {profile?.email || '—'}
                                            </Text>
                                        </VStack>
                                    </Box>
                                </VStack>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Social Status Section */}
                    {profile?.groups && profile.groups.length > 0 && (
                        <Box>
                            <VStack align='stretch' gap={{ base: '16px', md: '20px' }}>
                                <Heading
                                    as='h2'
                                    fontSize={{ base: '2xl', md: '4xl' }}
                                    fontWeight='bold'
                                >
                                    Социальный статус
                                </Heading>

                                <VStack align='stretch' gap={{ base: '16px', md: '24px' }}>
                                    {profile.groups.map((group, index) => {
                                        const statusConfig = getStatusConfig(group.status)
                                        const displayDate = group.verified_at || group.rejected_at

                                        return (
                                            <Box
                                                key={`${group.type}-${index}`}
                                                aria-label={`Категория: ${getGroupTypeLabel(group.type)}`}
                                                bg='white'
                                                borderColor={'blue.200'}
                                                borderRadius={{ base: '16px', md: '20px' }}
                                                borderWidth={{ base: '1px', md: '0' }}
                                                cursor='pointer'
                                                p={{ base: '16px', md: '24px' }}
                                                role='article'
                                                transition='all 0.2s'
                                                _hover={{
                                                    borderColor: {
                                                        base: 'blue.200',
                                                        md: 'transparent',
                                                    },
                                                    boxShadow: 'sm',
                                                }}
                                                onClick={() =>
                                                    handleOpenCertificate(
                                                        group.type || 'pensioners'
                                                    )
                                                }
                                            >
                                                <VStack
                                                    align='stretch'
                                                    gap={{ base: '8px', md: '20px' }}
                                                >
                                                    {/* Название категории и статус */}
                                                    <Flex
                                                        align='flex-start'
                                                        gap={{ base: '12px', md: '16px' }}
                                                        justify='space-between'
                                                    >
                                                        <Box flex='1' minW='0'>
                                                            <Heading
                                                                as='h3'
                                                                fontSize={{ base: 'xl', md: '2xl' }}
                                                                fontWeight='bold'
                                                                lineHeight={{
                                                                    base: '24px',
                                                                    md: '32px',
                                                                }}
                                                            >
                                                                {getGroupTypeLabel(group.type)}
                                                            </Heading>
                                                            {displayDate && (
                                                                <Text
                                                                    color='gray.600'
                                                                    fontSize={{
                                                                        base: 'md',
                                                                        md: 'xl',
                                                                    }}
                                                                    lineHeight={{
                                                                        base: '20px',
                                                                        md: '30px',
                                                                    }}
                                                                >
                                                                    с {formatDate(displayDate)}
                                                                </Text>
                                                            )}
                                                        </Box>
                                                        <Badge
                                                            aria-label={`Статус: ${statusConfig.label}`}
                                                            bg={statusConfig.bg}
                                                            borderRadius='lg'
                                                            color={statusConfig.color}
                                                            flexShrink={0}
                                                            fontSize='sm'
                                                            fontWeight='regular'
                                                            lineHeight={'20px'}
                                                            px={'10px'}
                                                            py={'4px'}
                                                            textTransform='none'
                                                        >
                                                            {statusConfig.label}
                                                        </Badge>
                                                    </Flex>

                                                    {/* Кнопка удостоверения */}
                                                    {group.status ===
                                                        VERIFICATION_STATUS.VERIFIED && (
                                                        <Button
                                                            aria-label='Просмотреть удостоверение'
                                                            borderColor='blue.muted'
                                                            borderRadius={'2xl'}
                                                            colorScheme='blue'
                                                            h={'64px'}
                                                            variant='outline'
                                                            w='full'
                                                        >
                                                            <Flex align='center' gap='12px'>
                                                                <Icon
                                                                    as={Eye}
                                                                    boxSize='24px'
                                                                    color='blue.fg'
                                                                />
                                                                <Text
                                                                    color='blue.fg'
                                                                    fontSize={'xl'}
                                                                    fontWeight='medium'
                                                                    lineHeight={'30px'}
                                                                >
                                                                    Удостоверение
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    )}

                                                    {/* Сообщение об ошибке */}
                                                    {group.error_message && (
                                                        <Box
                                                            bg='red.50'
                                                            borderRadius='8px'
                                                            p='12px'
                                                        >
                                                            <Text
                                                                color='red.700'
                                                                fontSize='sm'
                                                                role='alert'
                                                            >
                                                                {group.error_message}
                                                            </Text>
                                                        </Box>
                                                    )}
                                                </VStack>
                                            </Box>
                                        )
                                    })}
                                </VStack>
                            </VStack>
                        </Box>
                    )}

                    {/* Documents Section */}
                    <Box>
                        <VStack align='stretch' gap={{ base: '16px', md: '20px' }}>
                            <Heading
                                as='h2'
                                fontSize={{ base: '2xl', md: '4xl' }}
                                fontWeight='bold'
                            >
                                Документы
                            </Heading>

                            <Box
                                bg='white'
                                borderColor='border.default'
                                borderRadius={{ base: '16px', md: '20px' }}
                                borderWidth={{ base: '1px', md: '0' }}
                                p={{ base: '16px', md: '24px' }}
                            >
                                <VStack align='stretch' gap='0'>
                                    {snilsDocument?.document_number && (
                                        <Box
                                            borderBottom='1px solid'
                                            borderColor='#E4E4E7'
                                            pb='16px'
                                        >
                                            <VStack align='stretch' gap='4px'>
                                                <Text
                                                    fontSize={{ base: 'lg', md: 'xl' }}
                                                    fontWeight='bold'
                                                    lineHeight={{ base: '24px', md: '30px' }}
                                                >
                                                    СНИЛС
                                                </Text>
                                                <Text
                                                    color='gray.600'
                                                    fontSize={{ base: 'lg', md: 'xl' }}
                                                    fontWeight='normal'
                                                    lineHeight={{ base: '28px', md: '30px' }}
                                                >
                                                    {formatSnils(snilsDocument.document_number)}
                                                </Text>
                                            </VStack>
                                        </Box>
                                    )}

                                    {passportDocument?.document_number && (
                                        <Box pt='16px'>
                                            <VStack align='stretch' gap='4px'>
                                                <Text
                                                    fontSize={{ base: 'lg', md: 'xl' }}
                                                    fontWeight='bold'
                                                    lineHeight={{ base: '24px', md: '30px' }}
                                                >
                                                    Паспорт
                                                </Text>
                                                <Text
                                                    color='gray.600'
                                                    fontSize={{ base: 'lg', md: 'xl' }}
                                                    fontWeight='normal'
                                                    lineHeight={{ base: '28px', md: '30px' }}
                                                >
                                                    {passportDocument.document_number}
                                                </Text>
                                            </VStack>
                                        </Box>
                                    )}
                                </VStack>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Logout Button */}
                    <Button
                        _hover={{ bg: 'white' }}
                        borderRadius='16px'
                        colorScheme='blue'
                        fontSize='xl'
                        fontWeight='medium'
                        h='64px'
                        variant='ghost'
                        onClick={() => {
                            onLogout()
                            navigate({ to: '/' })
                        }}
                    >
                        Выйти
                    </Button>
                </VStack>
            </Container>

            {/* Certificate Drawer */}
            <CertificateDrawer
                groupType={selectedGroupType}
                isDownloading={isDownloadingPDF}
                isOpen={isCertificateDrawerOpen}
                profile={profile}
                onDownloadPDF={handleDownloadPDF}
                onOpenChange={setIsCertificateDrawerOpen}
            />

            <Footer />
        </Box>
    )
}
