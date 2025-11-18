import { useMemo } from 'react'
import { createListCollection, Show, useMediaQuery } from '@chakra-ui/react'
import { Box, Button, HStack, Select, Text, VStack } from '@chakra-ui/react'

import { useGetCities } from '@/shared/api/generated/hooks/useGetCities'

import { BENEFIT_TYPES, CATEGORIES, TAGS, TARGET_GROUPS } from '../benefits-page/constants'
import { MultiSelectFilter } from '../multi-select-filter'

interface FiltersSidebarProps {
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

export const FiltersSidebar = ({
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
}: FiltersSidebarProps) => {
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"]); // 768px is the breakpoint for desktop

    // Запрос к городам
    const { data: citiesData } = useGetCities()

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

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            p={5}
            w="100%"
            h="fit-content"
            borderColor='border'
            borderWidth='1px'
            borderStyle='solid'
        >
            <VStack align='stretch' gap={5}>
                <Text fontSize='2xl' fontWeight='bold' mb={1}>
                    Фильтры
                </Text>

                {/* Город Десктоп */}
                <Show when={isDesktop}>
                    <Box>
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
                </Show>

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

                {/* Город мобильный */}
                <Show when={!isDesktop}>
                    <Box>
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
                </Show>

                {/* Кнопка сброса */}
                <Button
                    w='full'
                    size="lg"
                    variant="outline"
                    colorPalette="blue"
                    rounded={'xl'}
                    onClick={onReset}
                    mt={4}
                >
                    Сбросить
                </Button>
            </VStack>
        </Box>
    )
}

