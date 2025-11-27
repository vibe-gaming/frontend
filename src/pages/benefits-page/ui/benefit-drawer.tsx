import { useCallback, useEffect, useState } from 'react'
import {
    Badge,
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Image,
    Spinner,
    Text,
    useMediaQuery,
    VStack,
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { FaHeart } from 'react-icons/fa'
import { LuHeart, LuRoute } from 'react-icons/lu'

import { AXIOS_INSTANCE } from '@/shared/api/axios-client'
import { useGetBenefitsId } from '@/shared/api/generated/hooks/useGetBenefitsId'
import { usePostBenefitsIdFavorite } from '@/shared/api/generated/hooks/usePostBenefitsIdFavorite'
import benefitImage from '@/shared/assets/images/benefit.webp'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'
import { FullScreenDrawer } from '@/shared/ui/full-screen-drawer'
import { getBenefitsFromStorage } from '@/shared/utils/benefits-storage'

import { BENEFIT_TYPES, CATEGORIES, TAGS, TARGET_GROUPS } from '../model/constants'

interface BenefitDrawerProps {
    isOpen: boolean
    onClose: () => void
    benefitId: string | null
    onFavoriteChange?: () => void
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

export const BenefitDrawer = ({
    isOpen,
    onClose,
    benefitId,
    onFavoriteChange,
}: BenefitDrawerProps) => {
    const [isDesktop] = useMediaQuery(['(min-width: 768px)'])
    const isMobile = !isDesktop
    const isOnline = useOnlineStatus()
    const isOfflineMode = isMobile && !isOnline
    const queryClient = useQueryClient()

    // Пытаемся получить данные из localStorage в офлайне
    const getOfflineBenefit = () => {
        if (!isOfflineMode || !benefitId) return null
        const stored = getBenefitsFromStorage()
        if (stored) {
            return stored.benefits.find((b) => b.id === benefitId) || null
        }

        return null
    }

    const offlineBenefit = isOfflineMode ? getOfflineBenefit() : null

    const {
        data: benefitData,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetBenefitsId(benefitId || '', {
        query: {
            enabled: Boolean(benefitId) && !isOfflineMode, // Не делаем запрос в офлайне на мобильных
            refetchOnMount: true, // Всегда обновляем данные при открытии
            refetchOnWindowFocus: false,
        },
    })

    // Обновляем данные при изменении benefitId (когда открывается drawer)
    useEffect(() => {
        if (isOpen && benefitId && !isOfflineMode) {
            refetch()
        }
    }, [isOpen, benefitId, isOfflineMode, refetch])
    const [isDownloading, setIsDownloading] = useState(false)

    // Используем офлайн данные если они есть, иначе данные из API
    const benefit =
        isOfflineMode && offlineBenefit
            ? (offlineBenefit as BenefitResponseWithOrganization)
            : (benefitData as BenefitResponseWithOrganization | undefined)

    // Локальное состояние для избранного
    const [localIsFavorite, setLocalIsFavorite] = useState(false)

    // Обновляем локальное состояние при изменении данных
    useEffect(() => {
        if (benefit?.favorite !== undefined) {
            setLocalIsFavorite(benefit.favorite)
        }
    }, [benefit?.favorite])

    // Мутация для изменения статуса избранного
    const favoriteMutation = usePostBenefitsIdFavorite({
        mutation: {
            onSuccess: () => {
                setLocalIsFavorite(!localIsFavorite)

                // Инвалидируем кэш для конкретной льготы и списка льгот
                queryClient.invalidateQueries({
                    queryKey: [{ url: '/benefits' }],
                })
                if (benefitId) {
                    queryClient.invalidateQueries({
                        queryKey: [{ url: `/benefits/${benefitId}` }],
                    })
                }

                // Обновляем данные после изменения
                refetch()
                // Вызываем callback для обновления списка
                onFavoriteChange?.()
            },
        },
    })

    // Получаем список зданий (может отсутствовать в офлайн данных)
    const buildings = benefit?.organization?.buildings || []
    const hasOrganizationData = Boolean(benefit?.organization?.buildings?.length)

    // Функция изменения статуса избранного
    const handleFavoriteClick = () => {
        if (benefitId) {
            favoriteMutation.mutate({ id: benefitId })
        }
    }

    // Функция скачивания PDF
    const handleDownloadPDF = async () => {
        if (!benefitId || !benefit) return

        try {
            setIsDownloading(true)
            const response = await AXIOS_INSTANCE.get(`/benefits/${benefitId}/pdfdownload`, {
                responseType: 'blob',
            })

            // Создаем ссылку для скачивания
            const url = globalThis.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Льгота_${benefit.title || 'без_названия'}.pdf`)
            document.body.append(link)
            link.click()
            link.remove()
            globalThis.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Ошибка при скачивании PDF:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    // Функция построения маршрута
    const handleBuildRoute = useCallback((building: Building) => {
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
            if (!newWindow || newWindow.closed || newWindow.closed === undefined) {
                console.warn('window.open was blocked, using location.href')
                // Способ 2: прямой переход
                globalThis.location.href = targetUrl
            } else {
                console.log('Successfully opened in new tab')
            }
        } catch (error) {
            console.error('Error opening route:', error)
            // Способ 3: fallback на location.href
            globalThis.location.href = targetUrl
        }
    }, [])

    // Функция форматирования времени из ISO в HH:MM
    const formatTime = useCallback((isoTime?: string): string => {
        if (!isoTime) return ''
        try {
            const date = new Date(isoTime)

            return date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Yakutsk', // Якутское время
            })
        } catch {
            return ''
        }
    }, [])

    // Функция получения дня недели из ISO даты
    const getDayOfWeek = useCallback((isoTime?: string): string => {
        if (!isoTime) return ''
        try {
            const date = new Date(isoTime)
            const day = date.getDay()
            // 0 - воскресенье, 6 - суббота, 1-5 - пн-пт
            if (day === 0 || day === 6) {
                return 'сб-вс'
            }

            return 'пн-пт'
        } catch {
            return ''
        }
    }, [])

    // Собираем теги в правильном порядке
    const tagsToDisplay: Array<{ label: string; isNew?: boolean }> = []

    if (benefit) {
        // 1. TAGS (если new - зеленая)
        if (benefit.tags && benefit.tags.length > 0) {
            for (const tag of benefit.tags) {
                const tagOption = TAGS.find((t) => t.value === tag)
                if (tagOption) {
                    tagsToDisplay.push({
                        label: tagOption.label,
                        isNew: tag === 'new',
                    })
                }
            }
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
            for (const group of benefit.target_groups) {
                const groupOption = TARGET_GROUPS.find((g) => g.value === group)
                if (groupOption) {
                    tagsToDisplay.push({ label: groupOption.label })
                }
            }
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
                <Box aria-live='polite' py={12} textAlign='center'>
                    <Spinner size='lg' />
                    <Text color='text.secondary' fontSize='md' mt={4}>
                        Загрузка...
                    </Text>
                </Box>
            ) : isError ? (
                <Box py={12} role='alert' textAlign='center'>
                    <Text color='error.DEFAULT' fontSize='lg'>
                        Не удалось загрузить льготу
                    </Text>
                </Box>
            ) : benefit ? (
                <VStack align='stretch' as='article'>
                    {/* Теги/фильтры */}
                    {tagsToDisplay.length > 0 && (
                        <Box aria-label='Категории льготы' as='nav' mb={5}>
                            <HStack flexWrap='wrap' gap={2}>
                                {tagsToDisplay.map((tag, index) => (
                                    <Badge
                                        key={`${tag.label}-${index}`}
                                        bg={tag.isNew ? 'green.subtle' : 'gray.subtle'}
                                        color={tag.isNew ? 'green.fg' : 'gray.fg'}
                                        fontSize='sm'
                                        px={2.5}
                                        py={1}
                                        rounded='md'
                                        size='lg'
                                        variant='subtle'
                                    >
                                        {tag.label}
                                    </Badge>
                                ))}
                            </HStack>
                        </Box>
                    )}

                    {/* Заголовок */}
                    <HStack align='flex-start' justify='space-between' mb={2}>
                        <Heading
                            as='h1'
                            flex={1}
                            fontSize={{ base: '2xl', md: '3xl' }}
                            fontWeight='bold'
                            id='benefit-title'
                            lineHeight={{ base: '32px', md: '38px' }}
                        >
                            {benefit.title || 'Без названия'}
                        </Heading>
                    </HStack>

                    {/* Описание */}
                    {benefit.description && (
                        <Text color='gray.600' fontSize='lg' lineHeight='28px' mb={5}>
                            {benefit.description}
                        </Text>
                    )}

                    {/* Изображение - только когда есть интернет */}
                    {!isOfflineMode && (
                        <Image
                            alt={benefit.title}
                            borderRadius='20px'
                            mb={5}
                            objectFit='cover'
                            src={benefitImage}
                            width={'512px'}
                        />
                    )}

                    {/* Секция "Кому положено" */}
                    {benefit.target_groups && benefit.target_groups.length > 0 && (
                        <Box
                            aria-labelledby='eligible-heading'
                            as='section'
                            bg={'gray.100'}
                            borderRadius='20px'
                            mb={3}
                            p={4}
                        >
                            <Heading
                                as='h2'
                                fontSize={{ base: 'xl', md: '2xl' }}
                                fontWeight='bold'
                                id='eligible-heading'
                                lineHeight={{ base: '30px', md: '38px' }}
                                mb={4}
                            >
                                Кому положено
                            </Heading>
                            <Box as='ul' pl={5} style={{ listStyleType: 'disc' }}>
                                {benefit.target_groups.map((group: string) => {
                                    const groupOption = TARGET_GROUPS.find((g) => g.value === group)

                                    return groupOption ? (
                                        <Text
                                            key={group}
                                            as='li'
                                            color='gray.600'
                                            fontSize='lg'
                                            lineHeight='28px'
                                            mb={2}
                                        >
                                            {groupOption.label}
                                        </Text>
                                    ) : null
                                })}
                            </Box>
                        </Box>
                    )}

                    {/* Секция "Какие документы нужны" */}
                    {benefit.requirement && (
                        <Box
                            aria-labelledby='documents-heading'
                            as='section'
                            bg={'gray.100'}
                            borderRadius='20px'
                            mb={3}
                            p={4}
                        >
                            <Heading
                                as='h2'
                                fontSize={{ base: 'xl', md: '2xl' }}
                                fontWeight='bold'
                                id='documents-heading'
                                lineHeight={{ base: '30px', md: '38px' }}
                                mb={4}
                            >
                                Какие документы нужны
                            </Heading>
                            <Text
                                color='gray.600'
                                fontSize='lg'
                                lineHeight='28px'
                                whiteSpace='pre-line'
                            >
                                {benefit.requirement}
                            </Text>
                        </Box>
                    )}

                    {/* Секция "Как получить" */}
                    {benefit.how_to_use && (
                        <Box
                            aria-labelledby='how-to-heading'
                            as='section'
                            bg={'gray.100'}
                            borderRadius='20px'
                            mb={3}
                            p={4}
                        >
                            <Heading
                                as='h2'
                                fontSize={{ base: 'xl', md: '2xl' }}
                                fontWeight='bold'
                                id='how-to-heading'
                                lineHeight={{ base: '30px', md: '38px' }}
                                mb={4}
                            >
                                Как получить
                            </Heading>
                            <Text
                                color='gray.600'
                                fontSize='lg'
                                lineHeight='28px'
                                whiteSpace='pre-line'
                            >
                                {benefit.how_to_use}
                            </Text>
                        </Box>
                    )}

                    {/* Секция "Где получить" - только если есть данные об организации */}
                    {hasOrganizationData && buildings.length > 0 && (
                        <VStack
                            align='stretch'
                            aria-labelledby='where-heading'
                            as='section'
                            bg={'gray.100'}
                            borderRadius='20px'
                            gap={4}
                            mb={3}
                            p={4}
                        >
                            <Heading
                                as='h2'
                                fontSize='xl'
                                fontWeight='bold'
                                id='where-heading'
                                lineHeight='30px'
                            >
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
                                    <Box
                                        key={building.id || index}
                                        bg='white'
                                        borderRadius='xl'
                                        p={4}
                                    >
                                        {/* Теги доступности */}
                                        {showAccessibilityBadges && (
                                            <HStack gap={2} mb={2}>
                                                {hasPandus && (
                                                    <Badge
                                                        bg='gray.subtle'
                                                        color='gray.fg'
                                                        fontSize='sm'
                                                        px={2.5}
                                                        py={1}
                                                        rounded='md'
                                                        size='lg'
                                                        variant='subtle'
                                                    >
                                                        С пандусом
                                                    </Badge>
                                                )}
                                                {hasLift && (
                                                    <Badge
                                                        bg='gray.subtle'
                                                        color='gray.fg'
                                                        fontSize='sm'
                                                        px={2.5}
                                                        py={1}
                                                        rounded='md'
                                                        size='lg'
                                                        variant='subtle'
                                                    >
                                                        С подъемником
                                                    </Badge>
                                                )}
                                            </HStack>
                                        )}

                                        <Heading
                                            as='h3'
                                            fontSize='xl'
                                            fontWeight='bold'
                                            lineHeight='30px'
                                            mb={2}
                                        >
                                            {getBuildingName()}
                                        </Heading>

                                        {building.address && (
                                            <Text
                                                color='gray.600'
                                                fontSize='lg'
                                                lineHeight='28px'
                                                mb={1}
                                            >
                                                {building.address}
                                            </Text>
                                        )}

                                        {building.phone_number && (
                                            <Text
                                                color='gray.600'
                                                fontSize='lg'
                                                lineHeight='28px'
                                                mb={1}
                                            >
                                                {building.phone_number}
                                            </Text>
                                        )}

                                        {building.start_time && building.end_time && (
                                            <Text color='gray.600' fontSize='lg' lineHeight='28px'>
                                                {getDayOfWeek(building.start_time)}{' '}
                                                {formatTime(building.start_time)}-
                                                {formatTime(building.end_time)}
                                            </Text>
                                        )}

                                        {building.is_open !== undefined && (
                                            <Badge
                                                color={building.is_open ? 'green.fg' : 'red.fg'}
                                                fontSize='sm'
                                                mt={2}
                                                px={2.5}
                                                py={1}
                                                rounded='md'
                                                size='lg'
                                                variant='subtle'
                                                bg={
                                                    building.is_open ? 'green.subtle' : 'red.subtle'
                                                }
                                            >
                                                {building.is_open ? 'Открыто' : 'Закрыто'}
                                            </Badge>
                                        )}

                                        <Button
                                            _active={{ bg: 'blue.50', borderColor: 'blue.300' }}
                                            aria-label={`Построить маршрут до ${getBuildingName()}`}
                                            borderColor='blue.muted'
                                            color='blue.fg'
                                            colorPalette='blue'
                                            cursor='pointer'
                                            fontSize='xl'
                                            lineHeight='30px'
                                            mt={4}
                                            rounded='xl'
                                            size='2xl'
                                            transition='all 0.2s'
                                            variant='outline'
                                            w='full'
                                            onClick={(event) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                                handleBuildRoute(building)
                                            }}
                                        >
                                            <LuRoute /> Построить маршрут
                                        </Button>
                                    </Box>
                                )
                            })}
                        </VStack>
                    )}

                    {/* Кнопка скачивания PDF - только когда есть интернет */}
                    {!isOfflineMode && (
                        <Button
                            _active={{ bg: 'blue.100' }}
                            // _hover={{ bg: 'blue.subtleHover' }}
                            // bg='blue.subtle'
                            border='1px solid'
                            borderColor='blue.muted'
                            borderRadius='2xl'
                            color='blue.fg'
                            colorPalette='blue'
                            fontSize='xl'
                            fontWeight='normal'
                            lineHeight='30px'
                            loading={isDownloading}
                            mb={6}
                            ml={{ base: 'auto', md: 'auto' }}
                            size='2xl'
                            transition='all 0.2s'
                            variant='surface'
                            w={{ base: 'full', md: '218px' }}
                            onClick={handleDownloadPDF}
                        >
                            <Download size={24} style={{ marginRight: '12px' }} />
                            Скачать PDF
                        </Button>
                    )}
                </VStack>
            ) : (
                <Box py={12} textAlign='center'>
                    <Text color='text.secondary' fontSize='lg'>
                        Льгота не найдена
                    </Text>
                </Box>
            )}
        </FullScreenDrawer>
    )
}
