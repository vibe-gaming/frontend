import { useState } from 'react'
import { Box, Grid, Spinner, Text } from '@chakra-ui/react'

import { type V1BenefitResponse } from '@/shared/api/generated'

import { BenefitCard } from './benefit-card'
import { BenefitDrawer } from './benefit-drawer'

interface BenefitsCardsProps {
    benefits: V1BenefitResponse[]
    isLoading: boolean
}

export const BenefitsCards: React.FC<BenefitsCardsProps> = ({ benefits, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null)

    if (isLoading) {
        return (
            <Box
                minH={{ base: 'calc(100dvh - 100px)', md: 'calc(100dvh - 144px)' }}
                py={12}
                textAlign='center'
            >
                <Spinner size='lg' />
            </Box>
        )
    }

    if (!isLoading && (!benefits || benefits.length === 0)) {
        return (
            <Box py={12} textAlign='center'>
                <Text color='text.secondary' fontSize='lg'>
                    Льготы не найдены
                </Text>
                <Text color='text.secondary' fontSize='sm' mt={2}>
                    Попробуйте изменить параметры поиска или фильтры
                </Text>
            </Box>
        )
    }

    if (!isLoading) {
        if (benefits.length === 0) {
            return (
                <Box py={12} textAlign='center'>
                    <Text color='text.secondary' fontSize='lg'>
                        Льготы не найдены
                    </Text>
                    <Text color='text.secondary' fontSize='sm' mt={2}>
                        Попробуйте изменить параметры поиска или фильтры
                    </Text>
                </Box>
            )
        }

        return (
            <>
                <Grid
                    gap={{ base: 4, md: 5 }}
                    templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
                >
                    {benefits.map((benefit) => (
                        <BenefitCard
                            key={benefit.id}
                            benefit={benefit}
                            onClick={(benefitId) => {
                                setSelectedBenefitId(benefitId)
                                setIsOpen(true)
                            }}
                        />
                    ))}
                </Grid>
                <BenefitDrawer
                    benefitId={selectedBenefitId}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            </>
        )
    }
}
