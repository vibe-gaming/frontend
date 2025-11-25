import { Fieldset, VStack } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'

import { TAGS_ARRAY } from '@/shared/model/constants'
import { MultiSelect } from '@/shared/ui/multi-select'

import type { BenefitsFilterFormValues } from './benefits-filter-form'

export const BenefitsFilterFormTags = () => {
    const { control } = useFormContext<BenefitsFilterFormValues>()

    return (
        <Fieldset.Root>
            <Fieldset.Legend fontSize='xl' fontWeight='bold' mb={4}>
                Теги
            </Fieldset.Legend>
            <VStack align='flex-start' mt='1.5'>
                <Controller
                    control={control}
                    name='tags'
                    render={({ field }) => (
                        <MultiSelect
                            name='tags'
                            options={TAGS_ARRAY}
                            value={field.value}
                            onValueChange={field.onChange}
                        />
                    )}
                />
            </VStack>
        </Fieldset.Root>
    )
}
