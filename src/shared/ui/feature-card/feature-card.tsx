import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export interface FeatureCardProps {
    icon: ReactNode
    title: string
    description: string
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
    return (
        <Box
            bg="white"
            borderRadius="16px"
            boxShadow="sm"
            p="20px"
            transition="all 0.2s"
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
        >
            <VStack align="start" gap="8px">
                <HStack align="center" gap="12px">
                    <Flex
                        align="center"
                        color="blue.solid"
                        fontSize="28px"
                        justify="center"
                    >
                        {icon}
                    </Flex>
                    <Text fontWeight="semibold" fontSize="md" lineHeight="short">
                        {title}
                    </Text>
                </HStack>
                <Text color="gray.600" fontSize="sm" lineHeight="normal">
                    {description}
                </Text>
            </VStack>
        </Box>
    )
}

