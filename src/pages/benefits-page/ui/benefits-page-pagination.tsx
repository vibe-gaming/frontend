import { ButtonGroup, IconButton, Pagination, Text } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { ITEMS_PER_PAGE } from '../model/constants'

interface BenefitsPagePaginationProps {
    currentPage: number
    total: number
    onPageChange: (page: number) => void
}

export const BenefitsPagePagination = ({
    currentPage,
    total,
    onPageChange,
}: BenefitsPagePaginationProps) => {
    if (total <= ITEMS_PER_PAGE) {
        return null
    }

    return (
        <Pagination.Root
            count={total}
            display='flex'
            justifyContent='center'
            page={currentPage}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={(event) => onPageChange(event.page)}
        >
            <ButtonGroup gap='6' size='lg' variant='ghost'>
                <Pagination.PrevTrigger asChild>
                    <IconButton
                        _active={{ bg: 'blue.200' }}
                        colorPalette='blue'
                        transition='all 0.2s'
                        variant='ghost'
                        rounded='xl'
                    >
                        <LuChevronLeft />
                    </IconButton>
                </Pagination.PrevTrigger>
                <Text color='text.secondary' fontSize='lg'>
                    {currentPage} из {Math.ceil(total / ITEMS_PER_PAGE)}
                </Text>
                <Pagination.NextTrigger asChild>
                    <IconButton
                        _active={{ bg: 'blue.200' }}
                        colorPalette='blue'
                        transition='all 0.2s'
                        variant='ghost'
                        rounded='xl'
                    >
                        <LuChevronRight />
                    </IconButton>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    )
}
