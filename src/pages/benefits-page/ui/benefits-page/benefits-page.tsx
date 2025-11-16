import { useMemo, useRef, useState } from 'react'
import { createListCollection } from '@chakra-ui/react'
import {
    Badge,
    Box,
    Button,
    Drawer,
    Field,
    Flex,
    Heading,
    HStack,
    Input,
    Select,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react'

import { LuChevronDown, LuX } from "react-icons/lu"

import { useGetBenefits } from '@/shared/api/generated/hooks/useGetBenefits'
import { useGetCities } from '@/shared/api/generated/hooks/useGetCities'
import { useDebounce } from '@/shared/hooks/use-debounce'

import styles from './benefits-page.module.scss'
import { HeaderMobile } from '@/shared/ui/header-mobile'

const BENEFIT_TYPES = [
    { value: 'federal', label: 'Федеральная' },
    { value: 'regional', label: 'Региональная' },
    { value: 'commercial', label: 'Коммерческая' },
] as const

const TARGET_GROUPS = [
    { value: 'pensioners', label: 'Пенсионеры' },
    { value: 'disabled', label: 'Инвалиды' },
    { value: 'students', label: 'Студенты' },
    { value: 'young_families', label: 'Молодые семьи' },
    { value: 'low_income', label: 'Малоимущие' },
    { value: 'large_families', label: 'Многодетные семьи' },
    { value: 'children', label: 'Дети' },
    { value: 'veterans', label: 'Ветераны' },
] as const

const TAGS = [
    { value: 'most_popular', label: 'Самые популярные' },
    { value: 'new', label: 'Новые' },
    { value: 'hot', label: 'Горячие' },
    { value: 'best', label: 'Лучшие' },
    { value: 'recommended', label: 'Рекомендуемые' },
    { value: 'popular', label: 'Популярные' },
] as const

const CATEGORIES = [
    { value: 'medicine', label: 'Медицина' },
    { value: 'transport', label: 'Транспорт' },
    { value: 'food', label: 'Питание' },
    { value: 'clothing', label: 'Одежда' },
    { value: 'education', label: 'Образование' },
    { value: 'payments', label: 'Выплаты' },
    { value: 'other', label: 'Другое' },
] as const

const ITEMS_PER_PAGE = 20

export const BenefitsPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [benefitTypes, setBenefitTypes] = useState<string[]>([])
    const [targetGroups, setTargetGroups] = useState<string[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [cityId, setCityId] = useState<string>('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)

    const filtersDrawerRef = useRef<HTMLDivElement>(null)
    const sortDrawerRef = useRef<HTMLDivElement>(null)
    const touchStartY = useRef<number>(0)
    const touchCurrentY = useRef<number>(0)

    const debouncedSearch = useDebounce(searchQuery, 500)
    // Запрос к городам выполняется только при открытии Drawer с фильтрами
    const { data: citiesData, error: citiesError, isError: isCitiesError } = useGetCities({
        query: {
            enabled: isFiltersOpen, // Запрос выполняется только когда Drawer открыт
        },
    })
    
    // Логирование ошибок для диагностики CORS
    if (isCitiesError && process.env.NODE_ENV === 'development') {
        console.error('Cities API Error:', citiesError)
    }

    const citiesCollection = useMemo(() => {
        const items = [
            { value: '', label: 'Все города' },
            ...(citiesData?.map((city) => ({
                value: city.id || '',
                label: city.name || '',
            })) || []),
        ]
        return createListCollection({ items })
    }, [citiesData])

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useGetBenefits>[0] = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
        }

        if (debouncedSearch) {
            params.search = debouncedSearch
        }

        if (benefitTypes.length > 0) {
            params.type = benefitTypes.join(',')
        }

        if (targetGroups.length > 0) {
            params.target_groups = targetGroups.join(',')
        }

        if (tags.length > 0) {
            params.tags = tags.join(',')
        }

        if (categories.length > 0) {
            params.categories = categories.join(',')
        }

        if (cityId) {
            params.city_id = cityId
        }

        if (dateFrom) {
            params.date_from = dateFrom
        }

        if (dateTo) {
            params.date_to = dateTo
        }

        return params
    }, [debouncedSearch, benefitTypes, targetGroups, tags, categories, cityId, dateFrom, dateTo, currentPage])

    const { data, isLoading, isError, error } = useGetBenefits(queryParams)

    const handleResetFilters = () => {
        setSearchQuery('')
        setBenefitTypes([])
        setTargetGroups([])
        setTags([])
        setCategories([])
        setCityId('')
        setDateFrom('')
        setDateTo('')
        setCurrentPage(1)
    }

    const handleApplyFilters = () => {
        setCurrentPage(1)
        setIsFiltersOpen(false)
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: React.TouchEvent, drawerType: 'filters' | 'sort') => {
        const target = e.currentTarget as HTMLElement
        const touchY = e.touches[0].clientY
        const rect = target.getBoundingClientRect()

        // Проверяем, что свайп начинается в верхней части drawer (первые 100px)
        if (touchY - rect.top < 100) {
            touchCurrentY.current = touchY
            const deltaY = touchCurrentY.current - touchStartY.current

            // Если свайп вниз больше 50px, закрываем drawer
            if (deltaY > 50) {
                if (drawerType === 'filters') {
                    setIsFiltersOpen(false)
                } else {
                    setIsSortOpen(false)
                }
            }
        }
    }

    const totalPages = data?.total ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1

    if (isError) {
        return (
            <Box p={8}>
                <Text color='error.DEFAULT'>Не удалось загрузить льготы</Text>
                {error && 'error_message' in error && error.error_message && (
                    <Text color='text.secondary' fontSize='sm' mt={2}>
                        {error.error_message}
                    </Text>
                )}
            </Box>
        )
    }

    return (
        <>
            <HeaderMobile title='' />

            <Box className={styles['benefits-page']} pt={`var(--header-mobile-height)`}>
                <VStack align='stretch' gap={4} px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }} >
                    <Heading as='h1' fontWeight='bold' size='2xl'>Льготы</Heading>
                    <Input
                        variant="subtle"
                        type="default"
                        size="2xl"
                        placeholder='Поиск по льготам'
                        value={searchQuery}
                        bg='bg.muted'
                        rounded={'2xl'}
                        onChange={(event) => {
                            setSearchQuery(event.target.value)
                            setCurrentPage(1)
                        }}
                    />

                    {/* Кнопки Фильтр и Сортировка */}
                    <HStack gap={2}>
                        <Button
                            size="xl"
                            variant="outline"
                            rounded="xl"
                            onClick={() => setIsFiltersOpen(true)}
                        >
                            Фильтр <LuChevronDown />
                        </Button>
                        <Button
                            size="xl"
                            variant="outline"
                            rounded="xl"
                            onClick={() => setIsSortOpen(true)}
                        >
                            Сортировка <LuChevronDown />
                        </Button>
                    </HStack>

                    {/* Результаты */}
                    {isLoading ? (
                        <Box py={12} textAlign='center'>
                            <Spinner size='lg' />
                        </Box>
                    ) : !data?.benefits || data.benefits.length === 0 ? (
                        <Box py={12} textAlign='center'>
                            <Text color='text.secondary' fontSize='lg'>
                                Льготы не найдены
                            </Text>
                            <Text color='text.secondary' fontSize='sm' mt={2}>
                                Попробуйте изменить параметры поиска или фильтры
                            </Text>
                        </Box>
                    ) : (
                        <>
                            <Text color='text.secondary' fontSize='sm'>
                                Найдено льгот:{' '}
                                {data.total || data.benefits.length > 0 ? data.benefits.length : 0}
                            </Text>

                            <Stack gap={4}>
                                {data.benefits.length > 0 &&
                                    data.benefits.map((benefit) => (
                                        <Box
                                            key={benefit.id}
                                            bg='background.surface'
                                            borderColor='border.primary'
                                            borderRadius='md'
                                            borderWidth='1px'
                                            p={6}
                                            transition='all 0.2s'
                                            _hover={{
                                                borderColor: 'border.accent',
                                                boxShadow: 'md',
                                            }}
                                        >
                                            <VStack align='stretch' gap={3}>
                                                <HStack align='start' justify='space-between'>
                                                    <Heading flex={1} size='md'>
                                                        {benefit.title || 'Без названия'}
                                                    </Heading>
                                                    {benefit.type && (
                                                        <Badge
                                                            color='white'
                                                            bg={
                                                                benefit.type === 'federal'
                                                                    ? 'brand.500'
                                                                    : benefit.type === 'regional'
                                                                        ? 'accent.500'
                                                                        : 'info.500'
                                                            }
                                                        >
                                                            {BENEFIT_TYPES.find(
                                                                (t) => t.value === benefit.type
                                                            )?.label || benefit.type}
                                                        </Badge>
                                                    )}
                                                </HStack>

                                                {benefit.description && (
                                                    <Text
                                                        color='text.secondary'
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {benefit.description}
                                                    </Text>
                                                )}

                                                {benefit.target_groups &&
                                                    benefit.target_groups.length > 0 && (
                                                        <HStack flexWrap='wrap' gap={2}>
                                                            <Text
                                                                color='text.secondary'
                                                                fontSize='sm'
                                                                fontWeight='medium'
                                                            >
                                                                Для:
                                                            </Text>
                                                            {benefit.target_groups.map((group) => (
                                                                <Badge
                                                                    key={group}
                                                                    fontSize='xs'
                                                                    variant='outline'
                                                                >
                                                                    {TARGET_GROUPS.find(
                                                                        (g) => g.value === group
                                                                    )?.label || group}
                                                                </Badge>
                                                            ))}
                                                        </HStack>
                                                    )}

                                                {(benefit.valid_from || benefit.valid_to) && (
                                                    <Text color='text.secondary' fontSize='sm'>
                                                        {benefit.valid_from &&
                                                            `С ${new Date(benefit.valid_from).toLocaleDateString('ru-RU')}`}
                                                        {benefit.valid_from && benefit.valid_to && ' '}
                                                        {benefit.valid_to &&
                                                            `до ${new Date(benefit.valid_to).toLocaleDateString('ru-RU')}`}
                                                    </Text>
                                                )}
                                            </VStack>
                                        </Box>
                                    ))}
                            </Stack>

                            {/* Пагинация */}
                            {totalPages > 1 && (
                                <HStack gap={2} justify='center' mt={4}>
                                    <Button
                                        disabled={currentPage === 1}
                                        size='sm'
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    >
                                        Назад
                                    </Button>
                                    <Text color='text.secondary' fontSize='sm'>
                                        Страница {currentPage} из {totalPages}
                                    </Text>
                                    <Button
                                        disabled={currentPage >= totalPages}
                                        size='sm'
                                        onClick={() =>
                                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                                        }
                                    >
                                        Вперёд
                                    </Button>
                                </HStack>
                            )}
                        </>
                    )}
                </VStack>
            </Box>

            {/* Drawer для фильтров */}
            <Drawer.Root
                open={isFiltersOpen}
                onOpenChange={(e) => setIsFiltersOpen(e.open)}
                placement="bottom"
                closeOnInteractOutside
            >
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content
                        ref={filtersDrawerRef}
                        mt={4}
                        borderTopRadius="2xl"
                        maxH="90vh"
                        style={{
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={(e) => handleTouchMove(e, 'filters')}
                    >
                        {/* Индикатор свайпа */}
                        <Box
                            w="40px"
                            h="4px"
                            bg="gray.300"
                            borderRadius="full"
                            mx="auto"
                            mt={3}
                            mb={2}
                            onTouchStart={handleTouchStart}
                            onTouchMove={(e) => handleTouchMove(e, 'filters')}
                            style={{ cursor: 'grab', touchAction: 'pan-y' }}
                        />
                        <Drawer.Header
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            pb={4}
                            pt={2}
                        >
                            <Box flex={1} />
                            <Drawer.Title flex={1} textAlign="center" fontSize={'2xl'}>
                                Фильтр
                            </Drawer.Title>
                            <Box flex={1} display="flex" justifyContent="flex-end">
                                <Button
                                    variant="ghost"
                                    size="2xl"
                                    onClick={() => setIsFiltersOpen(false)}
                                    p={4}
                                    border={'none'}
                                    minW="auto"
                                    h="auto"

                                >
                                    <LuX size={20} />
                                </Button>
                            </Box>
                        </Drawer.Header>
                        <Drawer.Body px={6} py={0}>
                            <VStack align='stretch' gap={6} pb={4}>
                                {/* Тип льготы */}
                                <Box>
                                    <Text fontSize='xl' fontWeight='bold' mb={4}>
                                        Уровень льготы
                                    </Text>
                                    <Flex gap={4} wrap='wrap'>
                                        {BENEFIT_TYPES.map((type) => {
                                            const isSelected = benefitTypes.includes(type.value)
                                            return (
                                                <Button
                                                    key={type.value}
                                                    size="lg"
                                                    colorPalette="blue"
                                                    variant={isSelected ? 'subtle' : 'outline'}
                                                    bg={isSelected ? 'blue.muted' : 'transparent'}
                                                    color={'blue.fg'}
                                                    rounded={'xl'}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setBenefitTypes(
                                                                benefitTypes.filter((t) => t !== type.value)
                                                            )
                                                        } else {
                                                            setBenefitTypes([...benefitTypes, type.value])
                                                        }
                                                    }}
                                                >
                                                    {type.label}
                                                </Button>
                                            )
                                        })}
                                    </Flex>
                                </Box>

                                {/* Целевые группы */}
                                <Box>
                                    <Text fontSize='xl' fontWeight='bold' mb={4}>
                                        Тип целевой группы
                                    </Text>
                                    <Flex gap={4} wrap='wrap'>
                                        {TARGET_GROUPS.map((group) => {
                                            const isSelected = targetGroups.includes(group.value)
                                            return (
                                                <Button
                                                    key={group.value}
                                                    size="lg"
                                                    colorPalette="blue"
                                                    variant={isSelected ? 'subtle' : 'outline'}
                                                    bg={isSelected ? 'blue.muted' : 'transparent'}
                                                    color={'blue.fg'}
                                                    rounded={'xl'}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setTargetGroups(
                                                                targetGroups.filter((g) => g !== group.value)
                                                            )
                                                        } else {
                                                            setTargetGroups([...targetGroups, group.value])
                                                        }
                                                    }}
                                                >
                                                    {group.label}
                                                </Button>
                                            )
                                        })}
                                    </Flex>
                                </Box>

                                {/* Категории */}
                                <Box>
                                    <Text fontSize='xl' fontWeight='bold' mb={4}>
                                        Категории
                                    </Text>
                                    <Flex gap={4} wrap='wrap'>
                                        {CATEGORIES.map((category) => {
                                            const isSelected = categories.includes(category.value)
                                            return (
                                                <Button
                                                    key={category.value}
                                                    size="lg"
                                                    colorPalette="blue"
                                                    variant={isSelected ? 'subtle' : 'outline'}
                                                    bg={isSelected ? 'blue.muted' : 'transparent'}
                                                    color={'blue.fg'}
                                                    rounded={'xl'}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setCategories(
                                                                categories.filter((c) => c !== category.value)
                                                            )
                                                        } else {
                                                            setCategories([...categories, category.value])
                                                        }
                                                    }}
                                                >
                                                    {category.label}
                                                </Button>
                                            )
                                        })}
                                    </Flex>
                                </Box>

                                {/* Теги */}
                                <Box>
                                    <Text fontSize='xl' fontWeight='bold' mb={4}>
                                        Теги
                                    </Text>
                                    <Flex gap={4} wrap='wrap'>
                                        {TAGS.map((tag) => {
                                            const isSelected = tags.includes(tag.value)
                                            return (
                                                <Button
                                                    key={tag.value}
                                                    size="lg"
                                                    colorPalette="blue"
                                                    variant={isSelected ? 'subtle' : 'outline'}
                                                    bg={isSelected ? 'blue.muted' : 'transparent'}
                                                    color={'blue.fg'}
                                                    rounded={'xl'}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setTags(tags.filter((t) => t !== tag.value))
                                                        } else {
                                                            setTags([...tags, tag.value])
                                                        }
                                                    }}
                                                >
                                                    {tag.label}
                                                </Button>
                                            )
                                        })}
                                    </Flex>
                                </Box>

                                

                                {/* Город */}
                                <Box>
                                    <Text fontSize='xl' fontWeight='bold' mb={4}>
                                        Город
                                    </Text>
                                    <Select.Root
                                        collection={citiesCollection}
                                        value={cityId ? [cityId] : []}
                                        onValueChange={(details) => setCityId(details.value[0] || '')}
                                        size="lg"
                                    >
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Выберите город" />
                                        </Select.Trigger>
                                        <Select.Content>
                                            {citiesCollection.items.map((item) => (
                                                <Select.Item key={item.value} item={item}>
                                                    {item.label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                </Box>
                            </VStack>
                        </Drawer.Body>
                        <Drawer.Footer px={4} pt={2} pb={4}>
                            <HStack gap={4} w='full'>
                                <Button
                                    flex={1}
                                    size="2xl"
                                    variant="plain"
                                    colorPalette="blue"
                                    borderColor={'blue.muted'}
                                    rounded={'2xl'}
                                    onClick={handleResetFilters}
                                >
                                    Сбросить
                                </Button>
                                <Button
                                    flex={1}
                                    size="2xl"
                                    variant="solid"
                                    colorPalette="blue"
                                    rounded={'2xl'}
                                    onClick={handleApplyFilters}
                                >
                                    Применить
                                </Button>
                            </HStack>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root >

            {/* Drawer для сортировки */}
            < Drawer.Root
                open={isSortOpen}
                onOpenChange={(e) => setIsSortOpen(e.open)}
                placement="bottom"
                closeOnInteractOutside
            >
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content
                        ref={sortDrawerRef}
                        mt={4}
                        borderTopRadius="2xl"
                        maxH="90vh"
                        style={{
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={(e) => handleTouchMove(e, 'sort')}
                    >
                        {/* Индикатор свайпа */}
                        <Box
                            w="40px"
                            h="4px"
                            bg="gray.300"
                            borderRadius="full"
                            mx="auto"
                            mt={3}
                            mb={2}
                            onTouchStart={handleTouchStart}
                            onTouchMove={(e) => handleTouchMove(e, 'sort')}
                            style={{ cursor: 'grab', touchAction: 'pan-y' }}
                        />
                        <Drawer.Header
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            pb={4}
                            pt={2}
                        >
                            <Box flex={1} />
                            <Drawer.Title flex={1} textAlign="center">
                                Сортировка
                            </Drawer.Title>
                            <Box flex={1} display="flex" justifyContent="flex-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsSortOpen(false)}
                                    p={2}
                                    minW="auto"
                                    h="auto"
                                >
                                    <LuX size={20} />
                                </Button>
                            </Box>
                        </Drawer.Header>
                        <Drawer.Body>
                            {/* Здесь будет сортировка */}
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root >
        </>
    )
}
