import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'

import type { ChatMessage as ChatMessageType } from '@/shared/utils/chat-storage'
import { renderMarkdown } from '@/shared/utils/markdown-parser'
import { ChatBenefitCard } from './chat-benefit-card'

interface ChatMessageProps {
    message: ChatMessageType
    onBenefitClick?: (benefitId: string) => void
}

export const ChatMessage = ({ message, onBenefitClick }: ChatMessageProps) => {
    return (
        <VStack align='stretch' gap={3}>
            <Flex justify={message.isBot ? 'flex-start' : 'flex-end'}>
                <Box
                    bg={message.isBot ? 'white' : 'blue.100'}
                    borderRadius='2xl'
                    borderBottomLeftRadius={message.isBot ? 'sm' : '2xl'}
                    borderBottomRightRadius={message.isBot ? '2xl' : 'sm'}
                    maxW='300px'
                    p={{ base: 4, md: 4 }}
                >
                    <Text
                        fontSize='lg'
                        lineHeight='28px'
                        whiteSpace='pre-wrap'
                        fontWeight='medium'
                    >
                        {renderMarkdown(message.text)}
                    </Text>
                </Box>
            </Flex>
            {/* Отображаем карточки льгот если они есть */}
            {message.isBot && message.benefits && message.benefits.length > 0 && (
                <Box mt={3}>
                    <Grid
                        gap={3}
                        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                    >
                        {message.benefits.map((benefit) => (
                            <ChatBenefitCard
                                key={benefit.id}
                                benefit={benefit}
                                onClick={onBenefitClick}
                            />
                        ))}
                    </Grid>
                </Box>
            )}
        </VStack>
    )
}

