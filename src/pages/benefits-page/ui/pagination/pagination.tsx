import { Button, HStack, Text } from '@chakra-ui/react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) {
        return null
    }

    return (
        <HStack gap={2} justify='center' mt={4}>
            <Button
                size="lg"
                colorPalette="blue"
                variant={'outline'}
                bg={'transparent'}
                color={'blue.fg'}
                rounded={'xl'}
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            >
                Назад
            </Button>
            <Text color='text.secondary' fontSize='sm'>
                Страница {currentPage} из {totalPages}
            </Text>
            <Button
                disabled={currentPage >= totalPages}
                size="lg"
                colorPalette="blue"
                variant={'outline'}
                bg={'transparent'}
                color={'blue.fg'}
                rounded={'xl'}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            >
                Вперёд
            </Button>
        </HStack>
    )
}

