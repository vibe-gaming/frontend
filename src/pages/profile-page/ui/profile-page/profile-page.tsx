import { useState } from 'react'
import { Badge, Box, Button, Container, Flex, Heading, Icon, Spinner, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'

import { useAuth } from '@/entities/auth'
import { type DomainUserDocument } from '@/shared/api/generated'
import { useGetBenefitsUserStats } from '@/shared/api/generated/hooks/useGetBenefitsUserStats'
import { AppHeader } from '@/shared/ui/app-header'
import { CertificateDrawer } from '../certificate-drawer'
import { AXIOS_INSTANCE } from '@/shared/api/axios-client'

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
        case GROUP_TYPES.PENSIONERS:
            return 'Пенсионеры'
        case GROUP_TYPES.DISABLED:
            return 'Люди с ограниченными возможностями'
        case GROUP_TYPES.YOUNG_FAMILIES:
            return 'Молодые семьи'
        case GROUP_TYPES.LOW_INCOME:
            return 'Малоимущие'
        case GROUP_TYPES.STUDENTS:
            return 'Студенты'
        case GROUP_TYPES.LARGE_FAMILIES:
            return 'Многодетные семьи'
        case GROUP_TYPES.CHILDREN:
            return 'Дети'
        case GROUP_TYPES.VETERANS:
            return 'Ветераны'
        default:
            return 'Неизвестная категория'
    }
}

// Маппинг статусов на человекочитаемые названия и цвета
const getStatusConfig = (status?: string): { label: string; bg: string; color: string } => {
    switch (status) {
        case VERIFICATION_STATUS.VERIFIED:
            return { label: 'Подтверждено', bg: '#D1FAE5', color: '#065F46' }
        case VERIFICATION_STATUS.PENDING:
            return { label: 'На проверке', bg: '#FEF3C7', color: '#92400E' }
        case VERIFICATION_STATUS.REJECTED:
            return { label: 'Отклонено', bg: '#FEE2E2', color: '#991B1B' }
        case VERIFICATION_STATUS.EXPIRED:
            return { label: 'Истекло', bg: '#F3F4F6', color: '#374151' }
        default:
            return { label: 'Неизвестно', bg: '#F3F4F6', color: '#374151' }
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
    return documents?.find((doc) => doc.document_type === type)
}

// Форматирование номера телефона
const formatPhoneNumber = (phone?: string): string => {
    if (!phone) return '—'
    // Форматируем телефон в вид +7 (XXX)-XXX-XX-XX
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
        return `+7 (${cleaned.slice(1, 4)})-${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
    }
    return phone
}

// Форматирование СНИЛС
const formatSnils = (snils?: string): string => {
    if (!snils) return '—'
    const cleaned = snils.replace(/\D/g, '')
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
    }
    return snils
}

export const ProfilePage = () => {
    const { profile, isLoading } = useAuth()
    const navigate = useNavigate()
    const { data: statsData } = useGetBenefitsUserStats()
    const [isCertificateDrawerOpen, setIsCertificateDrawerOpen] = useState(false)
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

    const fullName = [profile?.last_name, profile?.first_name, profile?.middle_name]
        .filter(Boolean)
        .join(' ')

    // Получаем документы
    const passportDoc = getDocumentByType(profile?.documents, 'passport')
    const snilsDoc = getDocumentByType(profile?.documents, 'snils')

    // Функция скачивания PDF
    const handleDownloadPDF = async () => {
        try {
            setIsDownloadingPDF(true)
            const response = await AXIOS_INSTANCE.get('/users/pdfdownload', {
                responseType: 'blob',
            })

            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Удостоверение_${fullName || 'пенсионера'}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Ошибка при скачивании PDF:', error)
        } finally {
            setIsDownloadingPDF(false)
        }
    }

    if (isLoading) {
        return (
            <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
                <Spinner color="blue.500" size="xl" />
            </Box>
        )
    }

    return (
        <Box bg="gray.50" minH="100vh">
            {/* Header */}
            <AppHeader />

            <Container 
                maxW={{ base: 'container.lg', lg: '1280px' }} 
                px={{ base: '16px', lg: '40px' }} 
                pt="16px"
            >
                {/* Desktop: Two column layout */}
                <Flex 
                    gap="20px" 
                    direction={{ base: 'column', lg: 'row' }}
                    align={{ base: 'stretch', lg: 'flex-start' }}
                >
                    {/* Left Column */}
                    <VStack 
                        align="stretch" 
                        gap="16px"
                        flex={{ base: '1', lg: '0 0 600px' }}
                        w={{ base: '100%', lg: '600px' }}
                    >
            {/* Categories Card */}
            {profile?.groups && profile.groups.length > 0 && (
                <Box>
                        <VStack align="stretch" gap="16px">
                            <Heading as="h2" fontSize="xl" fontWeight="bold">
                                Социальный статус
                            </Heading>

                                <VStack align="stretch" gap="12px">
                                    {profile.groups.map((group, index) => {
                                        const statusConfig = getStatusConfig(group.status)
                                        const displayDate = group.verified_at || group.rejected_at
                                        return (
                                            <Box
                                                key={`${group.type}-${index}`}
                                                bg="white"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                borderRadius="16px"
                                                p="20px"
                                                role="article"
                                                aria-label={`Категория: ${getGroupTypeLabel(group.type)}`}
                                                    cursor="pointer"
                                                    onClick={() => setIsCertificateDrawerOpen(true)}
                                                    _hover={{ 
                                                        borderColor: 'blue.300',
                                                        boxShadow: 'sm',
                                                    }}
                                                    transition="all 0.2s"
                                            >
                                                <VStack align="stretch" gap="12px">
                                                    {/* Название категории и статус */}
                                                    <Flex
                                                        align="flex-start"
                                                        justify="space-between"
                                                        gap="12px"
                                                    >
                                                        <Box flex="1" minW="0">
                                                            <Heading
                                                                as="h3"
                                                                fontSize="xl"
                                                                fontWeight="bold"
                                                                color="gray.900"
                                                                mb="4px"
                                                            >
                                                                {getGroupTypeLabel(group.type)}
                                                            </Heading>
                                                            {displayDate && (
                                                                <Text color="gray.600" fontSize="sm">
                                                                    с {formatDate(displayDate)}
                                                                </Text>
                                                            )}
                                                        </Box>
                                                        <Badge
                                                            bg={statusConfig.bg}
                                                            color={statusConfig.color}
                                                            borderRadius="12px"
                                                            px="12px"
                                                            py="6px"
                                                            fontSize="sm"
                                                            fontWeight="medium"
                                                            textTransform="none"
                                                            aria-label={`Статус: ${statusConfig.label}`}
                                                            flexShrink={0}
                                                        >
                                                            {statusConfig.label}
                                                        </Badge>
                                                    </Flex>

                                                    {/* Кнопка удостоверения */}
                                                    {group.status === VERIFICATION_STATUS.VERIFIED && (
                                                        <Button
                                                            variant="outline"
                                                            colorScheme="blue"
                                                            borderRadius="12px"
                                                            h="48px"
                                                            fontWeight="medium"
                                                            fontSize="md"
                                                            w="full"
                                                            aria-label="Просмотреть удостоверение"
                                                        >
                                                            <Flex align="center" gap="8px">
                                                                <Icon as={Eye} boxSize="20px" />
                                                                <Text>Удостоверение</Text>
                                                            </Flex>
                                                        </Button>
                                                    )}

                                                    {/* Сообщение об ошибке */}
                                                    {group.error_message && (
                                                        <Box p="12px" bg="red.50" borderRadius="8px">
                                                            <Text color="red.700" fontSize="sm" role="alert">
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

                        {/* Benefits Card */}
                        <Box
                            bg="white"
                            border="1px solid"
                            borderColor="#BFDBFE"
                            borderRadius="20px"
                            p="16px"
                        >
                            <VStack align="stretch" gap="16px">
                                <Heading
                                    as="h2"
                                    fontSize="24px"
                                    lineHeight="32px"
                                    fontWeight="bold"
                                    color="#27272A"
                                    letterSpacing="-0.2px"
                                >
                                    Мои льготы
                                </Heading>

                                <Flex gap="12px">
                                    <Button
                                        flex="1"
                                        variant="ghost"
                                        borderRadius="12px"
                                        h="auto"
                                        p="12px"
                                        justifyContent="flex-start"
                                        onClick={() => navigate({ to: '/benefits' })}
                                        _hover={{ bg: 'gray.50' }}
                                    >
                                        <VStack align="flex-start" gap="4px" w="full">
                                            <Text
                                                fontSize="18px"
                                                lineHeight="24px"
                                                fontWeight="normal"
                                                color="#52525B"
                                            >
                                                Для вас
                                            </Text>
                                            <Heading
                                                as="h3"
                                                fontSize="32px"
                                                lineHeight="40px"
                                                fontWeight="bold"
                                                color="#3B82F6"
                                            >
                                                {statsData?.total_benefits ?? 0}
                                            </Heading>
                                        </VStack>
                                        <Icon
                                            viewBox="0 0 24 24"
                                            boxSize="20px"
                                            color="#A1A1AA"
                                            ml="auto"
                                            flexShrink={0}
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                                            />
                                        </Icon>
                                    </Button>

                                    <Button
                                        flex="1"
                                        variant="ghost"
                                        borderRadius="12px"
                                        h="auto"
                                        p="12px"
                                        justifyContent="flex-start"
                                        onClick={() => navigate({ to: '/benefits' })}
                                        _hover={{ bg: 'gray.50' }}
                                    >
                                        <VStack align="flex-start" gap="4px" w="full">
                                            <Text
                                                fontSize="18px"
                                                lineHeight="24px"
                                                fontWeight="normal"
                                                color="#52525B"
                                            >
                                                Сохранено
                                            </Text>
                                            <Heading
                                                as="h3"
                                                fontSize="32px"
                                                lineHeight="40px"
                                                fontWeight="bold"
                                                color="#3B82F6"
                                            >
                                                {statsData?.total_favorites ?? 0}
                                            </Heading>
                                        </VStack>
                                        <Icon
                                            viewBox="0 0 24 24"
                                            boxSize="20px"
                                            color="#A1A1AA"
                                            ml="auto"
                                            flexShrink={0}
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                                            />
                                        </Icon>
                                    </Button>
                                </Flex>
                            </VStack>
                        </Box>
                    </VStack>

                    {/* Right Column */}
                    <VStack 
                        align="stretch" 
                        gap="16px"
                        flex="1"
                        pb={{ base: '16px', lg: '0' }}
                    >
                        {/* Personal Information Card */}
                        <Box
                            bg="white"
                            border="1px solid"
                            borderColor="#BFDBFE"
                            borderRadius="20px"
                            p="16px"
                        >
                            <VStack align="stretch" gap="16px">
                                <Heading
                                    as="h2"
                                    fontSize="24px"
                                    lineHeight="32px"
                                    fontWeight="bold"
                                    color="#27272A"
                                    letterSpacing="-0.2px"
                                >
                                    Личная информация
                                </Heading>

                                <VStack align="stretch" gap="16px">
                                    <VStack align="stretch" gap="4px">
                                        <Text
                                            fontSize="18px"
                                            lineHeight="24px"
                                            fontWeight="bold"
                                            color="#27272A"
                                        >
                                            ФИО
                                        </Text>
                                        <Text
                                            fontSize="18px"
                                            lineHeight="24px"
                                            fontWeight="normal"
                                            color="#52525B"
                                        >
                                            {fullName || '—'}
                                        </Text>
                                    </VStack>

                                    <VStack align="stretch" gap="4px">
                                        <Text
                                            fontSize="18px"
                                            lineHeight="24px"
                                            fontWeight="bold"
                                            color="#27272A"
                                        >
                                            Телефон
                                        </Text>
                                        <Text
                                            fontSize="18px"
                                            lineHeight="24px"
                                            fontWeight="normal"
                                            color="#52525B"
                                        >
                                            {formatPhoneNumber(profile?.phone_number)}
                                        </Text>
                                    </VStack>

                                    <VStack align="stretch" gap="4px">
                                        <Text
                                            fontSize="18px"
                                            lineHeight="24px"
                                            fontWeight="bold"
                                            color="#27272A"
                                        >
                                            Почта
                                        </Text>
                                        <Text
                                            fontSize="18px"
                                            lineHeight="24px"
                                            fontWeight="normal"
                                            color="#52525B"
                                        >
                                            {profile?.email || '—'}
                                        </Text>
                                    </VStack>
                                </VStack>
                            </VStack>
                        </Box>

                        {/* Documents Card */}
                        <Box
                            bg="white"
                            border="1px solid"
                            borderColor="#BFDBFE"
                            borderRadius="20px"
                            p="16px"
                        >
                            <VStack align="stretch" gap="16px">
                                <Heading
                                    as="h2"
                                    fontSize="24px"
                                    lineHeight="32px"
                                    fontWeight="bold"
                                    color="#27272A"
                                    letterSpacing="-0.2px"
                                >
                                    Документы
                                </Heading>

                                <VStack align="stretch" gap="16px">
                                    {snilsDoc?.document_number && (
                                        <VStack align="stretch" gap="4px">
                                            <Text
                                                fontSize="18px"
                                                lineHeight="24px"
                                                fontWeight="bold"
                                                color="#27272A"
                                            >
                                                СНИЛС
                                            </Text>
                                            <Text
                                                fontSize="18px"
                                                lineHeight="24px"
                                                fontWeight="normal"
                                                color="#52525B"
                                            >
                                                {formatSnils(snilsDoc.document_number)}
                                            </Text>
                                        </VStack>
                                    )}

                                    {passportDoc?.document_number && (
                                        <VStack align="stretch" gap="4px">
                                            <Text
                                                fontSize="18px"
                                                lineHeight="24px"
                                                fontWeight="bold"
                                                color="#27272A"
                                            >
                                                Паспорт
                                            </Text>
                                            <Text
                                                fontSize="18px"
                                                lineHeight="24px"
                                                fontWeight="normal"
                                                color="#52525B"
                                                whiteSpace="pre-line"
                                            >
                                                {passportDoc.document_number}
                                            </Text>
                                        </VStack>
                                    )}
                                </VStack>
                            </VStack>
                        </Box>

                        {/* Logout Button */}
                        <Button
                            variant="ghost"
                            colorScheme="blue"
                            borderRadius="16px"
                            fontWeight="semibold"
                            fontSize="md"
                            h="56px"
                            onClick={() => {
                                // TODO: Implement logout
                                console.log('Logout clicked')
                            }}
                        >
                            Выйти
                        </Button>
                    </VStack>
                </Flex>
            </Container>

            {/* Certificate Drawer */}
            <CertificateDrawer
                isOpen={isCertificateDrawerOpen}
                onOpenChange={setIsCertificateDrawerOpen}
                profile={profile}
                onDownloadPDF={handleDownloadPDF}
                isDownloading={isDownloadingPDF}
            />
        </Box>
    )
}
