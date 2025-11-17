import { Badge, Box, Button, Flex, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { Download } from 'lucide-react'

import { BaseDrawer } from '@/shared/ui/base-drawer'
import type { V1GetProfileResponse, DomainUserDocument } from '@/shared/api/generated'

export interface CertificateDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    profile?: V1GetProfileResponse
    onDownloadPDF: () => void
    isDownloading?: boolean
}

const formatDate = (dateString?: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

const formatSnils = (snils?: string): string => {
    if (!snils) return ''
    const cleaned = snils.replace(/\D/g, '')
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
    }
    return snils
}

export const CertificateDrawer = ({
    isOpen,
    onOpenChange,
    profile,
    onDownloadPDF,
    isDownloading,
}: CertificateDrawerProps) => {
    const fullName = [profile?.last_name, profile?.first_name, profile?.middle_name]
        .filter(Boolean)
        .join(' ')

    const passportDoc = profile?.documents?.find((doc: DomainUserDocument) => doc.document_type === 'passport')
    const snilsDoc = profile?.documents?.find((doc: DomainUserDocument) => doc.document_type === 'snils')

    return (
        <BaseDrawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Удостоверение пенсионера"
            footer={
                <Button
                    w="full"
                    size="xl"
                    colorScheme="blue"
                    borderRadius="16px"
                    onClick={onDownloadPDF}
                    loading={isDownloading}
                >
                    <Download size={20} style={{ marginRight: '8px' }} />
                    Скачать PDF
                </Button>
            }
        >
            <VStack align="stretch" gap="24px" pb="24px">
                {/* Информация о статусе */}
                <Box
                    bg="#DBEAFE"
                    border="1px solid"
                    borderColor="#BFDBFE"
                    borderRadius="16px"
                    p="16px"
                >
                    <VStack align="stretch" gap="12px">
                        <Flex justify="space-between" align="center">
                            <Text
                                fontSize="18px"
                                lineHeight="24px"
                                fontWeight="bold"
                                color="#27272A"
                            >
                                Статус
                            </Text>
                            <Badge
                                colorScheme="green"
                                fontSize="14px"
                                px="12px"
                                py="4px"
                                borderRadius="8px"
                            >
                                Подтверждено
                            </Badge>
                        </Flex>
                        <Text
                            fontSize="16px"
                            lineHeight="24px"
                            fontWeight="normal"
                            color="#52525B"
                        >
                            Вы являетесь пенсионером
                        </Text>
                    </VStack>
                </Box>

                {/* Личные данные */}
                <Box>
                    <Heading
                        as="h3"
                        fontSize="20px"
                        lineHeight="28px"
                        fontWeight="bold"
                        color="#27272A"
                        mb="16px"
                    >
                        Личные данные
                    </Heading>
                    <VStack align="stretch" gap="16px">
                        <Box>
                            <Text
                                fontSize="14px"
                                lineHeight="20px"
                                fontWeight="normal"
                                color="#71717A"
                                mb="4px"
                            >
                                ФИО
                            </Text>
                            <Text
                                fontSize="18px"
                                lineHeight="24px"
                                fontWeight="normal"
                                color="#27272A"
                            >
                                {fullName || 'Не указано'}
                            </Text>
                        </Box>

                        {snilsDoc?.document_number && (
                            <Box>
                                <Text
                                    fontSize="14px"
                                    lineHeight="20px"
                                    fontWeight="normal"
                                    color="#71717A"
                                    mb="4px"
                                >
                                    СНИЛС
                                </Text>
                                <Text
                                    fontSize="18px"
                                    lineHeight="24px"
                                    fontWeight="normal"
                                    color="#27272A"
                                >
                                    {formatSnils(snilsDoc.document_number)}
                                </Text>
                            </Box>
                        )}

                        {passportDoc?.document_number && (
                            <Box>
                                <Text
                                    fontSize="14px"
                                    lineHeight="20px"
                                    fontWeight="normal"
                                    color="#71717A"
                                    mb="4px"
                                >
                                    Паспорт
                                </Text>
                                <Text
                                    fontSize="18px"
                                    lineHeight="24px"
                                    fontWeight="normal"
                                    color="#27272A"
                                >
                                    {passportDoc.document_number}
                                </Text>
                            </Box>
                        )}
                    </VStack>
                </Box>

                {/* Информация о категории */}
                <Box>
                    <Heading
                        as="h3"
                        fontSize="20px"
                        lineHeight="28px"
                        fontWeight="bold"
                        color="#27272A"
                        mb="16px"
                    >
                        Категория
                    </Heading>
                    <Box
                        bg="white"
                        border="1px solid"
                        borderColor="#E4E4E7"
                        borderRadius="12px"
                        p="16px"
                    >
                        <VStack align="stretch" gap="8px">
                            <Text
                                fontSize="18px"
                                lineHeight="24px"
                                fontWeight="bold"
                                color="#27272A"
                            >
                                Пенсионеры
                            </Text>
                            <Text
                                fontSize="16px"
                                lineHeight="24px"
                                fontWeight="normal"
                                color="#52525B"
                            >
                                Граждане, достигшие пенсионного возраста или получающие пенсию по
                                инвалидности
                            </Text>
                        </VStack>
                    </Box>
                </Box>

                {/* Дата выдачи */}
                {profile?.groups?.[0]?.verified_at && (
                    <Box>
                        <Text
                            fontSize="14px"
                            lineHeight="20px"
                            fontWeight="normal"
                            color="#71717A"
                            mb="4px"
                        >
                            Дата выдачи
                        </Text>
                        <Text
                            fontSize="18px"
                            lineHeight="24px"
                            fontWeight="normal"
                            color="#27272A"
                        >
                            {formatDate(profile.groups[0].verified_at)}
                        </Text>
                    </Box>
                )}
            </VStack>
        </BaseDrawer>
    )
}

