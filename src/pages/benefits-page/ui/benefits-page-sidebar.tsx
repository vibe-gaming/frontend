import React from 'react'
import { Box, ScrollArea, Text, VStack } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { BenefitsDownloadButton } from './benefits-download-button'
import {
    BenefitsFilterForm,
    type BenefitsFilterFormValues,
} from './benefits-filter-form/benefits-filter-form'

export const BenefitsPageSidebar = () => {
    const navigate = useNavigate()

    const { benefit_types, target_groups, tags, categories, city_id, ...searchParams } = useSearch({
        from: '/_authenticated-layout/benefits/',
    })

    const handleReset = React.useCallback(() => {
        navigate({
            to: '/benefits',
            search: {
                page: 1,
            },
        })
    }, [navigate])

    const handleSubmit = React.useCallback(
        (data: BenefitsFilterFormValues) => {
            navigate({
                to: '/benefits',
                search: {
                    page: 1,
                    ...data,
                    ...searchParams,
                },
            })
        },
        [navigate, searchParams]
    )

    return (
        <Box
            bg='white'
            borderColor='border'
            borderRadius='2xl'
            borderStyle='solid'
            borderWidth='1px'
            display='flex'
            flexDirection='column'
            h='calc(100dvh - 340px)'
            pl={5}
            pr={1}
            py={5}
            w='100%'
        >
            <ScrollArea.Root flex={1} pr={4} size='xs'>
                <ScrollArea.Viewport>
                    <ScrollArea.Content>
                        <VStack align='stretch' gap={5}>
                            <Text fontSize='2xl' fontWeight='bold' mb={1}>
                                Фильтры
                            </Text>

                            <BenefitsFilterForm
                                searchValues={{
                                    benefit_types,
                                    target_groups,
                                    tags,
                                    categories,
                                    city_id,
                                }}
                                onReset={handleReset}
                                onSubmit={handleSubmit}
                            />

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
