import { useMemo, useRef, useState } from 'react'
import { Box, Button, Heading, HStack, IconButton, Input, Spinner, Stack, Text, useMediaQuery, VStack } from '@chakra-ui/react';
import { Show } from "@chakra-ui/react";

import { LuChevronDown, LuSearch } from 'react-icons/lu'

import { useGetBenefits } from '@/shared/api/generated/hooks/useGetBenefits'
import { useDebounce } from '@/shared/hooks/use-debounce'

import { ITEMS_PER_PAGE } from './constants'
import { BenefitCard } from '../benefit-card'
import { BenefitDrawer } from '../benefit-drawer'
import { FiltersDrawer } from '../filters-drawer'
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
    const [tempTags, setTempTags] = useState<string[]>([])
    const [tempCategories, setTempCategories] = useState<string[]>([])
    const [tempCityId, setTempCityId] = useState<string>('')
    const [tempSortBy, setTempSortBy] = useState<string>('created_at')
    const [tempSortOrder, setTempSortOrder] = useState<string>('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null)
    // Примененный поисковый запрос (для десктопа - только после клика на кнопку)
    const [appliedSearchQuery, setAppliedSearchQuery] = useState('')

    const debouncedSearch = useDebounce(searchQuery, 500)

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useGetBenefits>[0] = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
        }

        // На десктопе используем примененный поиск (после клика на кнопку), на мобильных - debounced
        const searchValue = isDesktop ? appliedSearchQuery : debouncedSearch
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
    }, [isDesktop, appliedSearchQuery, debouncedSearch, benefitTypes, targetGroups, tags, categories, cityId, dateFrom, dateTo, sortBy, sortOrder, currentPage])

    const { data, isLoading, isError, error } = useGetBenefits(queryParams)

    const handleResetFilters = () => {
        // Сбрасываем временные состояния к значениям по умолчанию
        setTempBenefitTypes([])
        setTempTargetGroups([])
        setTempTags([])
        setTempCategories([])
        setTempCityId('')
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
                        <Show when={isDesktop}>
                            <IconButton aria-label="Search" size="2xl" variant="solid" rounded="xl" colorPalette="blue" onClick={handleApplySearch}>
                                <LuSearch size={24} />
                            </IconButton>
                        </Show>

                    </HStack>

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
                            <Text color='text.secondary' fontSize='md' mt={2}>
                                Найдено льгот:{' '}
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
                        </>
                    )}
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
