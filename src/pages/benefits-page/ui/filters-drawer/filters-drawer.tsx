import { useMemo, useRef } from 'react'
import { createListCollection } from '@chakra-ui/react'
import { Box, Button, HStack, Select, Text, VStack } from '@chakra-ui/react'

import { useGetCities } from '@/shared/api/generated/hooks/useGetCities'
import { BaseDrawer } from '@/shared/ui/base-drawer'

import { BENEFIT_TYPES, CATEGORIES, TAGS, TARGET_GROUPS } from '../benefits-page/constants'
import { MultiSelectFilter } from '../multi-select-filter'

interface FiltersDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    // Временные состояния для фильтров
    tempBenefitTypes: string[]
    tempTargetGroups: string[]
    tempTags: string[]
    tempCategories: string[]
    tempCityId: string
    // Обработчики изменений
    onBenefitTypesChange: (values: string[]) => void
    onTargetGroupsChange: (values: string[]) => void
    onTagsChange: (values: string[]) => void
    onCategoriesChange: (values: string[]) => void
    onCityIdChange: (value: string) => void
    // Обработчики действий
    onReset: () => void
    onApply: () => void
}

export const FiltersDrawer = ({
    isOpen,
    onOpenChange,
    tempBenefitTypes,
    tempTargetGroups,
    tempTags,
    tempCategories,
    tempCityId,
    onBenefitTypesChange,
    onTargetGroupsChange,
    onTagsChange,
    onCategoriesChange,
    onCityIdChange,
    onReset,
    onApply,
}: FiltersDrawerProps) => {
    const filtersDrawerRef = useRef<HTMLDivElement>(null)

    // Запрос к городам выполняется только при открытии Drawer
    const { data: citiesData } = useGetCities({
        query: {
            enabled: isOpen,
        },
    })

    const citiesCollection = useMemo(() => {
        const items = [
            ...(citiesData?.map((city) => ({
                value: city.id || '',
                label: city.name || '',
            })) || []),
            { value: '', label: 'Все города' },
        ]
        return createListCollection({ items })
    }, [citiesData])

    const footer = (
        <HStack gap={4} w='full'>
            <Button
                flex={1}
                size="2xl"
                variant="plain"
                colorPalette="blue"
                borderColor={'blue.muted'}
                rounded={'2xl'}
                onClick={onReset}
            >
                Сбросить
            </Button>
            <Button
                flex={1}
                size="2xl"
                variant="solid"
                colorPalette="blue"
                rounded={'2xl'}
                onClick={onApply}
            >
                Применить
            </Button>
        </HStack>
    )

    return (
        <BaseDrawer
            ref={filtersDrawerRef}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Фильтр"
            footer={footer}
        >
            <VStack align='stretch' gap={6} pb={4}>
                <MultiSelectFilter
                    title="Уровень льготы"
                    options={BENEFIT_TYPES}
                    selectedValues={tempBenefitTypes}
                    onChange={onBenefitTypesChange}
                />

                <MultiSelectFilter
                    title="Тип"
                    options={TARGET_GROUPS}
                    selectedValues={tempTargetGroups}
                    onChange={onTargetGroupsChange}
                />

                <MultiSelectFilter
                    title="Теги"
                    options={TAGS}
                    selectedValues={tempTags}
                    onChange={onTagsChange}
                />

                <MultiSelectFilter
                    title="Категории"
                    options={CATEGORIES}
                    selectedValues={tempCategories}
                    onChange={onCategoriesChange}
                />

                {/* Город */}
                <Box>
                    <Text fontSize='xl' fontWeight='bold' mb={4}>
                        Город
                    </Text>
                    <Select.Root
                        collection={citiesCollection}
                        value={tempCityId ? [tempCityId] : []}
                        position={'relative'}
                        onValueChange={(details) => onCityIdChange(details.value[0] || '')}
                        size="lg"
                    >
                        <Select.Trigger rounded={'xl'} borderRadius={'xl'}>
                            <Select.ValueText fontSize={'lg'} placeholder="Выберите город" />
                        </Select.Trigger>
                        <Select.IndicatorGroup mr={4}>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                        <Select.Content p={4} gap={4} rounded={'xl'}>
                            {citiesCollection.items.map((item) => (
                                <Select.Item key={item.value} item={item} fontSize={'lg'}>
                                    {item.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </Box>
            </VStack>
        </BaseDrawer>
    )
}

