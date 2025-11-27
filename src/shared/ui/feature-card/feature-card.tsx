import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'

import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

export interface FeatureCardProps {
    icon: ReactNode
    title: string
    description: string
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
    const { isDesktop } = useDeviceDetect()

    return (
        <Box
            bg='white'
            borderColor='blue.200'
            borderRadius={'2xl'}
            borderStyle='solid'
            borderWidth='1px'
            p={{ base: 4, md: 5 }}
        >
            <VStack align='start' gap={2}>
                <Flex
                    alignItems={isDesktop ? 'start' : 'center'}
                    flexDirection={isDesktop ? 'column' : 'row'}
                    gap={2}
                >
                    <Flex
                        align='center'
                        color='blue.solid'
                        height={{ base: '32px', md: '40px' }}
                        justify='center'
                        width={{ base: '32px', md: '40px' }}
                    >
                        {icon}
                    </Flex>
                    <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight='bold' lineHeight={{ base: '30px', md: '32px' }}>
                        {title}
                    </Text>
                </Flex>
                <Text color='gray.600' fontSize={{ base: 'lg', md: 'xl' }} lineHeight={{ base: '28px', md: '30px' }}>
                    {description}
                </Text>
            </VStack>
        </Box>
    )
}
