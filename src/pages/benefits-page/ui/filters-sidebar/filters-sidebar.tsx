import { useMemo, useState } from 'react'
import { createListCollection, Show, useMediaQuery, ScrollArea } from '@chakra-ui/react'
import { Box, Button, HStack, Select, Text, VStack } from '@chakra-ui/react'
import { Download } from 'lucide-react'

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
    const [isDownloading, setIsDownloading] = useState(false)

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

    // Функция скачивания PDF
    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true)
            const response = await fetch('https://backend-production-10ec.up.railway.app/api/v1/benefits?format=pdf')

            if (!response.ok) {
                throw new Error('Ошибка при скачивании PDF')
            }

            const blob = await response.blob()

            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'Льготы.pdf')
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

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            py={5}
            pl={5}
            pr={1}
            w="100%"
            h="calc(100vh - 450px)"
            borderColor='border'
            borderWidth='1px'
            borderStyle='solid'
            display="flex"
            flexDirection="column"
        >
            <ScrollArea.Root
                flex={1}
                size="xs"
                pr={4}
            >
                <ScrollArea.Viewport>
                    <ScrollArea.Content>
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

                            {/* Кнопка скачивания PDF */}
                            <Button
                                w='full'
                                size="lg"
                                variant="solid"
                                colorPalette="blue"
                                rounded={'xl'}
                                onClick={handleDownloadPDF}
                                loading={isDownloading}
                                disabled={isDownloading}
                            >
                                <Download size={20} style={{ marginRight: '8px' }} />
                                Скачать PDF
                            </Button>
                        </VStack>
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar>
                    <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
            </ScrollArea.Root>
        </Box>
    )
}

