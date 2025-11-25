import { Fieldset, VStack } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'

import { BENEFIT_TYPES_ARRAY } from '@/shared/model/constants'
import { MultiSelect } from '@/shared/ui/multi-select'

import type { BenefitsFilterFormValues } from './benefits-filter-form'

export const BenefitsFilterFormType = () => {
    const { control } = useFormContext<BenefitsFilterFormValues>()

    return (
        <Fieldset.Root>
            <Fieldset.Legend fontSize='xl' fontWeight='bold' mb={4}>
                Уровень льготы
            </Fieldset.Legend>
            <VStack align='flex-start' mt='1.5'>
                <Controller
                    control={control}
                    name='benefit_types'
                    render={({ field }) => (
                        <MultiSelect
                            name='benefit_types'
                            options={BENEFIT_TYPES_ARRAY}
                            value={field.value}
                            onValueChange={field.onChange}
                        />
                    )}
                />
            </VStack>
        </Fieldset.Root>
    )
}
