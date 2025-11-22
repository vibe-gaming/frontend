import React, { useState } from 'react'
import { Box, Button, ScrollArea, Text, VStack } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Download } from 'lucide-react'

import {
    BenefitsFilterForm,
    type BenefitsFilterFormValues,
} from './benefits-filter-form/benefits-filter-form'

export const BenefitsPageSidebar = () => {
    const [isDownloading, setIsDownloading] = useState(false)

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
            console.log(searchParams)
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

    // Функция скачивания PDF
    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true)
            const response = await fetch(
                'https://backend-production-10ec.up.railway.app/api/v1/benefits?format=pdf'
            )

            if (!response.ok) {
                throw new Error('Ошибка при скачивании PDF')
            }

            const blob = await response.blob()

            // Создаем ссылку для скачивания
            const url = globalThis.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'Льготы.pdf')
            document.body.append(link)
            link.click()
            link.remove()
            globalThis.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Ошибка при скачивании PDF:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Box
            bg='white'
            borderColor='border'
            borderRadius='2xl'
            borderStyle='solid'
            borderWidth='1px'
            display='flex'
            flexDirection='column'
            h='calc(100dvh - 250px)'
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

                            {/* Кнопка скачивания PDF */}
                            <Button
                                colorPalette='blue'
                                disabled={isDownloading}
                                loading={isDownloading}
                                rounded={'xl'}
                                size='lg'
                                variant='solid'
                                w='full'
                                onClick={handleDownloadPDF}
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
