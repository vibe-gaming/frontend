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

// Типы для зданий и организаций
interface Building {
    id?: string
    name?: string
    address?: string
    phone_number?: string
    gis_deeplink?: string
    start_time?: string
    end_time?: string
    is_open?: boolean
    tags?: string[]
    latitude?: number
    longitude?: number
    category?: string
    type?: string // pharmacy, hospital, etc.
}

interface Organization {
    id?: string
    name?: string
    buildings?: Building[]
}

// Расширенный тип ответа с organization
interface BenefitResponseWithOrganization {
    organization?: Organization
    [key: string]: any
}

export const BenefitDrawer = ({ isOpen, onClose, benefitId }: BenefitDrawerProps) => {
    const { data: benefitData, isLoading, isError, error } = useGetBenefitsId(benefitId || '', {
        query: {
            enabled: Boolean(benefitId),
        },
    })
    const [isDownloading, setIsDownloading] = useState(false)
    
    // Типизируем benefit с поддержкой organization
    const benefit = benefitData as BenefitResponseWithOrganization | undefined
    
    // Получаем список зданий
    const buildings = benefit?.organization?.buildings || []

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
    
    // Функция построения маршрута
    const handleBuildRoute = (building: Building) => {
        console.log('handleBuildRoute called', building)
        
        // Определяем URL для перехода
        let targetUrl = ''
        
        if (building.gis_deeplink) {
            targetUrl = building.gis_deeplink
            console.log('Using gis_deeplink:', targetUrl)
        } else if (building.latitude && building.longitude) {
            targetUrl = `https://yandex.ru/maps/?rtext=~${building.latitude},${building.longitude}`
            console.log('Using coordinates:', targetUrl)
        } else {
            console.warn('Нет данных для построения маршрута:', building)
            return
        }
        
        // Пробуем открыть ссылку разными способами для максимальной совместимости
        try {
            // Способ 1: window.open с явными параметрами
            const newWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer')
            
            // Если window.open был заблокирован браузером
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                console.warn('window.open was blocked, using location.href')
                // Способ 2: прямой переход
                window.location.href = targetUrl
            } else {
                console.log('Successfully opened in new tab')
            }
        } catch (error) {
            console.error('Error opening route:', error)
            // Способ 3: fallback на location.href
            window.location.href = targetUrl
        }
    }
    
    // Функция форматирования времени из ISO в HH:MM
    const formatTime = (isoTime?: string): string => {
        if (!isoTime) return ''
        try {
            const date = new Date(isoTime)
            return date.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: 'Asia/Yakutsk' // Якутское время
            })
        } catch (e) {
            return ''
        }
    }
    
    // Функция получения дня недели из ISO даты
    const getDayOfWeek = (isoTime?: string): string => {
        if (!isoTime) return ''
        try {
            const date = new Date(isoTime)
            const day = date.getDay()
            // 0 - воскресенье, 6 - суббота, 1-5 - пн-пт
            if (day === 0 || day === 6) {
                return 'сб-вс'
            }
            return 'пн-пт'
        } catch (e) {
            return ''
        }
    }

    // Собираем теги в правильном порядке
    const tagsToDisplay: Array<{ label: string; isNew?: boolean }> = []

    if (benefit) {
        // 1. TAGS (если new - зеленая)
        if (benefit.tags && benefit.tags.length > 0) {
            benefit.tags.forEach((tag: string) => {
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
            benefit.target_groups.forEach((group: string) => {
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
                                {benefit.target_groups.map((group: string) => {
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
                    {buildings.length > 0 && (
                        <VStack as="section" aria-labelledby="where-heading" bg={'gray.100'} borderRadius="20px" p={4} mb={5} gap={4} align="stretch">
                            <Heading as="h2" id="where-heading" fontSize="xl" fontWeight="bold" lineHeight="30px">
                                Где получить
                            </Heading>

                            {buildings.map((building, index) => {
                                const hasPandus = building.tags?.includes('pandus')
                                const hasLift = building.tags?.includes('lift')
                                const showAccessibilityBadges = hasPandus || hasLift
                                
                                // Определяем название по типу здания
                                const getBuildingName = () => {
                                    if (building.category) return building.category
                                    if (building.name) return building.name
                                    if (building.type === 'pharmacy') return `Аптека`
                                    return `Место`
                                }
                                
                                return (
                                    <Box key={building.id || index} p={4} bg="white" borderRadius="xl">
                                        {/* Теги доступности */}
                                        {showAccessibilityBadges && (
                                            <HStack gap={2} mb={2}>
                                                {hasPandus && (
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
                                                )}
                                                {hasLift && (
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
                                                )}
                                            </HStack>
                                        )}
                                        
                                        <Heading as="h3" fontSize="xl" fontWeight="bold" mb={2} lineHeight="30px">
                                            {getBuildingName()}
                                        </Heading>
                                        
                                        {building.address && (
                                            <Text fontSize="lg" color="gray.600" lineHeight="28px" mb={1}>
                                                {building.address}
                                            </Text>
                                        )}
                                        
                                        {building.phone_number && (
                                            <Text fontSize="lg" color="gray.600" lineHeight="28px" mb={1}>
                                                {building.phone_number}
                                            </Text>
                                        )}
                                        
                                        {building.start_time && building.end_time && (
                                            <Text fontSize="lg" color="gray.600" lineHeight="28px">
                                                {getDayOfWeek(building.start_time)} {formatTime(building.start_time)}-{formatTime(building.end_time)}
                                            </Text>
                                        )}
                                        
                                        {building.is_open !== undefined && (
                                            <Badge
                                                bg={building.is_open ? 'green.subtle' : 'red.subtle'}
                                                color={building.is_open ? 'green.fg' : 'red.fg'}
                                                fontSize="sm"
                                                variant="subtle"
                                                size="lg"
                                                rounded="md"
                                                px={2.5}
                                                py={1}
                                                mt={2}
                                            >
                                                {building.is_open ? 'Открыто' : 'Закрыто'}
                                            </Badge>
                                        )}
                                        
                                        <Button
                                            variant="outline"
                                            colorPalette="blue"
                                            size="2xl"
                                            rounded="xl"
                                            aria-label={`Построить маршрут до ${getBuildingName()}`}
                                            mt={4}
                                            w="full"
                                            fontSize="xl"
                                            lineHeight="30px"
                                            color="blue.fg"
                                            borderColor="blue.muted"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleBuildRoute(building)
                                            }}
                                            cursor="pointer"
                                        >
                                            <LuRoute /> Построить маршрут
                                        </Button>
                                    </Box>
                                )
                            })}
                        </VStack>
                    )}

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

