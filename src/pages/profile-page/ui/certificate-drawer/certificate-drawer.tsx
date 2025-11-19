import { Box, Button, Dialog, Heading, Text, VStack, useBreakpointValue } from '@chakra-ui/react'
import { Download, X } from 'lucide-react'

import { BaseDrawer } from '@/shared/ui/base-drawer'
import type { V1GetProfileResponse, DomainUserDocument } from '@/shared/api/generated'

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
    groupType = 'pensioners', // По умолчанию пенсионеры
}: CertificateDrawerProps) => {
    const snilsDoc = profile?.documents?.find((doc: DomainUserDocument) => doc.document_type === 'snils')
    
    // Генерируем номер удостоверения (для примера берем первые 9 цифр ID)
    const certificateNumber = profile?.id?.replace(/\D/g, '').slice(0, 9).padStart(9, '0') || '000000000'

    // Определяем название документа в зависимости от типа группы
    const getDocumentTitle = (type: string): string => {
        switch (type) {
            case 'pensioners':
                return 'Свидетельство\nпенсионера'
            case 'disabled':
                return 'Справка\nинвалида'
            case 'students':
                return 'Студенческий\nбилет'
            case 'young_families':
                return 'Удостоверение\nмолодой семьи'
            case 'large_families':
                return 'Удостоверение\nмногодетной семьи'
            case 'low_income':
                return 'Справка\nмалоимущего'
            case 'children':
                return 'Свидетельство\nо рождении'
            case 'veterans':
                return 'Удостоверение\nветерана'
            default:
                return 'Удостоверение'
        }
    }

    const documentTitle = getDocumentTitle(groupType)
    const documentTitleUppercase = documentTitle.replace('\n', ' ').toUpperCase()

    // Определяем, использовать ли модальное окно или drawer
    const useModal = useBreakpointValue({ base: false, md: true })

    // Контент сертификата
    const certificateContent = (
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
    )

    // Desktop: Modal
    if (useModal) {
        return (
            <Dialog.Root 
                open={isOpen} 
                onOpenChange={(e) => onOpenChange(e.open)}
                size="lg"
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        borderRadius="20px"
                        maxW="540px"
                        maxH="90vh"
                        bg="white"
                    >
                        <Dialog.Header
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            pb={4}
                            pt={6}
                            px={6}
                        >
                            <Dialog.Title fontSize="2xl" fontWeight="bold">
                                {documentTitleUppercase}
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    p={2}
                                    minW="auto"
                                    h="auto"
                                >
                                    <X size={20} />
                                </Button>
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body 
                            px={6} 
                            py={0}
                            overflowY="auto"
                            maxH="calc(90vh - 200px)"
                        >
                            {certificateContent}
                        </Dialog.Body>
                        <Dialog.Footer px={6} pt={4} pb={6}>
                            {downloadButton}
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        )
    }

    // Mobile: Drawer
    return (
        <BaseDrawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={documentTitle.replace('\n', ' ')}
            footer={downloadButton}
        >
            {certificateContent}
        </BaseDrawer>
    )
}

