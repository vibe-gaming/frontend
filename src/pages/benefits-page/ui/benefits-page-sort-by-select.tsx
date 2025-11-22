import { useMemo } from 'react'
import { createListCollection, Portal, Select } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { SORT_BY_OPTIONS } from '../model/constants'

export const BenefitsPageSortBySelect = () => {
    const { sort_by, ...rest } = useSearch({
        from: '/_authenticated-layout/benefits/',
    })

    const navigate = useNavigate()

    const sortByCollection = useMemo(() => {
        return createListCollection({
            items: SORT_BY_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
            })),
        })
    }, [])

    return (
        <Select.Root
            collection={sortByCollection}
            size='lg'
            value={[sort_by || '']}
            w={{ base: '225px', md: '240px' }}
            onValueChange={({ value }) =>
                navigate({
                    to: '/benefits',
                    search: {
                        ...rest,
                        sort_by: value[0],
                    },
                })
            }
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger borderRadius={'xl'} rounded={'xl'}>
                    <Select.ValueText fontSize='lg' placeholder='Сортировка по' />
                </Select.Trigger>
                <Select.IndicatorGroup mr={4}>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content gap={4} p={4} rounded={'xl'}>
                        {sortByCollection.items.map((item) => (
                            <Select.Item key={item.value} fontSize='lg' item={item}>
                                {item.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}
