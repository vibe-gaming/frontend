import { useMemo, useState } from 'react'
import {
    Badge,
    Box,
    Button,
    Heading,
    HStack,
    Input,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react'

import { useGetBenefits } from '@/shared/api/generated/hooks/useGetBenefits'
import { useDebounce } from '@/shared/hooks/use-debounce'

import styles from './benefits-page.module.scss'

const BENEFIT_TYPES = [
    { value: 'federal', label: 'Федеральная' },
    { value: 'regional', label: 'Региональная' },
    { value: 'commercial', label: 'Коммерческая' },
] as const

const TARGET_GROUPS = [
    { value: 'pensioners', label: 'Пенсионеры' },
    { value: 'disabled', label: 'Инвалиды' },
    { value: 'students', label: 'Студенты' },
    { value: 'young_families', label: 'Молодые семьи' },
    { value: 'low_income', label: 'Малоимущие' },
    { value: 'large_families', label: 'Многодетные семьи' },
    { value: 'children', label: 'Дети' },
    { value: 'veterans', label: 'Ветераны' },
] as const

const ITEMS_PER_PAGE = 20

export const BenefitsPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [benefitType, setBenefitType] = useState<string>('')
    const [targetGroups, setTargetGroups] = useState<string[]>([])
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const debouncedSearch = useDebounce(searchQuery, 500)

    const queryParams = useMemo(() => {
        const params: Parameters<typeof useGetBenefits>[0] = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
        }

        if (debouncedSearch) {
            params.search = debouncedSearch
        }

        if (benefitType) {
            params.type = benefitType
        }

        if (targetGroups.length > 0) {
            params.target_groups = targetGroups.join(',')
        }

        if (dateFrom) {
            params.date_from = dateFrom
        }

        if (dateTo) {
            params.date_to = dateTo
        }

        return params
    }, [debouncedSearch, benefitType, targetGroups, dateFrom, dateTo, currentPage])

    const { data, isLoading, isError, error } = useGetBenefits(queryParams)

    const handleResetFilters = () => {
        setSearchQuery('')
        setBenefitType('')
        setTargetGroups([])
        setDateFrom('')
        setDateTo('')
        setCurrentPage(1)
    }

    const totalPages = data?.total ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1

    if (isError) {
        return (
            <Box p={8}>
                <Text color='error.DEFAULT'>Не удалось загрузить льготы</Text>
                {error && 'error_message' in error && error.error_message && (
                    <Text color='text.secondary' fontSize='sm' mt={2}>
                        {error.error_message}
                    </Text>
                )}
            </Box>
        )
    }

    return (
        <Box className={styles['benefits-page']} p={8}>
            <VStack align='stretch' gap={6}>
                <Heading size='lg'>Льготы и субсидии</Heading>

                {/* Поиск и фильтры */}
                <Box
                    bg='background.surface'
                    borderColor='border.primary'
                    borderRadius='lg'
                    borderWidth='1px'
                    p={6}
                >
                    <VStack align='stretch' gap={4}>
                        {/* Поиск */}
                        <Box>
                            <Text fontSize='sm' fontWeight='medium' mb={2}>
                                Поиск
                            </Text>
                            <Input
                                placeholder='Введите название или описание льготы...'
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value)
                                    setCurrentPage(1)
                                }}
                            />
                        </Box>

                        {/* Тип льготы */}
                        <Box>
                            <Text fontSize='sm' fontWeight='medium' mb={2}>
                                Тип льготы
                            </Text>
                            <select
                                value={benefitType}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    borderWidth: '1px',
                                    borderColor: 'var(--border-primary)',
                                    backgroundColor: 'var(--background-primary)',
                                }}
                                onChange={(event) => {
                                    setBenefitType(event.target.value)
                                    setCurrentPage(1)
                                }}
                            >
                                <option value=''>Все типы</option>
                                {BENEFIT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </Box>

                        {/* Целевые группы */}
                        <Box>
                            <Text fontSize='sm' fontWeight='medium' mb={2}>
                                Целевые группы
                            </Text>
                            <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
                                {TARGET_GROUPS.map((group) => (
                                    <HStack key={group.value} gap={2}>
                                        <input
                                            checked={targetGroups.includes(group.value)}
                                            id={`target-group-${group.value}`}
                                            type='checkbox'
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setTargetGroups([...targetGroups, group.value])
                                                } else {
                                                    setTargetGroups(
                                                        targetGroups.filter(
                                                            (g) => g !== group.value
                                                        )
                                                    )
                                                }
                                                setCurrentPage(1)
                                            }}
                                        />
                                        <label
                                            htmlFor={`target-group-${group.value}`}
                                            style={{
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {group.label}
                                        </label>
                                    </HStack>
                                ))}
                            </SimpleGrid>
                        </Box>

                        {/* Даты */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            <Box>
                                <Text fontSize='sm' fontWeight='medium' mb={2}>
                                    Дата начала
                                </Text>
                                <Input
                                    type='date'
                                    value={dateFrom}
                                    onChange={(event) => {
                                        setDateFrom(event.target.value)
                                        setCurrentPage(1)
                                    }}
                                />
                            </Box>
                            <Box>
                                <Text fontSize='sm' fontWeight='medium' mb={2}>
                                    Дата окончания
                                </Text>
                                <Input
                                    type='date'
                                    value={dateTo}
                                    onChange={(event) => {
                                        setDateTo(event.target.value)
                                        setCurrentPage(1)
                                    }}
                                />
                            </Box>
                        </SimpleGrid>

                        {/* Кнопка сброса */}
                        <Button
                            alignSelf='flex-start'
                            size='sm'
                            variant='outline'
                            onClick={handleResetFilters}
                        >
                            Сбросить фильтры
                        </Button>
                    </VStack>
                </Box>

                {/* Результаты */}
                {isLoading ? (
                    <Box py={12} textAlign='center'>
                        <Spinner size='lg' />
                    </Box>
                ) : !data?.benefits || data.benefits.length === 0 ? (
                    <Box py={12} textAlign='center'>
                        <Text color='text.secondary' fontSize='lg'>
                            Льготы не найдены
                        </Text>
                        <Text color='text.secondary' fontSize='sm' mt={2}>
                            Попробуйте изменить параметры поиска или фильтры
                        </Text>
                    </Box>
                ) : (
                    <>
                        <Text color='text.secondary' fontSize='sm'>
                            Найдено льгот:{' '}
                            {data.total || data.benefits.length > 0 ? data.benefits.length : 0}
                        </Text>

                        <Stack gap={4}>
                            {data.benefits.length > 0 &&
                                data.benefits.map((benefit) => (
                                    <Box
                                        key={benefit.id}
                                        bg='background.surface'
                                        borderColor='border.primary'
                                        borderRadius='md'
                                        borderWidth='1px'
                                        p={6}
                                        transition='all 0.2s'
                                        _hover={{
                                            borderColor: 'border.accent',
                                            boxShadow: 'md',
                                        }}
                                    >
                                        <VStack align='stretch' gap={3}>
                                            <HStack align='start' justify='space-between'>
                                                <Heading flex={1} size='md'>
                                                    {benefit.title || 'Без названия'}
                                                </Heading>
                                                {benefit.type && (
                                                    <Badge
                                                        color='white'
                                                        bg={
                                                            benefit.type === 'federal'
                                                                ? 'brand.500'
                                                                : benefit.type === 'regional'
                                                                  ? 'accent.500'
                                                                  : 'info.500'
                                                        }
                                                    >
                                                        {BENEFIT_TYPES.find(
                                                            (t) => t.value === benefit.type
                                                        )?.label || benefit.type}
                                                    </Badge>
                                                )}
                                            </HStack>

                                            {benefit.description && (
                                                <Text
                                                    color='text.secondary'
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {benefit.description}
                                                </Text>
                                            )}

                                            {benefit.target_groups &&
                                                benefit.target_groups.length > 0 && (
                                                    <HStack flexWrap='wrap' gap={2}>
                                                        <Text
                                                            color='text.secondary'
                                                            fontSize='sm'
                                                            fontWeight='medium'
                                                        >
                                                            Для:
                                                        </Text>
                                                        {benefit.target_groups.map((group) => (
                                                            <Badge
                                                                key={group}
                                                                fontSize='xs'
                                                                variant='outline'
                                                            >
                                                                {TARGET_GROUPS.find(
                                                                    (g) => g.value === group
                                                                )?.label || group}
                                                            </Badge>
                                                        ))}
                                                    </HStack>
                                                )}

                                            {(benefit.valid_from || benefit.valid_to) && (
                                                <Text color='text.secondary' fontSize='sm'>
                                                    {benefit.valid_from &&
                                                        `С ${new Date(benefit.valid_from).toLocaleDateString('ru-RU')}`}
                                                    {benefit.valid_from && benefit.valid_to && ' '}
                                                    {benefit.valid_to &&
                                                        `до ${new Date(benefit.valid_to).toLocaleDateString('ru-RU')}`}
                                                </Text>
                                            )}
                                        </VStack>
                                    </Box>
                                ))}
                        </Stack>

                        {/* Пагинация */}
                        {totalPages > 1 && (
                            <HStack gap={2} justify='center' mt={4}>
                                <Button
                                    disabled={currentPage === 1}
                                    size='sm'
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                >
                                    Назад
                                </Button>
                                <Text color='text.secondary' fontSize='sm'>
                                    Страница {currentPage} из {totalPages}
                                </Text>
                                <Button
                                    disabled={currentPage >= totalPages}
                                    size='sm'
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                                    }
                                >
                                    Вперёд
                                </Button>
                            </HStack>
                        )}
                    </>
                )}
            </VStack>
        </Box>
    )
}
