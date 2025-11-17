import { Badge, Box, Button, Drawer, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { LuX } from 'react-icons/lu'

import { useGetBenefitsId } from '@/shared/api/generated/hooks/useGetBenefitsId'
import { BENEFIT_TYPES, CATEGORIES, TAGS, TARGET_GROUPS } from '../benefits-page/constants'

interface BenefitDrawerProps {
    isOpen: boolean
    onClose: () => void
    benefitId: string | null
}

export const BenefitDrawer = ({ isOpen, onClose, benefitId }: BenefitDrawerProps) => {
    const { data: benefit, isLoading, isError, error } = useGetBenefitsId(benefitId || '', {
        query: {
            enabled: Boolean(benefitId),
        },
    })

    // Собираем теги в правильном порядке
    const tagsToDisplay: Array<{ label: string; isNew?: boolean }> = []

    if (benefit) {
        // 1. TAGS (если new - зеленая)
        if (benefit.tags && benefit.tags.length > 0) {
            benefit.tags.forEach((tag) => {
                const tagOption = TAGS.find((t) => t.value === tag)
                if (tagOption) {
                    tagsToDisplay.push({
                        label: tagOption.label,
                        isNew: tag === 'new',
                    })
                }
            })
        }

        // 2. BENEFIT_TYPES
        if (benefit.type) {
            const typeOption = BENEFIT_TYPES.find((t) => t.value === benefit.type)
            if (typeOption) {
                tagsToDisplay.push({ label: typeOption.label })
            }
        }

        // 3. TARGET_GROUPS
        if (benefit.target_groups && benefit.target_groups.length > 0) {
            benefit.target_groups.forEach((group) => {
                const groupOption = TARGET_GROUPS.find((g) => g.value === group)
                if (groupOption) {
                    tagsToDisplay.push({ label: groupOption.label })
                }
            })
        }

        // 4. CATEGORIES
        if (benefit.category) {
            const categoryOption = CATEGORIES.find((c) => c.value === benefit.category)
            if (categoryOption) {
                tagsToDisplay.push({ label: categoryOption.label })
            }
        }
    }

    return (
        <Drawer.Root
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) {
                    onClose()
                }
            }}
            placement="bottom"
            closeOnInteractOutside={false}
        >
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content
                    h="100vh"
                    mt={0}
                    borderTopRadius="0"
                    style={{
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                    }}
                >
                    <Drawer.Header
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        pb={4}
                        pt={4}
                        px={6}
                    >
                        <Button
                            variant="ghost"
                            size="2xl"
                            onClick={onClose}
                            p={4}
                            border={'none'}
                            minW="auto"
                            h="auto"
                            aria-label="Закрыть"
                        >
                            <LuX size={20} />
                        </Button>
                    </Drawer.Header>

                    <Drawer.Body
                        px={6}
                        py={0}
                        style={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        {isLoading ? (
                            <Box py={12} textAlign="center" aria-live="polite">
                                <Spinner size="lg" />
                                <Text color="text.secondary" fontSize="md" mt={4}>
                                    Загрузка...
                                </Text>
                            </Box>
                        ) : isError ? (
                            <Box py={12} textAlign="center" role="alert">
                                <Text color="error.DEFAULT" fontSize="lg">
                                    Не удалось загрузить льготу
                                </Text>
                            </Box>
                        ) : !benefit ? (
                            <Box py={12} textAlign="center">
                                <Text color="text.secondary" fontSize="lg">
                                    Льгота не найдена
                                </Text>
                            </Box>
                        ) : (
                            <Box as="article">
                                {/* Теги/фильтры */}
                                {tagsToDisplay.length > 0 && (
                                    <Box as="nav" aria-label="Категории льготы" mb={6}>
                                        <HStack flexWrap="wrap" gap={2}>
                                            {tagsToDisplay.map((tag, index) => (
                                                <Badge
                                                    key={`${tag.label}-${index}`}
                                                    bg={tag.isNew ? 'green.subtle' : 'gray.subtle'}
                                                    color={tag.isNew ? 'green.fg' : 'gray.fg'}
                                                    fontSize="sm"
                                                    variant="subtle"
                                                    size="lg"
                                                    rounded="md"
                                                    px={2.5}
                                                    py={1}
                                                >
                                                    {tag.label}
                                                </Badge>
                                            ))}
                                        </HStack>
                                    </Box>
                                )}

                                {/* Заголовок */}
                                <Heading as="h1" fontSize="3xl" fontWeight="bold" mb={4} id="benefit-title">
                                    {benefit.title || 'Без названия'}
                                </Heading>

                                {/* Описание */}
                                {benefit.description && (
                                    <Text fontSize="lg" color="gray.600" mb={8} lineHeight="28px">
                                        {benefit.description}
                                    </Text>
                                )}

                                {/* Секция "Кому положено" */}
                                {benefit.target_groups && benefit.target_groups.length > 0 && (
                                    <Box as="section" aria-labelledby="eligible-heading" mb={8}>
                                        <Heading as="h2" id="eligible-heading" fontSize="xl" fontWeight="bold" mb={4}>
                                            Кому положено
                                        </Heading>
                                        <Box as="ul" pl={5} style={{ listStyleType: 'disc' }}>
                                            {benefit.target_groups.map((group) => {
                                                const groupOption = TARGET_GROUPS.find((g) => g.value === group)
                                                return groupOption ? (
                                                    <Text as="li" key={group} fontSize="md" color="gray.700" mb={2}>
                                                        {groupOption.label}
                                                    </Text>
                                                ) : null
                                            })}
                                        </Box>
                                    </Box>
                                )}

                                {/* Секция "Какие документы нужны" */}
                                <Box as="section" aria-labelledby="documents-heading" mb={8}>
                                    <Heading as="h2" id="documents-heading" fontSize="xl" fontWeight="bold" mb={4}>
                                        Какие документы нужны
                                    </Heading>
                                    <Box as="ul" pl={5} style={{ listStyleType: 'disc' }}>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Паспорт
                                        </Text>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Медицинский полис
                                        </Text>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Пенсионное удостоверение или подтверждение статуса
                                        </Text>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Рецепт врача
                                        </Text>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            СНИЛС
                                        </Text>
                                    </Box>
                                </Box>

                                {/* Секция "Как получить" */}
                                <Box as="section" aria-labelledby="how-to-heading" mb={8}>
                                    <Heading as="h2" id="how-to-heading" fontSize="xl" fontWeight="bold" mb={4}>
                                        Как получить
                                    </Heading>
                                    <Box as="ol" pl={5} style={{ listStyleType: 'decimal' }}>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Обратиться к лечащему врачу
                                        </Text>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Получить рецепт
                                        </Text>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Найти ближайшую аптеку
                                        </Text>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Предъявить документы
                                        </Text>
                                        <Text as="li" fontSize="md" color="gray.700" mb={2}>
                                            Получить лекарства
                                        </Text>
                                    </Box>
                                </Box>

                                {/* Секция "Где получить" */}
                                <Box as="section" aria-labelledby="where-heading" mb={8}>
                                    <Heading as="h2" id="where-heading" fontSize="xl" fontWeight="bold" mb={4}>
                                        Где получить
                                    </Heading>

                                    {/* Теги доступности */}
                                    <HStack gap={2} mb={6}>
                                        <Badge
                                            bg="gray.subtle"
                                            color="gray.fg"
                                            fontSize="sm"
                                            variant="subtle"
                                            size="lg"
                                            rounded="md"
                                            px={2.5}
                                            py={1}
                                        >
                                            С пандусом
                                        </Badge>
                                        <Badge
                                            bg="gray.subtle"
                                            color="gray.fg"
                                            fontSize="sm"
                                            variant="subtle"
                                            size="lg"
                                            rounded="md"
                                            px={2.5}
                                            py={1}
                                        >
                                            С подъемником
                                        </Badge>
                                    </HStack>

                                    {/* Аптека 1 */}
                                    <Box mb={6} p={4} bg="gray.50" borderRadius="xl">
                                        <Heading as="h3" fontSize="lg" fontWeight="bold" mb={2}>
                                            Аптека 1
                                        </Heading>
                                        <Text fontSize="sm" color="gray.600" mb={4}>
                                            пн-пт 09:00-22:00
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" mb={4}>
                                            сб-вс 10:00-20:00
                                        </Text>
                                        <Button
                                            variant="outline"
                                            colorPalette="blue"
                                            size="lg"
                                            rounded="xl"
                                            aria-label="Построить маршрут до Аптеки 1"
                                        >
                                            Построить маршрут
                                        </Button>
                                    </Box>

                                    {/* Аптека 2 */}
                                    <Box mb={6} p={4} bg="gray.50" borderRadius="xl">
                                        <HStack gap={2} mb={2}>
                                            <Heading as="h3" fontSize="lg" fontWeight="bold">
                                                Аптека 2
                                            </Heading>
                                            <Badge
                                                bg="gray.subtle"
                                                color="gray.fg"
                                                fontSize="sm"
                                                variant="subtle"
                                                size="lg"
                                                rounded="md"
                                                px={2.5}
                                                py={1}
                                            >
                                                С пандусом
                                            </Badge>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.600" mb={4}>
                                            пн-пт 09:00-22:00
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" mb={4}>
                                            сб-вс 10:00-20:00
                                        </Text>
                                        <Button
                                            variant="outline"
                                            colorPalette="blue"
                                            size="lg"
                                            rounded="xl"
                                            aria-label="Построить маршрут до Аптеки 2"
                                        >
                                            Построить маршрут
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    )
}

