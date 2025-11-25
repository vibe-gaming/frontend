import { useRef } from 'react'

import { BaseDrawer } from '@/shared/ui/base-drawer'

import {
    BenefitsFilterForm,
    type BenefitsFilterFormValues,
} from './benefits-filter-form/benefits-filter-form'

interface BenefitsPageFilterDrawerProps {
    isOpen: boolean
    onReset: () => void
    onSubmit: (values: BenefitsFilterFormValues) => void
    onOpenChange: (open: boolean) => void
    searchValues: BenefitsFilterFormValues
}

export const BenefitsPageFilterDrawer = ({
    isOpen,
    onOpenChange,
    onReset,
    onSubmit,
    searchValues,
}: BenefitsPageFilterDrawerProps) => {
    const filterDrawerRef = useRef<HTMLDivElement>(null)

    // const footer = (
    //     <HStack gap={4} w='full'>
    //         <Button
    //             borderColor={'blue.muted'}
    //             colorPalette='blue'
    //             flex={1}
    //             rounded={'2xl'}
    //             size='2xl'
    //             variant='plain'
    //             onClick={() => {
    //                 reset(
    //                     {
    //                         sort_by: '',
    //                     },
    //                     { keepValues: false }
    //                 )
    //                 onReset()
    //             }}
    //         >
    //             Сбросить
    //         </Button>
    //         <Button
    //             colorPalette='blue'
    //             flex={1}
    //             rounded={'2xl'}
    //             size='2xl'
    //             variant='solid'
    //             onClick={handleSubmit(onSubmit)}
    //         >
    //             Применить
    //         </Button>
    //     </HStack>
    // )

    return (
        <BaseDrawer
            ref={filterDrawerRef}
            // footer={footer}
            isOpen={isOpen}
            title='Фильтр'
            onOpenChange={onOpenChange}
            isPaddingBottom={false}
        >
            <BenefitsFilterForm searchValues={searchValues} onReset={onReset} onSubmit={onSubmit} />
        </BaseDrawer>
    )
}
