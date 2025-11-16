import { useMemo, useRef } from 'react'
import { createListCollection } from '@chakra-ui/react'
import { Box, Button, Drawer, HStack, Select, Text, VStack } from '@chakra-ui/react'

import { LuX } from 'react-icons/lu'

import { useGetCities } from '@/shared/api/generated/hooks/useGetCities'

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
    // Обработчики свайпа
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
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
    onTouchStart,
    onTouchMove,
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
            { value: '', label: 'Все города' },
            ...(citiesData?.map((city) => ({
                value: city.id || '',
                label: city.name || '',
            })) || []),
        ]
        return createListCollection({ items })
    }, [citiesData])

    return (
        <Drawer.Root
            open={isOpen}
            onOpenChange={(e) => onOpenChange(e.open)}
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
                    onTouchStart={onTouchStart}
                    onTouchMove={(e) => onTouchMove(e)}
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
                        onTouchStart={onTouchStart}
                        onTouchMove={(e) => onTouchMove(e)}
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
                                onClick={() => onOpenChange(false)}
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
                            <MultiSelectFilter
                                title="Уровень льготы"
                                options={BENEFIT_TYPES}
                                selectedValues={tempBenefitTypes}
                                onChange={onBenefitTypesChange}
                            />

                            <MultiSelectFilter
                                title="Тип целевой группы"
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
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    )
}

