import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { useSearch } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

import { AXIOS_INSTANCE } from '@/shared/api'

export const BenefitsDownloadButton = () => {
    // Функция скачивания PDF
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

    const {
        benefit_types,
        target_groups,
        tags,
        categories,
        page: _page,
        ...searchValues
    } = useSearch({
        from: '/_authenticated-layout/benefits/',
    })

    const handleDownloadPDF = async () => {
        try {
            setIsDownloadingPDF(true)

            const response = await AXIOS_INSTANCE.get<Blob>('/benefits', {
                params: {
                    ...searchValues,
                    format: 'pdf',
                    type: benefit_types?.join(','),
                    target_groups: target_groups?.join(','),
                    tags: tags?.join(','),
                    categories: categories?.join(','),
                },
                responseType: 'blob',
            })

            const blob = await new Blob([response.data])

            const url = globalThis.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'Льготы.pdf')
            document.body.append(link)
            link.click()
            link.remove()
            globalThis.URL.revokeObjectURL(url)
            toast.success('Льготы сформированы')
        } catch (error) {
            console.error('Ошибка при скачивании PDF:', error)
        } finally {
            setIsDownloadingPDF(false)
        }
    }

    return (
        <Button
            _active={{ bg: 'blue.100' }}
            colorPalette='blue'
            disabled={isDownloadingPDF}
            loading={isDownloadingPDF}
            mb={2}
            rounded={{ base: '2xl', md: 'xl' }}
            size={{ base: '2xl', md: 'xl' }}
            transition='all 0.2s'
            variant='surface'
            w='full'
            onClick={handleDownloadPDF}
        >
            <Download size={20} style={{ marginRight: '8px' }} />
            Скачать PDF
        </Button>
    )
}
