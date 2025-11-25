import * as React from 'react'
import { Box, Button } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import {
    AuthBackButton,
    AuthButton,
    AuthButtonBox,
    AuthContentBox,
    AuthHeading,
    AuthPageBox,
} from '@/entities/auth'
import { AuthContent } from '@/entities/auth/ui/auth-content'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'
import { AppHeader } from '@/shared/ui/app-header'

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

export type GroupType = (typeof GROUP_TYPES)[keyof typeof GROUP_TYPES]

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
    const { group_type } = useSearch({ from: '/_auth/register/category' })
    const [selected, setSelected] = React.useState<GroupType[]>((group_type as GroupType[]) ?? [])

    const { isDesktop } = useDeviceDetect()

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
        <AuthPageBox>
            {isDesktop && <AppHeader />}

            <AuthContentBox>
                <AuthHeading>Выберите категорию льготы</AuthHeading>
                <AuthContent>
                    <Box w='100%'>
                        <Box display='flex' flexWrap='wrap' gap='16px'>
                            {groupTypes.map((type) => {
                                const isActive = selected.includes(type)

                                return (
                                    <Button
                                        _active={
                                            isActive
                                                ? { bg: 'blue.200' }
                                                : { bg: 'gray.200' }
                                        }
                                        key={type}
                                        borderRadius='xl'
                                        colorPalette={isActive ? 'blue' : 'gray'}
                                        size='xl'
                                        transition='all 0.2s'
                                        variant={isActive ? 'subtle' : 'surface'}
                                        onClick={() => toggleType(type)}
                                    >
                                        {GROUP_TYPE_LABELS[type]}
                                    </Button>
                                )
                            })}
                        </Box>
                    </Box>

                    <AuthButtonBox
                        display={isDesktop ? 'flex' : 'grid'}
                        gap='16px'
                        {...(isDesktop
                            ? { alignSelf: 'flex-start' }
                            : { gridTemplateColumns: '1fr 1fr' })}
                    >
                        <AuthBackButton
                            flexGrow={1}
                            onClick={() => navigate({ to: '/register/check-info' })}
                        >
                            <ArrowLeftIcon color='#173DA6' size={6} /> Назад
                        </AuthBackButton>
                        <AuthButton
                            disabled={selected.length === 0}
                            flexGrow={1}
                            onClick={handleNext}
                        >
                            Далее <ArrowRightIcon />
                        </AuthButton>
                    </AuthButtonBox>
                </AuthContent>
            </AuthContentBox>
        </AuthPageBox>
    )
}
