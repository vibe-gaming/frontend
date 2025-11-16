import { Box, Heading, Link, VStack } from '@chakra-ui/react'

export interface InfoSectionProps {
    title: string
    items: string[]
    onItemClick?: (item: string, index: number) => void
}

export const InfoSection = ({ title, items, onItemClick }: InfoSectionProps) => {
    return (
        <Box bg="white" borderRadius="16px" p="20px">
            <VStack align="start" gap="16px">
                <Heading as="h3" fontSize="lg" fontWeight="bold">
                    {title}
                </Heading>
                <VStack align="start" gap="12px" w="full">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            color="gray.700"
                            fontSize="sm"
                            w="full"
                            cursor="pointer"
                            _hover={{ color: 'blue.500', textDecoration: 'none' }}
                            onClick={() => onItemClick?.(item, index)}
                        >
                            {item}
                        </Link>
                    ))}
                </VStack>
            </VStack>
        </Box>
    )
}

