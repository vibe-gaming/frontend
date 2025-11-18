import { useState } from 'react'
import { Badge, Box, Button, Heading, HStack, IconButton, Text, useMediaQuery, VStack } from '@chakra-ui/react'
import { LuHeart } from 'react-icons/lu';
import { FaHeart } from "react-icons/fa";

import { usePostBenefitsIdFavorite } from '@/shared/api/generated/hooks/usePostBenefitsIdFavorite'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'
import { BENEFIT_TYPES, CATEGORIES, TAGS, TARGET_GROUPS } from '../benefits-page/constants'

import type { V1BenefitResponse } from '@/shared/api/generated/entities/v1/BenefitResponse'

interface BenefitCardProps {
    benefit: V1BenefitResponse
    isFavorite?: boolean
    onFavoriteChange?: (isFavorite: boolean) => void
    onClick?: (benefitId: string) => void
}

export const BenefitCard = ({ benefit, isFavorite = false, onFavoriteChange, onClick }: BenefitCardProps) => {
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"])
    const isOnline = useOnlineStatus()
    const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite)

    const favoriteMutation = usePostBenefitsIdFavorite({
        mutation: {
            onSuccess: () => {
                const newFavoriteState = !localIsFavorite
                setLocalIsFavorite(newFavoriteState)
                onFavoriteChange?.(newFavoriteState)
            },
        },
    })

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
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

    return (
        <Box
            bg='background.primary'
            borderColor='border'
            borderRadius='2xl'
            borderWidth='1px'
            borderStyle='solid'
            p={5}
            w='100%'
            minW={0}
            maxH="428px"
            h={isDesktop ? '428px' : 'auto'}
            display='flex'
            flexDirection='column'
            transition='all 0.2s'
            style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
            }}
            _hover={{
                borderColor: 'border.accent',
                boxShadow: 'md',
            }}
            onClick={handleDetailsClick}
        >
            <VStack align='stretch' gap={5} flex={1} h='100%'>
                {/* Теги сверху */}
                <HStack flexWrap='wrap' gap={2} flexShrink={0}>
                    {tagsToDisplay.map((tag, index) => (
                        <Badge
                            key={`${tag.label}-${index}`}
                            bg={tag.isNew ? 'green.subtle' : 'gray.subtle'}
                            color={tag.isNew ? 'green.fg' : 'gray.fg'}
                            fontSize='sm'
                            variant="subtle"
                            size="lg"
                            rounded='md'
                            px={2.5}
                            py={1}
                        >
                            {tag.label}
                        </Badge>
                    ))}
                </HStack>

                <VStack align='stretch' gap={2} flex={1} minH={0} minW={0}>
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
                            fontSize='lg'
                            lineHeight='28px'
                            flex={1}
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
                <HStack justify='space-between' gap={4} flexShrink={0} mt='auto'>
                    <Button
                        flex={1}
                        size="2xl"
                        variant="solid"
                        colorPalette="blue"
                        bg='blue.solid'
                        color='white'
                        rounded='2xl'
                        fontSize='xl'
                        fontWeight='medium'
                        lineHeight='30px'
                        onClick={handleDetailsClick}
                        _hover={{ bg: 'blue.solidHover' }}
                    >
                        Подробнее
                    </Button>
                    {/* Кнопка избранного - скрыта в офлайне */}
                    {isOnline && (
                        <IconButton
                            aria-label='Добавить в избранное'
                            variant='solid'
                            size='2xl'
                            rounded='2xl'
                            bg={localIsFavorite ? 'red.50' : 'blue.50'}
                            color={localIsFavorite ? 'red.fg' : 'blue.fg'}
                            onClick={handleFavoriteClick}
                            loading={favoriteMutation.isPending}
                            _hover={{
                                bg: localIsFavorite ? 'red.100' : 'blue.100',
                            }}
                        >
                            <FaHeart size={24} />
                        </IconButton>
                    )}
                </HStack>
            </VStack>
        </Box>
    )
}

