import { useMemo } from 'react'
import {
    createListCollection,
    Fieldset,
    Portal,
    Select,
    Spinner,
    useMediaQuery,
    VStack,
} from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'

import { useGetCities } from '@/shared/api/generated'

import type { BenefitsFilterFormValues } from './benefits-filter-form'

export const BenefitsFilterFormCity = () => {
    const { control } = useFormContext<BenefitsFilterFormValues>()

    const { data: cities, isLoading } = useGetCities()

    const [isDesktop] = useMediaQuery(['(min-width: 768px)'])

    const citiesCollection = useMemo(() => {
        return createListCollection({
            items: cities?.map((city) => ({ value: city.id, label: city.name })) || [],
        })
    }, [cities])

    return (
        <Fieldset.Root>
            <Fieldset.Legend fontSize='xl' fontWeight='bold' mb={4}>
                Город
            </Fieldset.Legend>
            <VStack align='flex-start'>
                <Controller
                    control={control}
                    name='city_id'
                    render={({ field }) => (
                        <Select.Root
                            collection={citiesCollection}
                            disabled={isLoading}
                            name={field.name}
                            size='lg'
                            onInteractOutside={() => field.onBlur()}
                            onValueChange={({ value }) => field.onChange(value)}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger borderRadius={'xl'} rounded={'xl'}>
                                    <Select.ValueText fontSize='lg' placeholder='Выберите город' />
                                </Select.Trigger>
                                <Select.IndicatorGroup mr={4}>
                                    {isLoading && (
                                        <Spinner borderWidth='1.5px' color='fg.muted' size='xs' />
                                    )}
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal disabled={!isDesktop}>
                                <Select.Positioner>
                                    <Select.Content gap={4} p={4} rounded={'xl'}>
                                        {citiesCollection.items.length === 0 ? (
                                            <Select.Item
                                                key='empty'
                                                fontSize='lg'
                                                item={{ value: '', label: 'Нет городов' }}
                                            >
                                                <Select.ItemText
                                                    color='fg'
                                                    fontSize='md'
                                                    fontWeight={500}
                                                >
                                                    Нет городов
                                                </Select.ItemText>
                                            </Select.Item>
                                        ) : (
                                            citiesCollection.items.map((city) => (
                                                <Select.Item
                                                    key={city.value}
                                                    fontSize='lg'
                                                    item={city}
                                                >
                                                    {city.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))
                                        )}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )}
                />
            </VStack>
        </Fieldset.Root>
    )
}
