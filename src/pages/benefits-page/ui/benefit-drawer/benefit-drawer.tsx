import { useState } from 'react'
import { Badge, Box, Button, Heading, HStack, Spinner, Text, Image, VStack } from '@chakra-ui/react'

import { useGetBenefitsId } from '@/shared/api/generated/hooks/useGetBenefitsId'
import { AXIOS_INSTANCE } from '@/shared/api/axios-client'
import { FullScreenDrawer } from '@/shared/ui/full-screen-drawer'
import { BENEFIT_TYPES, CATEGORIES, TAGS, TARGET_GROUPS } from '../benefits-page/constants'

import benefitImage from '@/shared/assets/images/benefit.png'
import { LuRoute } from 'react-icons/lu'
import { Download } from 'lucide-react'

interface BenefitDrawerProps {
    isOpen: boolean
    onClose: () => void
    benefitId: string | null
}

export const BenefitDrawer = ({ isOpen, onClose, benefitId }: BenefitDrawerProps) => {
    const { data: benefit, isLoading, isError, error } = useGetBenefitsId(benefitId || '', {
        query: {
            enabled: Boolean(benefitId),
        },
    })
    const [isDownloading, setIsDownloading] = useState(false)

    // Функция скачивания PDF
    const handleDownloadPDF = async () => {
        if (!benefitId || !benefit) return

        try {
            setIsDownloading(true)
            const response = await AXIOS_INSTANCE.get(`/benefits/${benefitId}/pdfdownload`, {
                responseType: 'blob',
            })

            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Льгота_${benefit.title || 'без_названия'}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Ошибка при скачивании PDF:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    // Собираем теги в правильном порядке
    const tagsToDisplay: Array<{ label: string; isNew?: boolean }> = []

    if (benefit) {
        // 1. TAGS (если new - зеленая)
        if (benefit.tags && benefit.tags.length > 0) {
            benefit.tags.forEach((tag) => {
                const tagOption = TAGS.find((t) => t.value === tag)
                if (tagOption) {
                    tagsToDisplay.push({
                        label: tagOption.label,
                        isNew: tag === 'new',
                    })
                }
            })
        }

        // 2. BENEFIT_TYPES
        if (benefit.type) {
            const typeOption = BENEFIT_TYPES.find((t) => t.value === benefit.type)
            if (typeOption) {
                tagsToDisplay.push({ label: typeOption.label })
            }
        }

        // 3. TARGET_GROUPS
        if (benefit.target_groups && benefit.target_groups.length > 0) {
            benefit.target_groups.forEach((group) => {
                const groupOption = TARGET_GROUPS.find((g) => g.value === group)
                if (groupOption) {
                    tagsToDisplay.push({ label: groupOption.label })
                }
            })
        }

        // 4. CATEGORIES
        if (benefit.category) {
            const categoryOption = CATEGORIES.find((c) => c.value === benefit.category)
            if (categoryOption) {
                tagsToDisplay.push({ label: categoryOption.label })
            }
        }
    }

    return (
        <FullScreenDrawer isOpen={isOpen} onClose={onClose}>
            {isLoading ? (
                <Box py={12} textAlign="center" aria-live="polite">
                    <Spinner size="lg" />
                    <Text color="text.secondary" fontSize="md" mt={4}>
                        Загрузка...
                    </Text>
                </Box>
            ) : isError ? (
                <Box py={12} textAlign="center" role="alert">
                    <Text color="error.DEFAULT" fontSize="lg">
                        Не удалось загрузить льготу
                    </Text>
                </Box>
            ) : !benefit ? (
                <Box py={12} textAlign="center">
                    <Text color="text.secondary" fontSize="lg">
                        Льгота не найдена
                    </Text>
                </Box>
            ) : (
                <Box as="article">
                    {/* Теги/фильтры */}
                    {tagsToDisplay.length > 0 && (
                        <Box as="nav" aria-label="Категории льготы" mb={5}>
                            <HStack flexWrap="wrap" gap={2}>
                                {tagsToDisplay.map((tag, index) => (
                                    <Badge
                                        key={`${tag.label}-${index}`}
                                        bg={tag.isNew ? 'green.subtle' : 'gray.subtle'}
                                        color={tag.isNew ? 'green.fg' : 'gray.fg'}
                                        fontSize="sm"
                                        variant="subtle"
                                        size="lg"
                                        rounded="md"
                                        px={2.5}
                                        py={1}
                                    >
                                        {tag.label}
                                    </Badge>
                                ))}
                            </HStack>
                        </Box>
                    )}

                    {/* Заголовок */}
                    <Heading as="h1" fontSize="2xl" lineHeight="32px" fontWeight="bold" mb={2} id="benefit-title">
                        {benefit.title || 'Без названия'}
                    </Heading>

                    {/* Описание */}
                    {benefit.description && (
                        <Text fontSize="lg" color="gray.600" mb={5} lineHeight="28px">
                            {benefit.description}
                        </Text>
                    )}

                    <Image
                        src={benefitImage}
                        alt={benefit.title}
                        borderRadius="20px"
                        objectFit="cover"
                        mb={5}
                    />

                    {/* Секция "Кому положено" */}
                    {benefit.target_groups && benefit.target_groups.length > 0 && (
                        <Box as="section" aria-labelledby="eligible-heading" bg={'gray.100'} borderRadius="20px" p={4} mb={5}>
                            <Heading as="h2" id="eligible-heading" fontSize="xl" fontWeight="bold" mb={4} lineHeight="30px">
                                Кому положено
                            </Heading>
                            <Box as="ul" pl={5} style={{ listStyleType: 'disc' }}>
                                {benefit.target_groups.map((group) => {
                                    const groupOption = TARGET_GROUPS.find((g) => g.value === group)
                                    return groupOption ? (
                                        <Text as="li" key={group} fontSize="lg" color="gray.600" mb={2} lineHeight="28px">
                                            {groupOption.label}
                                        </Text>
                                    ) : null
                                })}
                            </Box>
                        </Box>
                    )}

                    {/* Секция "Какие документы нужны" */}
                    {benefit.requirement && (
                        <Box as="section" aria-labelledby="documents-heading" bg={'gray.100'} borderRadius="20px" p={4} mb={5}>
                            <Heading as="h2" id="documents-heading" fontSize="xl" fontWeight="bold" mb={4} lineHeight="30px">
                                Какие документы нужны
                            </Heading>
                            <Text fontSize="lg" color="gray.600" lineHeight="28px" whiteSpace="pre-line">
                                {benefit.requirement}
                            </Text>
                        </Box>
                    )}

                    {/* Секция "Как получить" */}
                    {benefit.how_to_use && (
                        <Box as="section" aria-labelledby="how-to-heading" bg={'gray.100'} borderRadius="20px" p={4} mb={5}>
                            <Heading as="h2" id="how-to-heading" fontSize="xl" fontWeight="bold" mb={4} lineHeight="30px">
                                Как получить
                            </Heading>
                            <Text fontSize="lg" color="gray.600" lineHeight="28px" whiteSpace="pre-line">
                                {benefit.how_to_use}
                            </Text>
                        </Box>
                    )}

                    {/* Секция "Где получить" */}
                    <VStack as="section" aria-labelledby="where-heading" bg={'gray.100'} borderRadius="20px" p={4} mb={5} gap={4} align="stretch">
                        <Heading as="h2" id="where-heading" fontSize="xl" fontWeight="bold" lineHeight="30px">
                            Где получить
                        </Heading>

                        {/* Аптека 1 */}
                        <Box p={4} bg="white" borderRadius="xl">
                            {/* Теги доступности */}
                            <HStack gap={2} mb={2}>
                                <Badge
                                    bg="gray.subtle"
                                    color="gray.fg"
                                    fontSize="sm"
                                    variant="subtle"
                                    size="lg"
                                    rounded="md"
                                    px={2.5}
                                    py={1}
                                >
                                    С пандусом
                                </Badge>
                                <Badge
                                    bg="gray.subtle"
                                    color="gray.fg"
                                    fontSize="sm"
                                    variant="subtle"
                                    size="lg"
                                    rounded="md"
                                    px={2.5}
                                    py={1}
                                >
                                    С подъемником
                                </Badge>
                            </HStack>
                            <Heading as="h3" fontSize="xl" fontWeight="bold" mb={2} lineHeight="30px">
                                Аптека 1
                            </Heading>
                            <Text fontSize="lg" color="gray.600" lineHeight="28px">
                                пн-пт 09:00-22:00
                            </Text>
                            <Text fontSize="lg" color="gray.600" lineHeight="28px">
                                сб-вс 10:00-20:00
                            </Text>
                            <Button
                                variant="outline"
                                colorPalette="blue"
                                size="2xl"
                                rounded="xl"
                                aria-label="Построить маршрут до Аптеки 1"
                                mt={4}
                                w="full"
                                fontSize="xl"
                                lineHeight="30px"
                                color="blue.fg"
                                borderColor="blue.muted"
                            >
                                <LuRoute /> Построить маршрут
                            </Button>
                        </Box>

                        {/* Аптека 1 */}
                        <Box p={4} bg="white" borderRadius="xl">
                            {/* Теги доступности */}
                            <HStack gap={2} mb={2}>
                                <Badge
                                    bg="gray.subtle"
                                    color="gray.fg"
                                    fontSize="sm"
                                    variant="subtle"
                                    size="lg"
                                    rounded="md"
                                    px={2.5}
                                    py={1}
                                >
                                    С пандусом
                                </Badge>
                                <Badge
                                    bg="gray.subtle"
                                    color="gray.fg"
                                    fontSize="sm"
                                    variant="subtle"
                                    size="lg"
                                    rounded="md"
                                    px={2.5}
                                    py={1}
                                >
                                    С подъемником
                                </Badge>
                            </HStack>
                            <Heading as="h3" fontSize="xl" fontWeight="bold" mb={2} lineHeight="30px">
                                Аптека 1
                            </Heading>
                            <Text fontSize="lg" color="gray.600" lineHeight="28px">
                                пн-пт 09:00-22:00
                            </Text>
                            <Text fontSize="lg" color="gray.600" lineHeight="28px">
                                сб-вс 10:00-20:00
                            </Text>
                            <Button
                                variant="outline"
                                colorPalette="blue"
                                size="2xl"
                                rounded="xl"
                                aria-label="Построить маршрут до Аптеки 1"
                                mt={4}
                                w="full"
                                fontSize="xl"
                                lineHeight="30px"
                                color="blue.fg"
                                borderColor="blue.muted"
                            >
                                <LuRoute /> Построить маршрут
                            </Button>
                        </Box>
                    </VStack>

                    <Button
                        w="full"
                        size="2xl"
                        bg="blue.subtle"
                        color="blue.fg"
                        border="1px solid"
                        borderColor="blue.muted"
                        borderRadius="2xl"
                        onClick={handleDownloadPDF}
                        loading={isDownloading}
                        _hover={{ bg: 'blue.subtleHover' }}
                        fontSize="xl"
                        lineHeight="30px"
                        fontWeight="normal"
                        mb={6}
                    >
                        <Download size={24} style={{ marginRight: '12px' }} />
                        Скачать PDF
                    </Button>
                </Box>
            )}
        </FullScreenDrawer>
    )
}

