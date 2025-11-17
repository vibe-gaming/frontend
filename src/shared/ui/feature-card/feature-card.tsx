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
            p={4}
            borderWidth="1px"
            borderColor="blue.200"
            borderStyle="solid"
            borderRadius={"2xl"}
        >
            <VStack align="start" gap={2}>
                <HStack align="center" gap={2}>
                    <Flex
                        align="center"
                        color="blue.solid"
                        fontSize="32px"
                        justify="center"
                        width="32px"
                        height="32px"

                    >
                        {icon}
                    </Flex>
                    <Text fontWeight="bold" fontSize="xl" lineHeight={"30px"} textWrap="nowrap">
                        {title}
                    </Text>
                </HStack>
                <Text color="gray.600" fontSize="lg" lineHeight="28px">
                    {description}
                </Text>
            </VStack>
        </Box>
    )
}

