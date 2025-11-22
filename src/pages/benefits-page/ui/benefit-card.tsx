import { useEffect, useState } from 'react'
import {
    Badge,
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Text,
    useMediaQuery,
    VStack,
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { FaHeart } from 'react-icons/fa'
import { LuHeart } from 'react-icons/lu'

import type { V1BenefitResponse } from '@/shared/api/generated/entities/v1/BenefitResponse'
import { usePostBenefitsIdFavorite } from '@/shared/api/generated/hooks/usePostBenefitsIdFavorite'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'

import { BENEFIT_TYPES, CATEGORIES, TAGS, TARGET_GROUPS } from '../model/constants'

interface BenefitCardProps {
    benefit: V1BenefitResponse
    isFavorite?: boolean
    onFavoriteChange?: (isFavorite: boolean) => void
    onClick?: (benefitId: string) => void
}

export const BenefitCard = ({
    benefit,
    isFavorite,
    onFavoriteChange,
    onClick,
}: BenefitCardProps) => {
    const [isDesktop] = useMediaQuery(['(min-width: 768px)'])
    const isOnline = useOnlineStatus()
    const queryClient = useQueryClient()

    // Используем benefit.favorite из API, если не передан prop isFavorite
    const [localIsFavorite, setLocalIsFavorite] = useState(
        isFavorite === undefined ? benefit.favorite || false : isFavorite
    )

    // Синхронизируем локальное состояние с изменениями в benefit.favorite
    useEffect(() => {
        const newFavoriteValue = isFavorite === undefined ? benefit.favorite || false : isFavorite
        setTimeout(() => {
            setLocalIsFavorite(newFavoriteValue)
        }, 0)
    }, [benefit.favorite, isFavorite])

    const favoriteMutation = usePostBenefitsIdFavorite({
        mutation: {
            onSuccess: () => {
                const newFavoriteState = !localIsFavorite
                setLocalIsFavorite(newFavoriteState)

                // Инвалидируем кэш для конкретной льготы и списка льгот
                queryClient.invalidateQueries({
                    queryKey: [{ url: '/benefits' }],
                })
                if (benefit.id) {
                    queryClient.invalidateQueries({
                        queryKey: [{ url: `/benefits/${benefit.id}` }],
                    })
                }

                onFavoriteChange?.(newFavoriteState)
            },
        },
    })

    const handleFavoriteClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        if (benefit.id) {
            favoriteMutation.mutate({ id: benefit.id })
        }
    }

    const handleDetailsClick = () => {
        if (benefit.id && onClick) {
            onClick(benefit.id)
        }
    }

    // Собираем теги в правильном порядке
    const tagsToDisplay: Array<{ label: string; isNew?: boolean }> = []

    // 1. TAGS (если new - зеленая)
    if (benefit.tags && benefit.tags.length > 0) {
        for (const tag of benefit.tags) {
            const tagOption = TAGS.find((t) => t.value === tag)
            if (tagOption) {
                tagsToDisplay.push({
                    label: tagOption.label,
                    isNew: tag === 'new',
                })
            }
        }
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
        for (const group of benefit.target_groups) {
            const groupOption = TARGET_GROUPS.find((g) => g.value === group)
            if (groupOption) {
                tagsToDisplay.push({ label: groupOption.label })
            }
        }
    }

    // 4. CATEGORIES
    if (benefit.category) {
        const categoryOption = CATEGORIES.find((c) => c.value === benefit.category)
        if (categoryOption) {
            tagsToDisplay.push({ label: categoryOption.label })
        }
    }

    return (
        <>
            <Box
                bg='background.primary'
                borderColor='border'
                borderRadius='2xl'
                borderStyle='solid'
                borderWidth='1px'
                display='flex'
                flexDirection='column'
                h={isDesktop ? '428px' : 'auto'}
                maxH='428px'
                minW={0}
                p={5}
                transition='all 0.2s'
                w='100%'
                _hover={{
                    borderColor: 'border.accent',
                    boxShadow: 'md',
                }}
                style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                }}
                onClick={handleDetailsClick}
            >
                <VStack align='stretch' flex={1} gap={5} h='100%'>
                    {/* Теги сверху */}
                    <HStack flexShrink={0} flexWrap='wrap' gap={2}>
                        {tagsToDisplay.map((tag, index) => (
                            <Badge
                                key={`${tag.label}-${index}`}
                                bg={tag.isNew ? 'green.subtle' : 'gray.subtle'}
                                color={tag.isNew ? 'green.fg' : 'gray.fg'}
                                fontSize='sm'
                                px={2.5}
                                py={1}
                                rounded='md'
                                size='lg'
                                variant='subtle'
                            >
                                {tag.label}
                            </Badge>
                        ))}
                    </HStack>

                    <VStack align='stretch' flex={1} gap={2} minH={0} minW={0}>
                        {/* Заголовок */}
                        <Heading
                            fontSize='2xl'
                            fontWeight='bold'
                            lineHeight='32px'
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                lineClamp: 3,
                            }}
                        >
                            {benefit.title || 'Без названия'}
                        </Heading>

                        {/* Описание */}
                        {benefit.description && (
                            <Text
                                color='gray.600'
                                flex={1}
                                fontSize='lg'
                                lineHeight='28px'
                                minW={0}
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    lineClamp: 3,
                                }}
                            >
                                {benefit.description}
                            </Text>
                        )}
                    </VStack>

                    {/* Кнопки внизу */}
                    <HStack flexShrink={0} gap={4} justify='space-between' mt='auto'>
                        <Button
                            _hover={{ bg: 'blue.solidHover' }}
                            bg='blue.solid'
                            color='white'
                            colorPalette='blue'
                            flex={1}
                            fontSize='xl'
                            fontWeight='medium'
                            lineHeight='30px'
                            rounded='2xl'
                            size='2xl'
                            variant='solid'
                            onClick={handleDetailsClick}
                        >
                            Подробнее
                        </Button>
                        {/* Кнопка избранного - скрыта в офлайне */}
                        {isOnline && (
                            <IconButton
                                aria-label='Добавить в избранное'
                                bg='blue.50'
                                color='blue.fg'
                                loading={favoriteMutation.isPending}
                                rounded='2xl'
                                size='2xl'
                                variant='solid'
                                _hover={{
                                    bg: localIsFavorite ? 'red.100' : 'blue.100',
                                }}
                                onClick={handleFavoriteClick}
                            >
                                {localIsFavorite ? <FaHeart size={24} /> : <LuHeart size={24} />}
                            </IconButton>
                        )}
                    </HStack>
                </VStack>
            </Box>
        </>
    )
}
