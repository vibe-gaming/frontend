import { useState } from 'react'
import {
    Badge,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'

import { useAuth } from '@/entities/auth'
import { AXIOS_INSTANCE } from '@/shared/api/axios-client'
import { type DomainUserDocument } from '@/shared/api/generated'
import { useGetBenefitsUserStats } from '@/shared/api/generated/hooks/useGetBenefitsUserStats'
import { AppHeader } from '@/shared/ui/app-header'

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
            return { label: 'Подтверждено', bg: '#D1FAE5', color: '#065F46' }
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

// Форматирование номера телефона
const formatPhoneNumber = (phone?: string): string => {
    if (!phone) return '—'
    // Форматируем телефон в вид +7 (XXX)-XXX-XX-XX
    const cleaned = phone.replaceAll(/\D/g, '')
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
        return `+7 (${cleaned.slice(1, 4)})-${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
    }

    return phone
}

// Форматирование СНИЛС
const formatSnils = (snils?: string): string => {
    if (!snils) return '—'
    const cleaned = snils.replaceAll(/\D/g, '')
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
    }

    return snils
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
        <Box bg='gray.50' minH='100vh'>
            {/* Header */}
            <AppHeader />

            <Container maxW='640px' mx='auto' pb='16px' pt='16px' px='16px'>
                <VStack align='stretch' gap='16px'>
                    {/* Social Status Section */}
                    {profile?.groups && profile.groups.length > 0 && (
                        <Box>
                            <VStack align='stretch' gap='16px'>
                                <Heading as='h2' color='gray.900' fontSize='xl' fontWeight='bold'>
                                    Социальный статус
                                </Heading>

                                <VStack align='stretch' gap='12px'>
                                    {profile.groups.map((group, index) => {
                                        const statusConfig = getStatusConfig(group.status)
                                        const displayDate = group.verified_at || group.rejected_at

                                        return (
                                            <Box
                                                key={`${group.type}-${index}`}
                                                aria-label={`Категория: ${getGroupTypeLabel(group.type)}`}
                                                bg='white'
                                                border='1px solid'
                                                borderColor='gray.200'
                                                borderRadius='16px'
                                                cursor='pointer'
                                                p='20px'
                                                role='article'
                                                transition='all 0.2s'
                                                _hover={{
                                                    borderColor: 'blue.300',
                                                    boxShadow: 'sm',
                                                }}
                                                onClick={() => handleOpenCertificate(group.type || 'pensioners')}
                                            >
                                                <VStack align='stretch' gap='12px'>
                                                    {/* Название категории и статус */}
                                                    <Flex
                                                        align='flex-start'
                                                        gap='12px'
                                                        justify='space-between'
                                                    >
                                                        <Box flex='1' minW='0'>
                                                            <Heading
                                                                as='h3'
                                                                color='gray.900'
                                                                fontSize='xl'
                                                                fontWeight='bold'
                                                                mb='4px'
                                                            >
                                                                {getGroupTypeLabel(group.type)}
                                                            </Heading>
                                                            {displayDate && (
                                                                <Text
                                                                    color='gray.600'
                                                                    fontSize='sm'
                                                                >
                                                                    с {formatDate(displayDate)}
                                                                </Text>
                                                            )}
                                                        </Box>
                                                        <Badge
                                                            aria-label={`Статус: ${statusConfig.label}`}
                                                            bg={statusConfig.bg}
                                                            borderRadius='12px'
                                                            color={statusConfig.color}
                                                            flexShrink={0}
                                                            fontSize='sm'
                                                            fontWeight='medium'
                                                            px='12px'
                                                            py='6px'
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
                                                            borderRadius='12px'
                                                            colorScheme='blue'
                                                            fontSize='md'
                                                            fontWeight='medium'
                                                            h='48px'
                                                            variant='outline'
                                                            w='full'
                                                        >
                                                            <Flex align='center' gap='8px'>
                                                                <Icon as={Eye} boxSize='20px' />
                                                                <Text>Удостоверение</Text>
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

                    {/* Benefits Section */}
                    <Box>
                        <VStack align='stretch' gap='16px'>
                            <Heading as='h2' color='gray.900' fontSize='xl' fontWeight='bold'>
                                Мои льготы
                            </Heading>

                            <Flex gap='12px'>
                                <Box
                                    _hover={{ bg: 'gray.50' }}
                                    bg='white'
                                    borderRadius='16px'
                                    cursor='pointer'
                                    flex='1'
                                    p='16px'
                                    transition='all 0.2s'
                                    onClick={() => navigate({ to: '/benefits' })}
                                >
                                    <VStack align='flex-start' gap='4px'>
                                        <Text color='gray.600' fontSize='lg' fontWeight='normal'>
                                            Для вас
                                        </Text>
                                        <Flex align='center' justify='space-between' w='full'>
                                            <Heading
                                                as='h3'
                                                color='blue.500'
                                                fontSize='4xl'
                                                fontWeight='bold'
                                            >
                                                {statsData?.total_benefits ?? 0}
                                            </Heading>
                                            <Icon
                                                boxSize='20px'
                                                color='#A1A1AA'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'
                                                    fill='currentColor'
                                                />
                                            </Icon>
                                        </Flex>
                                    </VStack>
                                </Box>

                                <Box
                                    _hover={{ bg: 'gray.50' }}
                                    bg='white'
                                    borderRadius='16px'
                                    cursor='pointer'
                                    flex='1'
                                    p='16px'
                                    transition='all 0.2s'
                                    onClick={() => navigate({ to: '/benefits' })}
                                >
                                    <VStack align='flex-start' gap='4px'>
                                        <Text color='gray.600' fontSize='lg' fontWeight='normal'>
                                            Сохранено
                                        </Text>
                                        <Flex align='center' justify='space-between' w='full'>
                                            <Heading
                                                as='h3'
                                                color='blue.500'
                                                fontSize='4xl'
                                                fontWeight='bold'
                                            >
                                                {statsData?.total_favorites ?? 0}
                                            </Heading>
                                            <Icon
                                                boxSize='20px'
                                                color='#A1A1AA'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'
                                                    fill='currentColor'
                                                />
                                            </Icon>
                                        </Flex>
                                    </VStack>
                                </Box>
                            </Flex>
                        </VStack>
                    </Box>

                    {/* Personal Information Section */}
                    <Box>
                        <VStack align='stretch' gap='16px'>
                            <Heading as='h2' color='gray.900' fontSize='xl' fontWeight='bold'>
                                Личная информация
                            </Heading>

                            <Box bg='white' borderRadius='16px' p='16px'>
                                <VStack align='stretch' gap='0'>
                                    <Box borderBottom='1px solid' borderColor='gray.100' py='16px'>
                                        <VStack align='stretch' gap='4px'>
                                            <Text color='gray.900' fontSize='md' fontWeight='bold'>
                                                ФИО
                                            </Text>
                                            <Text
                                                color='gray.600'
                                                fontSize='md'
                                                fontWeight='normal'
                                            >
                                                {fullName || '—'}
                                            </Text>
                                        </VStack>
                                    </Box>

                                    <Box borderBottom='1px solid' borderColor='gray.100' py='16px'>
                                        <VStack align='stretch' gap='4px'>
                                            <Text color='gray.900' fontSize='md' fontWeight='bold'>
                                                Телефон
                                            </Text>
                                            <Text
                                                color='gray.600'
                                                fontSize='md'
                                                fontWeight='normal'
                                            >
                                                {formatPhoneNumber(profile?.phone_number)}
                                            </Text>
                                        </VStack>
                                    </Box>

                                    <Box py='16px'>
                                        <VStack align='stretch' gap='4px'>
                                            <Text color='gray.900' fontSize='md' fontWeight='bold'>
                                                Почта
                                            </Text>
                                            <Text
                                                color='gray.600'
                                                fontSize='md'
                                                fontWeight='normal'
                                            >
                                                {profile?.email || '—'}
                                            </Text>
                                        </VStack>
                                    </Box>
                                </VStack>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Documents Section */}
                    <Box>
                        <VStack align='stretch' gap='16px'>
                            <Heading as='h2' color='gray.900' fontSize='xl' fontWeight='bold'>
                                Документы
                            </Heading>

                            <Box bg='white' borderRadius='16px' p='16px'>
                                <VStack align='stretch' gap='0'>
                                    {snilsDocument?.document_number && (
                                        <Box
                                            borderBottom='1px solid'
                                            borderColor='gray.100'
                                            py='16px'
                                        >
                                            <VStack align='stretch' gap='4px'>
                                                <Text
                                                    color='gray.900'
                                                    fontSize='md'
                                                    fontWeight='bold'
                                                >
                                                    СНИЛС
                                                </Text>
                                                <Text
                                                    color='gray.600'
                                                    fontSize='md'
                                                    fontWeight='normal'
                                                >
                                                    {formatSnils(snilsDocument.document_number)}
                                                </Text>
                                            </VStack>
                                        </Box>
                                    )}

                                    {passportDocument?.document_number && (
                                        <Box py='16px'>
                                            <VStack align='stretch' gap='4px'>
                                                <Text
                                                    color='gray.900'
                                                    fontSize='md'
                                                    fontWeight='bold'
                                                >
                                                    Паспорт
                                                </Text>
                                                <Text
                                                    color='gray.600'
                                                    fontSize='md'
                                                    fontWeight='normal'
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
                        borderRadius='16px'
                        colorScheme='blue'
                        fontSize='md'
                        fontWeight='medium'
                        h='56px'
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
                isDownloading={isDownloadingPDF}
                isOpen={isCertificateDrawerOpen}
                profile={profile}
                onDownloadPDF={handleDownloadPDF}
                onOpenChange={setIsCertificateDrawerOpen}
                groupType={selectedGroupType}
            />
        </Box>
    )
}
