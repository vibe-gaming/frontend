import { useCallback, useMemo, useState } from 'react'
import { Box, Grid, GridItem, Heading, Show, useMediaQuery, VStack } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import {
    type GetBenefitsQueryParams,
    useGetBenefits,
    type V1BenefitsListResponse,
} from '@/shared/api/generated'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'
import {
    filterStoredBenefits,
    getBenefitsFromStorage,
    type StoredBenefits,
} from '@/shared/utils/benefits-storage'

import { ITEMS_PER_PAGE } from '../model/constants'
import { BenefitsCards } from './benefits-cards'
import { BenefitsDownloadButton } from './benefits-download-button'
import { BenefitsPagePagination } from './benefits-page-pagination'
import { BenefitsPageSearchControls } from './benefits-page-search-controls'
import { BenefitsPageSidebar } from './benefits-page-sidebar'
import { BenefitsPageSortBySelect } from './benefits-page-sort-by-select'
import { BenefitsSearchForm } from './benefits-search-form'

export const BenefitsPage = () => {
    const [isDesktop] = useMediaQuery(['(min-width: 768px)']) // 768px is the breakpoint for desktop
    const isOnline = useOnlineStatus()
    const isMobile = !isDesktop

    const { page, ...searchValues } = useSearch({
        from: '/_authenticated-layout/benefits/',
        select: (search) => {
            return {
                ...search,
                page: search.page ?? 1,
            }
        },
    })

    const navigate = useNavigate()

    const handlePageChange = useCallback(
        (page: number) => {
            navigate({
                to: '/benefits',
                search: {
                    ...searchValues,
                    page,
                },
            })
        },
        [navigate, searchValues]
    )

    // Офлайн данные - инициализируем из localStorage сразу
    const [offlineData] = useState<StoredBenefits | null>(() => {
        if (globalThis.window !== undefined) {
            const stored = getBenefitsFromStorage()
            if (stored) {
                console.log(
                    'Инициализация offlineData из localStorage:',
                    stored.benefits.length,
                    'льгот'
                )

                return stored
            }
        }

        return null
    })

    // Используем офлайн данные если нет интернета на мобильных
    // Также используем офлайн данные если запрос упал с сетевой ошибкой
    const { data, isLoading, isError, error } = useGetBenefits<V1BenefitsListResponse>(
        {
            ...searchValues,
            page,
            limit: ITEMS_PER_PAGE,
            type: searchValues.benefit_types?.join(','),
            target_groups: searchValues.target_groups?.join(','),
            tags: searchValues.tags?.join(','),
            categories: searchValues.categories?.join(','),
        } as GetBenefitsQueryParams,
        {
            query: {
                enabled: isMobile ? (isOnline && !offlineData ? false : isOnline) : true, // На мобильных не делаем запрос если есть офлайн данные и нет интернета
                retry: (failureCount, error) => {
                    // Не повторяем запрос если это сетевая ошибка и есть офлайн данные
                    if (isMobile && offlineData) {
                        const isNetworkError =
                            error instanceof Error &&
                            (error.message.includes('Failed to fetch') ||
                                error.message.includes('NetworkError') ||
                                error.message.includes('Network request failed'))
                        if (isNetworkError) {
                            return false
                        }
                    }

                    return failureCount < 2
                },
            },
        }
    )

    const isNetworkError =
        error instanceof Error &&
        (error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError') ||
            error.message.includes('Network request failed') ||
            (error as any)?.code === 'ERR_NETWORK')

    const shouldUseOffline = isMobile && offlineData && (!isOnline || (isError && isNetworkError))

    const displayData = useMemo((): V1BenefitsListResponse | null => {
        if (shouldUseOffline && offlineData) {
            // Фильтруем по поисковому запросу
            const filtered = filterStoredBenefits(offlineData.benefits, searchValues.search || '')

            return {
                benefits: filtered,
                total: filtered.length,
            }
        }

        return data || null
    }, [shouldUseOffline, offlineData, searchValues, data])

    const isOfflineMode = isMobile && !isOnline && offlineData

    return (
        <>
            <Box w='100%'>
                <VStack
                    align='stretch'
                    gap={6}
                    maxW='1200px'
                    mx='auto'
                    pb={{ base: 6, md: 10 }}
                    pt={{ base: 0, md: 6 }}
                    px={{ base: 4, md: 5 }}
                    w='100%'
                >
                    <Heading as='h1' fontWeight='bold' size={{ base: '2xl', md: '4xl' }}>
                        Льготы
                    </Heading>

                    <Grid
                        alignItems='start'
                        gap={6}
                        templateColumns={{ base: '1fr', md: '300px 1fr' }}
                        templateAreas={{
                            base: `'search' 'main' 'pagination'`,
                            md: `'search search' 'sidebar main' 'pagination pagination'`,
                        }}
                    >
                        <GridItem area='search'>
                            <BenefitsSearchForm
                                searchValues={{
                                    search: searchValues.search,
                                }}
                                onSubmit={(data) => {
                                    navigate({
                                        to: '/benefits',
                                        search: {
                                            page: 1,
                                            ...searchValues,
                                            ...data,
                                        },
                                    })
                                }}
                            />
                        </GridItem>

                        <Show when={isDesktop}>
                            <GridItem area='sidebar' position='sticky' top={'104px'}>
                                <BenefitsPageSidebar />
                            </GridItem>
                        </Show>

                        <GridItem area='main' display='flex' flexDirection='column' gap={6}>
                            <Show when={isDesktop}>
                                <BenefitsPageSortBySelect />
                            </Show>

                            <Show when={!isDesktop}>
                                <BenefitsPageSearchControls />
                            </Show>

                            <BenefitsCards
                                benefits={displayData?.benefits ?? []}
                                isLoading={isLoading}
                            />

                            <Show when={!isOfflineMode && !isLoading && isMobile}>
                                <BenefitsDownloadButton />
                            </Show>
                        </GridItem>

                        <GridItem area='pagination'>
                            {!isOfflineMode && (
                                <BenefitsPagePagination
                                    currentPage={page}
                                    total={displayData?.total ?? 0}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </GridItem>
                    </Grid>
                </VStack>
            </Box>
        </>
    )
}
