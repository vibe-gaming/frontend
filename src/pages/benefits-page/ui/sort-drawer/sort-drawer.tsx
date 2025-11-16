import { useRef } from 'react'
import { Box, Button, Drawer, Flex, HStack, Text, VStack } from '@chakra-ui/react'

import { LuX } from 'react-icons/lu'

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
    // Обработчики свайпа
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
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
    onTouchStart,
    onTouchMove,
}: SortDrawerProps) => {
    const sortDrawerRef = useRef<HTMLDivElement>(null)

    return (
        <Drawer.Root
            open={isOpen}
            onOpenChange={(e) => onOpenChange(e.open)}
            placement="bottom"
            closeOnInteractOutside
        >
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content
                    ref={sortDrawerRef}
                    mt={4}
                    borderTopRadius="2xl"
                    maxH="90vh"
                    style={{
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={(e) => onTouchMove(e)}
                >
                    {/* Индикатор свайпа */}
                    <Box
                        w="40px"
                        h="4px"
                        bg="gray.300"
                        borderRadius="full"
                        mx="auto"
                        mt={3}
                        mb={2}
                        onTouchStart={onTouchStart}
                        onTouchMove={(e) => onTouchMove(e)}
                        style={{ cursor: 'grab', touchAction: 'pan-y' }}
                    />
                    <Drawer.Header
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        pb={4}
                        pt={2}
                    >
                        <Box flex={1} />
                        <Drawer.Title flex={1} textAlign="center">
                            Сортировка
                        </Drawer.Title>
                        <Box flex={1} display="flex" justifyContent="flex-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenChange(false)}
                                p={2}
                                minW="auto"
                                h="auto"
                            >
                                <LuX size={20} />
                            </Button>
                        </Box>
                    </Drawer.Header>
                    <Drawer.Body px={6} py={0}>
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
                    </Drawer.Body>
                    <Drawer.Footer px={4} pt={2} pb={4}>
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
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    )
}

