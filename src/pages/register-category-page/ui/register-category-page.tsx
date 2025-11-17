import * as React from 'react'
import { Box, Button, Center, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'

import { HeaderMobile } from '@/shared/ui/header-mobile'

// Константы для типов групп
const GROUP_TYPES = {
    PENSIONERS: 'pensioners',
    DISABLED: 'disabled',
    YOUNG_FAMILIES: 'young_families',
    LOW_INCOME: 'low_income',
    STUDENTS: 'students',
    LARGE_FAMILIES: 'large_families',
    CHILDREN: 'children',
    VETERANS: 'veterans',
} as const

type GroupType = (typeof GROUP_TYPES)[keyof typeof GROUP_TYPES]

const GROUP_TYPE_LABELS: Record<GroupType, string> = {
    [GROUP_TYPES.PENSIONERS]: 'Пенсионеры',
    [GROUP_TYPES.DISABLED]: 'Инвалиды',
    [GROUP_TYPES.YOUNG_FAMILIES]: 'Молодые семьи',
    [GROUP_TYPES.LOW_INCOME]: 'Малоимущие',
    [GROUP_TYPES.STUDENTS]: 'Студенты',
    [GROUP_TYPES.LARGE_FAMILIES]: 'Многодетные семьи',
    [GROUP_TYPES.CHILDREN]: 'Дети',
    [GROUP_TYPES.VETERANS]: 'Ветераны',
}

const groupTypes = Object.values(GROUP_TYPES)

export const RegisterCategoryPage = () => {
    const navigate = useNavigate()
    const [selected, setSelected] = React.useState<GroupType[]>([])

    const toggleType = (type: GroupType) => {
        setSelected((previous) =>
            previous.includes(type) ? previous.filter((t) => t !== type) : [...previous, type]
        )
    }

    const handleNext = () => {
        if (selected.length === 0) return

        navigate({
            to: '/register/city',
            search: (previous) => ({
                ...previous,
                group_type: selected,
            }),
        })
    }

    return (
        <Box bg='gray.50' minH='100dvh' paddingTop='56px' w='100dvw'>
            <HeaderMobile title='Выберите категорию льготы' />

            <Center pt='24px' px='16px'>
                <Box display='flex' flexDirection='column' gap='24px' w='100%'>
                    <Box w='100%'>
                        <SimpleGrid columns={2} gap='12px'>
                            {groupTypes.map((type) => {
                                const isActive = selected.includes(type)

                                return (
                                    <Button
                                        key={type}
                                        borderRadius='999px'
                                        colorScheme='blue'
                                        fontSize='14px'
                                        h='40px'
                                        variant={isActive ? 'solid' : 'outline'}
                                        onClick={() => toggleType(type)}
                                    >
                                        {GROUP_TYPE_LABELS[type]}
                                    </Button>
                                )
                            })}
                        </SimpleGrid>
                    </Box>

                    <Flex gap='12px' justify='space-between' w='100%'>
                        <Button
                            borderRadius='999px'
                            h='48px'
                            variant='outline'
                            w='50%'
                            onClick={() => navigate({ to: '/register/check-info' })}
                        >
                            <Text>Назад</Text>
                        </Button>
                        <Button
                            borderRadius='999px'
                            colorScheme='blue'
                            disabled={selected.length === 0}
                            h='48px'
                            w='50%'
                            onClick={handleNext}
                        >
                            Далее
                        </Button>
                    </Flex>
                </Box>
            </Center>
        </Box>
    )
}
