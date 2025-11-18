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

            <Container maxW="640px" pb="16px" pt="16px" px="16px" mx="auto">
                <VStack align="stretch" gap="16px">
                    {/* Social Status Section */}
                    {profile?.groups && profile.groups.length > 0 && (
                        <Box>
                            <VStack align="stretch" gap="16px">
                                <Heading 
                                    as="h2" 
                                    fontSize={{ base: "xl", md: "32px" }}
                                    lineHeight={{ base: "28px", md: "40px" }}
                                    fontWeight="bold" 
                                    color="gray.900"
                                >
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
                                                borderRadius={{ base: "16px", md: "20px" }}
                                                p={{ base: "20px", md: "32px" }}
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
                                                <VStack align="stretch" gap={{ base: "12px", md: "20px" }}>
                                                    {/* Название категории и статус */}
                                                    <Flex
                                                        align="flex-start"
                                                        justify="space-between"
                                                        gap="12px"
                                                    >
                                                        <Box flex="1" minW="0">
                                                            <Heading
                                                                as="h3"
                                                                fontSize={{ base: "xl", md: "32px" }}
                                                                lineHeight={{ base: "28px", md: "40px" }}
                                                                fontWeight="bold"
                                                                color="gray.900"
                                                                mb={{ base: "4px", md: "8px" }}
                                                            >
                                                                {getGroupTypeLabel(group.type)}
                                                            </Heading>
                                                            {displayDate && (
                                                                <Text 
                                                                    color="gray.600" 
                                                                    fontSize={{ base: "sm", md: "lg" }}
                                                                    lineHeight={{ base: "20px", md: "28px" }}
                                                                >
                                                                    с {formatDate(displayDate)}
                                                                </Text>
                                                            )}
                                                        </Box>
                                                        <Badge
                                                            bg={statusConfig.bg}
                                                            color={statusConfig.color}
                                                            borderRadius={{ base: "12px", md: "16px" }}
                                                            px={{ base: "12px", md: "20px" }}
                                                            py={{ base: "6px", md: "10px" }}
                                                            fontSize={{ base: "sm", md: "lg" }}
                                                            lineHeight={{ base: "20px", md: "28px" }}
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
                                                            borderRadius={{ base: "12px", md: "16px" }}
                                                            h={{ base: "48px", md: "56px" }}
                                                            fontWeight="medium"
                                                            fontSize={{ base: "md", md: "lg" }}
                                                            lineHeight={{ base: "24px", md: "28px" }}
                                                            w="full"
                                                            aria-label="Просмотреть удостоверение"
                                                        >
                                                            <Flex align="center" gap="8px">
                                                                <Icon as={Eye} boxSize={{ base: "20px", md: "24px" }} />
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

                    {/* Benefits Section */}
                    <Box>
                <VStack align="stretch" gap="16px">
                            <Heading as="h2" fontSize="xl" fontWeight="bold" color="gray.900">
                                Мои льготы
                            </Heading>

                            <Flex gap="12px">
                                <Box
                                    flex="1"
                                    bg="white"
                                    borderRadius="16px"
                                    p="16px"
                                    cursor="pointer"
                                    onClick={() => navigate({ to: '/benefits' })}
                                    _hover={{ bg: 'gray.50' }}
                                    transition="all 0.2s"
                                >
                                    <VStack align="flex-start" gap="4px">
                                        <Text fontSize="lg" fontWeight="normal" color="gray.600">
                                            Для вас
                                        </Text>
                                        <Flex align="center" justify="space-between" w="full">
                                            <Heading as="h3" fontSize="4xl" fontWeight="bold" color="blue.500">
                                                {statsData?.total_benefits ?? 0}
                                        </Heading>
                                    <Icon
                                        viewBox="0 0 24 24"
                                        boxSize="20px"
                                        color="#A1A1AA"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                                        />
                                    </Icon>
                                        </Flex>
                                    </VStack>
                                </Box>

                                <Box
                                    flex="1"
                                    bg="white"
                                    borderRadius="16px"
                                    p="16px"
                                    cursor="pointer"
                                    onClick={() => navigate({ to: '/benefits' })}
                                    _hover={{ bg: 'gray.50' }}
                                    transition="all 0.2s"
                                >
                                    <VStack align="flex-start" gap="4px">
                                        <Text fontSize="lg" fontWeight="normal" color="gray.600">
                                            Сохранено
                                        </Text>
                                        <Flex align="center" justify="space-between" w="full">
                                            <Heading as="h3" fontSize="4xl" fontWeight="bold" color="blue.500">
                                                {statsData?.total_favorites ?? 0}
                                        </Heading>
                                    <Icon
                                        viewBox="0 0 24 24"
                                        boxSize="20px"
                                        color="#A1A1AA"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
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
                        <VStack align="stretch" gap="16px">
                            <Heading as="h2" fontSize="xl" fontWeight="bold" color="gray.900">
                                Личная информация
                            </Heading>

                            <Box bg="white" borderRadius="16px" p="16px">
                                <VStack align="stretch" gap="0">
                                    <Box py="16px" borderBottom="1px solid" borderColor="gray.100">
                                        <VStack align="stretch" gap="4px">
                                            <Text fontSize="md" fontWeight="bold" color="gray.900">
                                                ФИО
                                            </Text>
                                            <Text fontSize="md" fontWeight="normal" color="gray.600">
                                                {fullName || '—'}
                                            </Text>
                                        </VStack>
                                    </Box>

                                    <Box py="16px" borderBottom="1px solid" borderColor="gray.100">
                                        <VStack align="stretch" gap="4px">
                                            <Text fontSize="md" fontWeight="bold" color="gray.900">
                                                Телефон
                                            </Text>
                                            <Text fontSize="md" fontWeight="normal" color="gray.600">
                                                {formatPhoneNumber(profile?.phone_number)}
                                            </Text>
                                        </VStack>
                                    </Box>

                                    <Box py="16px">
                                        <VStack align="stretch" gap="4px">
                                            <Text fontSize="md" fontWeight="bold" color="gray.900">
                                                Почта
                                            </Text>
                                            <Text fontSize="md" fontWeight="normal" color="gray.600">
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
                        <VStack align="stretch" gap="16px">
                            <Heading as="h2" fontSize="xl" fontWeight="bold" color="gray.900">
                                Документы
                            </Heading>

                            <Box bg="white" borderRadius="16px" p="16px">
                                <VStack align="stretch" gap="0">
                                {snilsDoc?.document_number && (
                                        <Box py="16px" borderBottom="1px solid" borderColor="gray.100">
                                    <VStack align="stretch" gap="4px">
                                                <Text fontSize="md" fontWeight="bold" color="gray.900">
                                            СНИЛС
                                        </Text>
                                                <Text fontSize="md" fontWeight="normal" color="gray.600">
                                            {formatSnils(snilsDoc.document_number)}
                                        </Text>
                                    </VStack>
                                        </Box>
                                )}

                                {passportDoc?.document_number && (
                                        <Box py="16px">
                                    <VStack align="stretch" gap="4px">
                                                <Text fontSize="md" fontWeight="bold" color="gray.900">
                                            Паспорт
                                        </Text>
                                                <Text fontSize="md" fontWeight="normal" color="gray.600">
                                            {passportDoc.document_number}
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
                        variant="ghost"
                        colorScheme="blue"
                        borderRadius="16px"
                        fontWeight="medium"
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
