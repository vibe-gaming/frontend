import { useEffect, useRef } from 'react'
import { Button, HStack, RadioCard, VStack } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import type { BenefitsSearchParams } from '@/entities/benefits'
import { BaseDrawer } from '@/shared/ui/base-drawer'

import { SORT_OPTIONS } from '../model/constants'

export interface BenefitsPageSortByFormValues extends Pick<BenefitsSearchParams, 'sort_by'> {}

interface SortDrawerProps {
    isOpen: boolean
    onReset: () => void
    onSubmit: (values: BenefitsPageSortByFormValues) => void
    onOpenChange: (open: boolean) => void
    searchValues: BenefitsPageSortByFormValues
}

export const BenefitsPageSortDrawer = ({
    isOpen,
    onOpenChange,
    onReset,
    onSubmit,
    searchValues,
}: SortDrawerProps) => {
    const sortDrawerRef = useRef<HTMLDivElement>(null)

    const { control, reset, setValue, getValues, handleSubmit } =
        useForm<BenefitsPageSortByFormValues>({
            defaultValues: searchValues,
        })

    useEffect(() => {
        const values = getValues()

        if (values.sort_by !== searchValues.sort_by) {
            setValue('sort_by', searchValues.sort_by)
        }
    }, [searchValues, setValue, getValues])

    const footer = (
        <HStack gap={4} w='full'>
            <Button
                borderColor={'blue.muted'}
                colorPalette='blue'
                flex={1}
                rounded={'2xl'}
                size='2xl'
                variant='plain'
                onClick={() => {
                    reset(
                        {
                            sort_by: '',
                        },
                        { keepValues: false }
                    )
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
                    handleSubmit(onSubmit)()
                }}
            >
                Применить
            </Button>
        </HStack>
    )

    return (
        <BaseDrawer
            ref={sortDrawerRef}
            footer={footer}
            isOpen={isOpen}
            title='Сортировка'
            onOpenChange={onOpenChange}
        >
            <form>
                <Controller
                    control={control}
                    name='sort_by'
                    render={({ field }) => (
                        <RadioCard.Root align='center' justify='center' orientation='vertical'>
                            <VStack align='flex-start'>
                                {SORT_OPTIONS.map((item) => {
                                    const isSelected = field.value === item.value

                                    return (
                                        <RadioCard.Item
                                            key={item.value}
                                            color={'blue.fg'}
                                            colorPalette='blue'
                                            rounded={'xl'}
                                            value={item.value}
                                            bg={
                                                field.value === item.value
                                                    ? 'blue.muted'
                                                    : 'transparent'
                                            }
                                        >
                                            <RadioCard.ItemHiddenInput />
                                            <RadioCard.ItemControl>
                                                <Button
                                                    color={'blue.fg'}
                                                    colorPalette='blue'
                                                    rounded={'xl'}
                                                    size='lg'
                                                    variant={isSelected ? 'subtle' : 'outline'}
                                                    bg={
                                                        field.value === item.value
                                                            ? 'blue.muted'
                                                            : 'transparent'
                                                    }
                                                    onClick={() => {
                                                        field.onChange(item.value)
                                                    }}
                                                >
                                                    {item.label}
                                                </Button>
                                            </RadioCard.ItemControl>
                                        </RadioCard.Item>
                                    )
                                })}
                            </VStack>
                        </RadioCard.Root>
                    )}
                />
            </form>
        </BaseDrawer>
    )
}
