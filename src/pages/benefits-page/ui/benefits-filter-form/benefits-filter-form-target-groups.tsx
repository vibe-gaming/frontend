import { Fieldset, VStack } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'

import { TARGET_GROUPS_ARRAY } from '@/shared/model/constants'
import { MultiSelect } from '@/shared/ui/multi-select'

import type { BenefitsFilterFormValues } from './benefits-filter-form'

export const BenefitsFilterFormTargetGroups = () => {
    const { control } = useFormContext<BenefitsFilterFormValues>()

    return (
        <Fieldset.Root>
            <Fieldset.Legend fontSize='xl' fontWeight='bold' mb={4}>
                Тип целевой группы
            </Fieldset.Legend>
            <VStack align='flex-start' mt='1.5'>
                <Controller
                    control={control}
                    name='target_groups'
                    render={({ field }) => (
                        <MultiSelect
                            name='target_groups'
                            options={TARGET_GROUPS_ARRAY}
                            value={field.value}
                            onValueChange={field.onChange}
                        />
                    )}
                />
            </VStack>
        </Fieldset.Root>
    )
}
