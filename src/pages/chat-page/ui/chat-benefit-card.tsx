import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'

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
            borderRadius='2xl'
            cursor='pointer'
            p={{ base: 5, md: 5 }}
            transition='all 0.2s'
            minH={{ base: '168px', md: '168px' }}
            _hover={{
                shadow: 'md',
            }}
            _active={{
                shadow: 'sm',
            }}
            onClick={handleClick}
        >
            <VStack align='stretch' gap={5} justify='space-between' h='100%'>
                <Heading
                    fontSize='xl'
                    fontWeight='bold'
                    lineHeight='30px'
                >
                    {benefit.title || 'Без названия'}
                </Heading>
                <Button
                    variant='surface'
                    borderRadius='xl'
                    size='xl'
                    fontSize='lg'
                    lineHeight='28px'
                    w='100%'
                    color='blue.fg'
                    colorPalette='blue'
                    onClick={handleClick}
                    _active={{
                        bg: 'white',
                    }}
                >
                    Смотреть
                </Button>
                {/* {benefit.description && (
                    <Text
                        color='gray.600'
                        fontSize='lg'
                        lineHeight='28px'
                    >
                        {benefit.description}
                    </Text>
                )} */}
            </VStack>
        </Box>
    )
}

