import { useCallback, useState } from 'react'
import { Button, Flex } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { LuChevronDown } from 'react-icons/lu'

import type { BenefitsFilterFormValues } from './benefits-filter-form/benefits-filter-form'
import { BenefitsPageFilterDrawer } from './benefits-page-fitler-drawer'
import {
    type BenefitsPageSortByFormValues,
    BenefitsPageSortDrawer,
} from './benefits-page-sort-drawer'

export const BenefitsPageSearchControls = () => {
    const searchParams = useSearch({
        from: '/_authenticated-layout/benefits/',
    })
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)

    const navigate = useNavigate()

    const handleSubmitSort = useCallback(
        (values: BenefitsPageSortByFormValues) => {
            setIsSortOpen(false)
            navigate({
                to: '/benefits',
                search: {
                    ...searchParams,
                    ...values,
                    page: 1,
                },
            })
        },
        [navigate, searchParams]
    )

    const handleResetSort = useCallback(() => {
        setIsSortOpen(false)
        const { sort_by: _sort_by, ...restSearchParams } = searchParams
        navigate({
            to: '/benefits',
            search: {
                ...restSearchParams,
                page: 1,
            },
        })
    }, [navigate, searchParams])

    const handleResetFilter = useCallback(() => {
        setIsFiltersOpen(false)
        const {
            benefit_types: _benefit_types,
            target_groups: _target_groups,
            tags: _tags,
            categories: _categories,
            city_id: _city_id,
            ...restSearchParams
        } = searchParams
        navigate({
            to: '/benefits',
            search: {
                ...restSearchParams,
                page: 1,
            },
        })
    }, [navigate, searchParams])

    const handleSubmitFilter = useCallback(
        (values: BenefitsFilterFormValues) => {
            setIsFiltersOpen(false)
            navigate({
                to: '/benefits',
                search: {
                    ...searchParams,
                    ...values,
                    page: 1,
                },
            })
        },
        [navigate, searchParams]
    )

    const isFilterChanged = Boolean(
        searchParams.benefit_types ||
            searchParams.target_groups ||
            searchParams.tags ||
            searchParams.categories ||
            searchParams.city_id
    )
    const isSortChanged = Boolean(searchParams.sort_by)

    return (
        <>
            <Flex gap={2}>
                <Button
                    _active={
                        isFilterChanged
                            ? { bg: 'blue.200' }
                            : { bg: 'blue.50', borderColor: 'blue.300' }
                    }
                    color={isFilterChanged ? 'blue.fg' : undefined}
                    colorPalette={isFilterChanged ? 'blue' : undefined}
                    rounded='xl'
                    size='xl'
                    transition='all 0.2s'
                    variant={isFilterChanged ? 'subtle' : 'outline'}
                    onClick={() => setIsFiltersOpen(true)}
                >
                    Фильтр
                    <LuChevronDown />
                </Button>
                <Button
                    _active={
                        isSortChanged
                            ? { bg: 'blue.200' }
                            : { bg: 'blue.50', borderColor: 'blue.300' }
                    }
                    color={isSortChanged ? 'blue.fg' : undefined}
                    colorPalette={isSortChanged ? 'blue' : undefined}
                    rounded='xl'
                    size='xl'
                    transition='all 0.2s'
                    variant={isSortChanged ? 'subtle' : 'outline'}
                    onClick={() => setIsSortOpen(true)}
                >
                    Сортировка
                    <LuChevronDown />
                </Button>
            </Flex>

            <BenefitsPageSortDrawer
                isOpen={isSortOpen}
                searchValues={{
                    sort_by: searchParams.sort_by,
                }}
                onOpenChange={setIsSortOpen}
                onReset={handleResetSort}
                onSubmit={handleSubmitSort}
            />

            <BenefitsPageFilterDrawer
                isOpen={isFiltersOpen}
                searchValues={{
                    benefit_types: searchParams.benefit_types,
                    target_groups: searchParams.target_groups,
                    tags: searchParams.tags,
                    categories: searchParams.categories,
                    city_id: searchParams.city_id,
                }}
                onOpenChange={setIsFiltersOpen}
                onReset={handleResetFilter}
                onSubmit={handleSubmitFilter}
            />
        </>
    )
}
