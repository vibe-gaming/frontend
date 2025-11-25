import { Box, Heading, Text, VStack } from '@chakra-ui/react'

import type { V1BenefitResponse } from '@/shared/api/generated/entities/v1/BenefitResponse'

interface ChatBenefitCardProps {
    benefit: V1BenefitResponse
    onClick?: (benefitId: string) => void
}

export const ChatBenefitCard = ({ benefit, onClick }: ChatBenefitCardProps) => {
    const handleClick = () => {
        if (benefit.id && onClick) {
            onClick(benefit.id)
        }
    }

    return (
        <Box
            bg='white'
            borderColor='gray.300'
            borderRadius='lg'
            borderStyle='solid'
            borderWidth='2px'
            cursor='pointer'
            p={{ base: 4, md: 3 }}
            transition='all 0.2s'
            minH={{ base: '80px', md: 'auto' }}
            _hover={{
                borderColor: 'blue.400',
                shadow: 'md',
            }}
            _active={{
                borderColor: 'blue.500',
                shadow: 'sm',
            }}
            onClick={handleClick}
        >
            <VStack align='stretch' gap={3}>
                <Heading
                    fontSize='2xl'
                    fontWeight='bold'
                    lineHeight='32px'
                    noOfLines={2}
                    color='gray.900'
                >
                    {benefit.title || 'Без названия'}
                </Heading>
                {benefit.description && (
                    <Text
                        color='gray.600'
                        fontSize='lg'
                        lineHeight='28px'
                        noOfLines={2}
                    >
                        {benefit.description}
                    </Text>
                )}
            </VStack>
        </Box>
    )
}

