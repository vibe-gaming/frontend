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
            p={4}
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
                        fontSize='32px'
                        height='32px'
                        justify='center'
                        width='32px'
                    >
                        {icon}
                    </Flex>
                    <Text fontSize='xl' fontWeight='bold' lineHeight={'30px'} textWrap='nowrap'>
                        {title}
                    </Text>
                </Flex>
                <Text color='gray.600' fontSize='lg' lineHeight='28px'>
                    {description}
                </Text>
            </VStack>
        </Box>
    )
}
