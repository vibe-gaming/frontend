import { useRef } from 'react'
import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react'

import { BaseDrawer } from '@/shared/ui/base-drawer'

import { SORT_OPTIONS, SORT_ORDER_OPTIONS } from '../benefits-page/constants'

interface SortDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    // Временные состояния для сортировки
    tempSortBy: string
    tempSortOrder: string
    // Обработчики изменений
    onSortByChange: (value: string) => void
    onSortOrderChange: (value: string) => void
    // Обработчики действий
    onReset: () => void
    onApply: () => void
}

export const SortDrawer = ({
    isOpen,
    onOpenChange,
    tempSortBy,
    tempSortOrder,
    onSortByChange,
    onSortOrderChange,
    onReset,
    onApply,
}: SortDrawerProps) => {
    const sortDrawerRef = useRef<HTMLDivElement>(null)

    const footer = (
        <HStack gap={4} w='full'>
            <Button
                flex={1}
                size="2xl"
                variant="plain"
                colorPalette="blue"
                borderColor={'blue.muted'}
                rounded={'2xl'}
                onClick={onReset}
            >
                Сбросить
            </Button>
            <Button
                flex={1}
                size="2xl"
                variant="solid"
                colorPalette="blue"
                rounded={'2xl'}
                onClick={onApply}
            >
                Применить
            </Button>
        </HStack>
    )

    return (
        <BaseDrawer
            ref={sortDrawerRef}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Сортировка"
            footer={footer}
        >
            <VStack align='stretch' gap={6} pb={4}>
                {/* Поле сортировки */}
                <Box>
                    <Text fontSize='xl' fontWeight='bold' mb={4}>
                        Сортировать по
                    </Text>
                    <Flex gap={4} wrap='wrap'>
                        {SORT_OPTIONS.map((option) => {
                            const isSelected = tempSortBy === option.value
                            return (
                                <Button
                                    key={option.value}
                                    size="lg"
                                    colorPalette="blue"
                                    variant={isSelected ? 'subtle' : 'outline'}
                                    bg={isSelected ? 'blue.muted' : 'transparent'}
                                    color={'blue.fg'}
                                    rounded={'xl'}
                                    onClick={() => onSortByChange(option.value)}
                                >
                                    {option.label}
                                </Button>
                            )
                        })}
                    </Flex>
                </Box>

                {/* Направление сортировки */}
                <Box>
                    <Text fontSize='xl' fontWeight='bold' mb={4}>
                        Направление
                    </Text>
                    <Flex gap={4} wrap='wrap'>
                        {SORT_ORDER_OPTIONS.map((option) => {
                            const isSelected = tempSortOrder === option.value
                            return (
                                <Button
                                    key={option.value}
                                    size="lg"
                                    colorPalette="blue"
                                    variant={isSelected ? 'subtle' : 'outline'}
                                    bg={isSelected ? 'blue.muted' : 'transparent'}
                                    color={'blue.fg'}
                                    rounded={'xl'}
                                    onClick={() => onSortOrderChange(option.value)}
                                >
                                    {option.label}
                                </Button>
                            )
                        })}
                    </Flex>
                </Box>
            </VStack>
        </BaseDrawer>
    )
}

