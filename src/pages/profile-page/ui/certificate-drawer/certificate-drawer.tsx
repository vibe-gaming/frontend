import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
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

const formatSnils = (snils?: string): string => {
    if (!snils) return ''
    const cleaned = snils.replace(/\D/g, '')
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
    }
    return snils
}

// Компонент для отображения поля
const CertificateField = ({ label, value, isRed }: { label: string; value: string; isRed?: boolean }) => (
    <Box
        borderBottom="1px solid"
        borderColor="#E4E4E7"
        pb="16px"
        pt="16px"
    >
        <Text
            fontSize="14px"
            lineHeight="20px"
            fontWeight="normal"
            color="#52525B"
            mb="4px"
        >
            {label}
        </Text>
        <Text
            fontSize="18px"
            lineHeight="24px"
            fontWeight="bold"
            color={isRed ? "#DC2626" : "#27272A"}
            textTransform="uppercase"
        >
            {value}
        </Text>
    </Box>
)

export const CertificateDrawer = ({
    isOpen,
    onOpenChange,
    profile,
    onDownloadPDF,
    isDownloading,
}: CertificateDrawerProps) => {
    const snilsDoc = profile?.documents?.find((doc: DomainUserDocument) => doc.document_type === 'snils')
    
    // Генерируем номер удостоверения (для примера берем первые 9 цифр ID)
    const certificateNumber = profile?.id?.replace(/\D/g, '').slice(0, 9).padStart(9, '0') || '000000000'

    return (
        <BaseDrawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Свидетельство пенсионера"
            footer={
                <Button
                    w="full"
                    size="2xl"
                    bg="blue.subtle"
                    color="blue.fg"
                    border="1px solid"
                    borderColor="blue.muted"
                    borderRadius="2xl"
                    onClick={onDownloadPDF}
                    loading={isDownloading}
                    _hover={{ bg: 'blue.subtleHover' }}
                    fontSize="xl"
                    lineHeight="30px"
                    fontWeight="normal"
                >
                    <Download size={24} style={{ marginRight: '12px' }} />
                    Скачать PDF
                </Button>
            }
        >
            <VStack align="stretch" gap="0" pb="8px">
                {/* Заголовок */}
                <Box pt="8px" pb="16px">
                    <Heading
                        as="h2"
                        fontSize="24px"
                        lineHeight="32px"
                        fontWeight="bold"
                        color="#27272A"
                        textTransform="uppercase"
                        letterSpacing="-0.2px"
                    >
                        Свидетельство<br />пенсионера
                    </Heading>
                </Box>

                {/* Номер */}
                <CertificateField 
                    label="Номер" 
                    value={certificateNumber}
                    isRed={true}
                />

                {/* Фамилия */}
                {profile?.last_name && (
                    <CertificateField 
                        label="Фамилия" 
                        value={profile.last_name} 
                    />
                )}

                {/* Имя */}
                {profile?.first_name && (
                    <CertificateField 
                        label="Имя" 
                        value={profile.first_name} 
                    />
                )}

                {/* Отчество */}
                {profile?.middle_name && (
                    <CertificateField 
                        label="Отчество" 
                        value={profile.middle_name} 
                    />
                )}

                {/* СНИЛС */}
                {snilsDoc?.document_number && (
                    <CertificateField 
                        label="СНИЛС" 
                        value={formatSnils(snilsDoc.document_number)} 
                    />
                )}

                {/* Вид пенсии */}
                <CertificateField 
                    label="Вид пенсии" 
                    value="По старости" 
                />

                {/* Срок действия */}
                <CertificateField 
                    label="Срок на который установлена пенсия" 
                    value="Бессрочно" 
                />
            </VStack>
        </BaseDrawer>
    )
}

