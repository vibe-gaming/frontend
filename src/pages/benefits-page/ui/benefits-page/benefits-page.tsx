import { useMemo, useRef, useState } from 'react'
import { Box, Button, createListCollection, Grid, Heading, HStack, IconButton, Input, Select, Spinner, Stack, Text, useMediaQuery, VStack } from '@chakra-ui/react';
import { Show } from "@chakra-ui/react";

import { LuChevronDown, LuSearch } from 'react-icons/lu'

import { useGetBenefits } from '@/shared/api/generated/hooks/useGetBenefits'
import { useDebounce } from '@/shared/hooks/use-debounce'

import { ITEMS_PER_PAGE, SORT_OPTIONS, TARGET_GROUPS } from './constants'
import { BenefitCard } from '../benefit-card'
import { BenefitDrawer } from '../benefit-drawer'
import { FiltersDrawer } from '../filters-drawer'
import { FiltersSidebar } from '../filters-sidebar'
import { Pagination } from '../pagination'
import { SortDrawer } from '../sort-drawer'
import styles from './benefits-page.module.scss'
import { AppHeader } from '@/shared/ui/app-header'

export const BenefitsPage = () => {
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"]); // 768px is the breakpoint for desktop

    const [searchQuery, setSearchQuery] = useState('')
    const [benefitTypes, setBenefitTypes] = useState<string[]>([])
    const [targetGroups, setTargetGroups] = useState<string[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [cityId, setCityId] = useState<string>('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [sortBy, setSortBy] = useState<string>('created_at')
    const [sortOrder, setSortOrder] = useState<string>('desc')
    // Временные состояния для Drawer (применяются только при нажатии "Применить")
    const [tempBenefitTypes, setTempBenefitTypes] = useState<string[]>([])
    const [tempTargetGroups, setTempTargetGroups] = useState<string[]>([])
    const [tempTags, setTempTags] = useState<string[]>(['recommended'])
    const [tempCategories, setTempCategories] = useState<string[]>([])
    const [tempCityId, setTempCityId] = useState<string>('')
    const [tempSortBy, setTempSortBy] = useState<string>('created_at')
    const [tempSortOrder, setTempSortOrder] = useState<string>('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null)
    const [appliedSearchQuery, setAppliedSearchQuery] = useState('')

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useGetBenefits>[0] = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
        }

        // На десктопе используем примененный поиск (после клика на кнопку), на мобильных - debounced
        const searchValue = appliedSearchQuery;
        if (searchValue) {
            params.search = searchValue
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

        // Сортировка всегда задана (значения по умолчанию)
        params.sort_by = sortBy
        params.order = sortOrder

        return params
    }, [isDesktop, appliedSearchQuery, benefitTypes, targetGroups, tags, categories, cityId, dateFrom, dateTo, sortBy, sortOrder, currentPage])

    const { data, isLoading, isError, error } = useGetBenefits(queryParams)

    const handleResetFilters = () => {
        // Сбрасываем временные состояния к значениям по умолчанию
        setTempBenefitTypes([])
        setTempTargetGroups([])
        setTempTags([])
        setTempCategories([])
        setTempCityId('')
    }

    // Сброс фильтров для sidebar (сразу применяется)
    const handleResetFiltersSidebar = () => {
        setBenefitTypes([])
        setTargetGroups([])
        setTags([])
        setCategories([])
        setCityId('')
        setCurrentPage(1)
        // Также сбрасываем временные для синхронизации
        setTempBenefitTypes([])
        setTempTargetGroups([])
        setTempTags([])
        setTempCategories([])
        setTempCityId('')
    }

    // Обработчики для sidebar - сразу применяют изменения
    const handleSidebarBenefitTypesChange = (values: string[]) => {
        setBenefitTypes(values)
        setTempBenefitTypes(values)
        setCurrentPage(1)
    }

    const handleSidebarTargetGroupsChange = (values: string[]) => {
        setTargetGroups(values)
        setTempTargetGroups(values)
        setCurrentPage(1)
    }

    const handleSidebarTagsChange = (values: string[]) => {
        setTags(values)
        setTempTags(values)
        setCurrentPage(1)
    }

    const handleSidebarCategoriesChange = (values: string[]) => {
        setCategories(values)
        setTempCategories(values)
        setCurrentPage(1)
    }

    const handleSidebarCityIdChange = (value: string) => {
        setCityId(value)
        setTempCityId(value)
        setCurrentPage(1)
    }

    const handleApplyFilters = () => {
        // Применяем временные состояния к основным
        setBenefitTypes(tempBenefitTypes)
        setTargetGroups(tempTargetGroups)
        setTags(tempTags)
        setCategories(tempCategories)
        setCityId(tempCityId)
        setCurrentPage(1)
        setIsFiltersOpen(false)
    }

    // При открытии Drawer фильтров инициализируем временные состояния из основных
    const handleFiltersDrawerOpenChange = (open: boolean) => {
        setIsFiltersOpen(open)
        if (open) {
            // При открытии копируем текущие значения в временные
            setTempBenefitTypes(benefitTypes)
            setTempTargetGroups(targetGroups)
            setTempTags(tags)
            setTempCategories(categories)
            setTempCityId(cityId)
        }
    }

    const handleResetSort = () => {
        // Сбрасываем временные состояния к значениям по умолчанию
        setTempSortBy('created_at')
        setTempSortOrder('desc')
    }

    const handleApplySort = () => {
        // Применяем временные состояния к основным
        setSortBy(tempSortBy)
        setSortOrder(tempSortOrder)
        setCurrentPage(1)
        setIsSortOpen(false)
    }

    // При открытии Drawer сортировки инициализируем временные состояния из основных
    const handleSortDrawerOpenChange = (open: boolean) => {
        setIsSortOpen(open)
        if (open) {
            // При открытии копируем текущие значения в временные
            setTempSortBy(sortBy)
            setTempSortOrder(sortOrder)
        }
    }

    const openBenefitDrawer = (benefitId: string) => {
        setSelectedBenefitId(benefitId)
    }

    const closeBenefitDrawer = () => {
        setSelectedBenefitId(null)
    }

    // Обработчик применения поиска (для десктопа)
    const handleApplySearch = () => {
        setAppliedSearchQuery(searchQuery)
        setCurrentPage(1)
    }

    // Обработчик нажатия Enter в поле поиска (для десктопа)
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && isDesktop) {
            handleApplySearch()
        }
    }

    const totalPages = data?.total ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1

    if (isError) {
        const errorMessage = error && typeof error === 'object' && 'error_message' in error
            ? String(error.error_message)
            : null;

        return (
            <Box p={8}>
                <Text color='error.DEFAULT'>Не удалось загрузить льготы</Text>
                {errorMessage && (
                    <Text color='text.secondary' fontSize='sm' mt={2}>
                        {errorMessage}
                    </Text>
                )}
            </Box>
        )
    }

    // Теги для отображения под поиском (пока только визуально)
    const quickFilterTags = [
        { value: 'pensioners', label: 'Пенсионерам' },
        { value: 'disabled', label: 'Инвалидам' },
        { value: 'large_families', label: 'Многодетным' },
        { value: 'students', label: 'Студентам' },
        { value: 'veterans', label: 'Ветеранам труда' },
    ]

    // Коллекция для селекта сортировки
    const sortCollection = useMemo(() => {
        const items = SORT_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
        }))
        return createListCollection({ items })
    }, [])

    // Обработчик изменения сортировки на десктопе
    const handleSortChange = (value: string) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    // Обработчик быстрой фильтрации по тегам
    const handleQuickFilterClick = (tagValue: string) => {
        // Проверяем, выбран ли уже этот тег
        const isSelected = targetGroups.includes(tagValue)

        if (isSelected) {
            // Если выбран, убираем его
            const newTargetGroups = targetGroups.filter((v) => v !== tagValue)
            setTargetGroups(newTargetGroups)
            setTempTargetGroups(newTargetGroups)
        } else {
            // Если не выбран, добавляем его
            const newTargetGroups = [...targetGroups, tagValue]
            setTargetGroups(newTargetGroups)
            setTempTargetGroups(newTargetGroups)
        }
        setCurrentPage(1)
    }

    return (
        <>
            <AppHeader />

            <Box className={styles['benefits-page']} w='100%' >
                <VStack align='stretch' gap={4} px={{ base: 4, md: 5 }} pt={{ base: 3, md: 6 }} pb={{ base: 6, md: 10 }} w='100%' maxW="1200px" mx="auto">
                    <Heading as='h1' fontWeight='bold' size='2xl'>Льготы</Heading>
                    <HStack gap={4}>
                        <Input
                            variant="subtle"
                            type="default"
                            size="2xl"
                            placeholder='Поиск по льготам'
                            value={searchQuery}
                            bg='bg.muted'
                            rounded={'2xl'}
                            w='100%'
                            onChange={(event) => {
                                setSearchQuery(event.target.value)
                                // На мобильных сбрасываем страницу при изменении, на десктопе - только при применении
                                if (!isDesktop) {
                                    setCurrentPage(1)
                                }
                            }}
                            onKeyDown={handleSearchKeyDown}
                        />
                        <IconButton aria-label="Search" size="2xl" variant="solid" rounded="xl" colorPalette="blue" onClick={handleApplySearch}>
                            <LuSearch size={24} />
                        </IconButton>

                    </HStack>

                    <Show when={isDesktop}>
                        {/* Теги под поиском */}
                        <HStack gap={2} wrap="wrap" mb={6}>
                            {quickFilterTags.map((tag) => {
                                const isSelected = targetGroups.includes(tag.value)
                                return (
                                    <Button
                                        key={tag.value}
                                        size="xl"
                                        variant={isSelected ? 'solid' : 'subtle'}
                                        rounded="4xl"
                                        colorPalette={isSelected ? 'blue' : 'gray'}
                                        fontSize="lg"
                                        fontWeight="normal"
                                        lineHeight="28px"
                                        color={isSelected ? 'white' : 'gray.fg'}
                                        bg={isSelected ? 'blue.solid' : undefined}
                                        onClick={() => handleQuickFilterClick(tag.value)}
                                        _hover={{
                                            bg: isSelected ? 'blue.600' : 'gray.100',
                                        }}
                                    >
                                        {tag.label}
                                    </Button>
                                )
                            })}
                        </HStack>
                    </Show>

                    {/* Кнопки Фильтр и Сортировка - только на мобильных */}
                    <Show when={!isDesktop}>
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
                                Сортировка по <LuChevronDown />
                            </Button>
                        </HStack>
                    </Show>

                    <Show when={!isDesktop}>
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
                                {/* Layout для мобильных: карточки в один столбец */}
                                <Show when={!isDesktop}>
                                    <Text color='text.secondary' fontSize='md' mt={2}>
                                        Найдено:{' '}
                                        {data.total ?? data.benefits?.length ?? 0}
                                    </Text>

                                    <VStack align='stretch' gap={4}>
                                        {data.benefits.map((benefit) => (
                                            <BenefitCard
                                                key={benefit.id}
                                                benefit={benefit}
                                                onClick={openBenefitDrawer}
                                            />
                                        ))}
                                    </VStack>

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </Show>
                            </>
                        )}
                    </Show>


                    {/* Layout для десктопа: sidebar слева, карточки справа */}
                    <Show when={isDesktop}>
                        <Grid templateColumns="300px 1fr" gap={6} alignItems="start">
                            {/* Sidebar с фильтрами */}
                            <Box
                                position="sticky"
                                top={20}
                            >
                                <FiltersSidebar
                                    tempBenefitTypes={benefitTypes}
                                    tempTargetGroups={targetGroups}
                                    tempTags={tags}
                                    tempCategories={categories}
                                    tempCityId={cityId}
                                    onBenefitTypesChange={handleSidebarBenefitTypesChange}
                                    onTargetGroupsChange={handleSidebarTargetGroupsChange}
                                    onTagsChange={handleSidebarTagsChange}
                                    onCategoriesChange={handleSidebarCategoriesChange}
                                    onCityIdChange={handleSidebarCityIdChange}
                                    onReset={handleResetFiltersSidebar}
                                    onApply={handleApplyFilters}
                                />
                            </Box>

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
                                    {/* Контент с карточками */}
                                    <VStack align='stretch' gap={5}>
                                        <Select.Root
                                            collection={sortCollection}
                                            value={[]}
                                            position={'relative'}
                                            onValueChange={(details) => handleSortChange(details.value[0] || 'created_at')}
                                            size="md"
                                            width={"200px"}
                                        >
                                            <Select.Trigger rounded={'lg'} borderRadius={'md'} w="200px">
                                                <Select.ValueText fontSize={'md'} placeholder="Сортировка по" color={"fg.muted"} />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup mr={4}>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                            <Select.Content p={4} gap={4} rounded={'lg'}>
                                                {sortCollection.items.map((item) => (
                                                    <Select.Item key={item.value} item={item} fontSize={'md'} color={"fg.muted"}>
                                                        {item.label}
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Root>

                                        {/* Карточки в 2 колонки на десктопе */}
                                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                            {data.benefits.map((benefit) => (
                                                <BenefitCard
                                                    key={benefit.id}
                                                    benefit={benefit}
                                                    onClick={openBenefitDrawer}
                                                />
                                            ))}
                                        </Grid>

                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </VStack>
                                </>
                            )}
                        </Grid>
                    </Show>
                </VStack>
            </Box>

            <FiltersDrawer
                isOpen={isFiltersOpen}
                onOpenChange={handleFiltersDrawerOpenChange}
                tempBenefitTypes={tempBenefitTypes}
                tempTargetGroups={tempTargetGroups}
                tempTags={tempTags}
                tempCategories={tempCategories}
                tempCityId={tempCityId}
                onBenefitTypesChange={setTempBenefitTypes}
                onTargetGroupsChange={setTempTargetGroups}
                onTagsChange={setTempTags}
                onCategoriesChange={setTempCategories}
                onCityIdChange={setTempCityId}
                onReset={handleResetFilters}
                onApply={handleApplyFilters}
            />

            <SortDrawer
                isOpen={isSortOpen}
                onOpenChange={handleSortDrawerOpenChange}
                tempSortBy={tempSortBy}
                tempSortOrder={tempSortOrder}
                onSortByChange={setTempSortBy}
                onSortOrderChange={setTempSortOrder}
                onReset={handleResetSort}
                onApply={handleApplySort}
            />

            <BenefitDrawer
                isOpen={Boolean(selectedBenefitId)}
                onClose={closeBenefitDrawer}
                benefitId={selectedBenefitId}
            />
        </>
    )
}
