import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Download } from 'lucide-react'

import type { V1GetProfileResponse, DomainUserDocument } from '@/shared/api/generated'
import { FullScreenDrawer } from '@/shared/ui/full-screen-drawer'

export interface CertificateDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    profile?: V1GetProfileResponse
    onDownloadPDF: () => void
    isDownloading?: boolean
    groupType?: string // Тип группы пользователя
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
        borderColor="border"
        pb="16px"
        pt="16px"
    >
        <Text
            fontSize={"lg"}
            lineHeight="28px"
            fontWeight="normal"
            color="gray.600"
            mb="4px"
        >
            {label}
        </Text>
        <Text
            fontSize={"xl"}
            lineHeight="30px"
            fontWeight="bold"
            color={isRed ? "red.solid" : "gray.800"}
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
    groupType = 'pensioners', // По умолчанию пенсионеры
}: CertificateDrawerProps) => {
    const snilsDoc = profile?.documents?.find((doc: DomainUserDocument) => doc.document_type === 'snils')
    
    // Генерируем номер удостоверения (для примера берем первые 9 цифр ID)
    const certificateNumber = profile?.id?.replace(/\D/g, '').slice(0, 9).padStart(9, '0') || '000000000'

    // Определяем название документа в зависимости от типа группы
    const getDocumentTitle = (type: string): string => {
        switch (type) {
            case 'pensioners':
                return 'Свидетельство пенсионера'
            case 'disabled':
                return 'Справка инвалида'
            case 'students':
                return 'Студенческий билет'
            case 'young_families':
                return 'Удостоверение молодой семьи'
            case 'large_families':
                return 'Удостоверение многодетной семьи'
            case 'low_income':
                return 'Справка малоимущего'
            case 'children':
                return 'Свидетельство о рождении'
            case 'veterans':
                return 'Удостоверение ветерана'
            default:
                return 'Удостоверение'
        }
    }

    const documentTitle = getDocumentTitle(groupType)
    const documentTitleUppercase = documentTitle.replace('\n', ' ').toUpperCase()

    // Контент сертификата
    const certificateContent = (
        <VStack align="stretch" gap="0" pb="8px">
            {/* Заголовок */}
            <Box pt="8px" pb="16px">
                <Heading
                    as="h2"
                    fontSize={"2xl"}
                    lineHeight="32px"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="-0.2px"
                    dangerouslySetInnerHTML={{ __html: documentTitle.replace('\n', '<br />') }}
                />
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

            {/* Поля только для пенсионеров */}
            {groupType === 'pensioners' && (
                <>
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
                </>
            )}
        </VStack>
    )

    const downloadButton = (
        <Button
            _active={{ bg: 'white' }}
            variant='surface'
            color='blue.fg'
            colorPalette='blue'
            borderRadius="2xl"
            fontSize="xl"
            fontWeight="normal"
            lineHeight="30px"
            loading={isDownloading}
            size="2xl"
            transition='all 0.2s'
            w="full"
            onClick={onDownloadPDF}
        >
            <Download size={24} style={{ marginRight: '12px' }} />
            Скачать PDF
        </Button>
    )
    
    return (
        <FullScreenDrawer
            isOpen={isOpen}
            onClose={() => onOpenChange(false)}
            title=""
            footer={downloadButton}
        >
            {certificateContent}
        </FullScreenDrawer>
    )
}

