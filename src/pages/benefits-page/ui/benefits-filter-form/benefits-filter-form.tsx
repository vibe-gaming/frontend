import { useEffect } from 'react'
import { Button, HStack, useMediaQuery, VStack } from '@chakra-ui/react'
import isEqual from 'lodash.isequal'
import { FormProvider, useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

import type { BenefitsSearchParams } from '@/entities/benefits'

import { BenefitsFilterFormCategory } from './benefits-filter-form-category'
import { BenefitsFilterFormCity } from './benefits-filter-form-city'
import { BenefitsFilterFormTags } from './benefits-filter-form-tags'
import { BenefitsFilterFormTargetGroups } from './benefits-filter-form-target-groups'
import { BenefitsFilterFormType } from './benefits-filter-form-type'

export interface BenefitsFilterFormValues
    extends Pick<
        BenefitsSearchParams,
        'benefit_types' | 'tags' | 'categories' | 'city_id' | 'target_groups'
    > {}

export const BENEFIT_FILTER_FORM_DEFAULT_VALUES: BenefitsFilterFormValues = {
    benefit_types: [],
    tags: [],
    categories: [],
    city_id: '',
    target_groups: [],
}

interface BenefitsFilterFormProps {
    onSubmit: (values: BenefitsFilterFormValues) => void
    onReset: () => void
    searchValues: BenefitsFilterFormValues
}

export const BenefitsFilterForm: React.FC<BenefitsFilterFormProps> = ({
    onSubmit,
    onReset,
    searchValues,
}) => {
    const methods = useForm<BenefitsFilterFormValues>({
        defaultValues: searchValues,
    })

    const { watch, setValue, getValues, reset } = methods
    const [isDesktop] = useMediaQuery(['(min-width: 768px)'])

    const debouncedSubmit = useDebouncedCallback(
        (values: BenefitsFilterFormValues) => onSubmit(values),
        600
    )

    useEffect(() => {
        if (!isDesktop) {
            return
        }

        // eslint-disable-next-line react-hooks/incompatible-library
        const subscription = watch((values) => {
            if (isEqual(values, searchValues)) {
                return
            }

            debouncedSubmit(values as BenefitsFilterFormValues)
        })

        return () => subscription.unsubscribe()
    }, [watch, isDesktop, debouncedSubmit, searchValues])

    useEffect(() => {
        const values = getValues()

        if (isEqual(values.benefit_types, searchValues?.benefit_types)) {
            setValue('benefit_types', searchValues?.benefit_types)
        }
        if (isEqual(values.target_groups, searchValues?.target_groups)) {
            setValue('target_groups', searchValues?.target_groups)
        }
        if (isEqual(values.tags, searchValues?.tags)) {
            setValue('tags', searchValues?.tags)
        }
        if (isEqual(values.categories, searchValues?.categories)) {
            setValue('categories', searchValues?.categories)
        }
        if (isEqual(values.city_id, searchValues?.city_id)) {
            setValue('city_id', searchValues?.city_id)
        }
    }, [searchValues, setValue, getValues])

    return (
        <FormProvider {...methods}>
            <form>
                <VStack align='flex-start' gap={5}>
                    <BenefitsFilterFormCity />
                    <BenefitsFilterFormType />
                    <BenefitsFilterFormTargetGroups />
                    <BenefitsFilterFormTags />
                    <BenefitsFilterFormCategory />
                </VStack>
                {isDesktop ? (
                    <Button
                        colorPalette='blue'
                        mt={6}
                        rounded={'xl'}
                        size='lg'
                        type='button'
                        variant='outline'
                        w='full'
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()

                            onReset()

                            reset(BENEFIT_FILTER_FORM_DEFAULT_VALUES, { keepValues: false })
                        }}
                    >
                        Сбросить
                    </Button>
                ) : (
                    <HStack bottom={0} gap={4} mt={4} position='sticky' w='full'>
                        <Button
                            bg='white'
                            borderColor={'blue.muted'}
                            colorPalette='blue'
                            flex={1}
                            rounded={'2xl'}
                            size='2xl'
                            variant='plain'
                            onClick={() => {
                                reset(BENEFIT_FILTER_FORM_DEFAULT_VALUES, { keepValues: false })
                                onReset()
                            }}
                        >
                            Сбросить
                        </Button>
                        <Button
                            colorPalette='blue'
                            flex={1}
                            rounded={'2xl'}
                            size='2xl'
                            variant='solid'
                            onClick={() => {
                                methods.handleSubmit(onSubmit)()
                            }}
                        >
                            Применить
                        </Button>
                    </HStack>
                )}
            </form>
        </FormProvider>
    )
}
