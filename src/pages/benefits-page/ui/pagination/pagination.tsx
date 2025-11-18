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

    const handlePrevious = () => {
        onPageChange(Math.max(1, currentPage - 1))
    }

    const handleNext = () => {
        onPageChange(Math.min(totalPages, currentPage + 1))
    }

    const isFirstPage = currentPage === 1
    const isLastPage = currentPage >= totalPages

    return (
        <nav aria-label="Навигация по страницам">
            <HStack gap={2} justify='center' mt={4}>
                <Button
                    size="lg"
                    colorPalette="blue"
                    variant={'outline'}
                    bg={'transparent'}
                    color={'blue.fg'}
                    rounded={'xl'}
                    disabled={isFirstPage}
                    aria-label={isFirstPage ? 'Предыдущая страница (недоступна)' : `Перейти на страницу ${currentPage - 1}`}
                    aria-disabled={isFirstPage}
                    onClick={handlePrevious}
                >
                    Назад
                </Button>
                <Text 
                    color='text.secondary' 
                    fontSize='sm'
                    aria-live="polite"
                    aria-atomic="true"
                >
                    Страница {currentPage} из {totalPages}
                </Text>
                <Button
                    disabled={isLastPage}
                    size="lg"
                    colorPalette="blue"
                    variant={'outline'}
                    bg={'transparent'}
                    color={'blue.fg'}
                    rounded={'xl'}
                    aria-label={isLastPage ? 'Следующая страница (недоступна)' : `Перейти на страницу ${currentPage + 1}`}
                    aria-disabled={isLastPage}
                    onClick={handleNext}
                >
                    Вперёд
                </Button>
            </HStack>
        </nav>
    )
}

