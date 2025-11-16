import * as React from 'react'
import { Box, Button, Center, Input, List, Text } from '@chakra-ui/react'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { type DomainGroupType, useGetCities, usePostUsersUpdateInfo } from '@/shared/api/generated'
import { HeaderMobile } from '@/shared/ui/header-mobile'

export const RegisterCityPage = () => {
    const navigate = useNavigate()
    const router = useRouter()
    const search = router.state.location.search as {
        group_type?: DomainGroupType[]
    }

    const [filter, setFilter] = React.useState('')
    const [selectedCityId, setSelectedCityId] = React.useState<string | null>(null)

    const { data: cities } = useGetCities({})

    const { mutateAsync, isPending } = usePostUsersUpdateInfo({})

    const filteredCities =
        cities?.filter((city) => city.name?.toLowerCase().includes(filter.toLowerCase())) ?? []

    const handleSubmit = async () => {
        if (!selectedCityId || !search.group_type?.length) return

        try {
            await mutateAsync({
                data: {
                    city_id: selectedCityId,
                    group_type: search.group_type,
                },
            })

            navigate({ to: '/benefits' })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box bg='gray.50' minH='100dvh' paddingTop='56px' w='100dvw'>
            <HeaderMobile title='Ваш город' />

            <Center pt='24px' px='16px'>
                <Box display='flex' flexDirection='column' gap='16px' w='100%'>
                    <Input
                        bg='white'
                        borderRadius='16px'
                        placeholder='Название города'
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                    />

                    <Box bg='white' borderRadius='16px' maxH='260px' overflowY='auto' w='100%'>
                        <List.Root>
                            {filteredCities.map((city) => (
                                <List.Item
                                    key={city.id}
                                    _hover={{ bg: 'gray.50' }}
                                    bg={selectedCityId === city.id ? 'blue.50' : 'transparent'}
                                    cursor='pointer'
                                    px='16px'
                                    py='10px'
                                    onClick={() => setSelectedCityId(city.id!)}
                                >
                                    <Text color='gray.800' fontSize='14px'>
                                        {city.name}
                                    </Text>
                                </List.Item>
                            ))}
                        </List.Root>
                    </Box>

                    <Button
                        borderRadius='999px'
                        colorScheme='blue'
                        disabled={isPending || !selectedCityId || !search.group_type?.length}
                        h='56px'
                        w='100%'
                        onClick={handleSubmit}
                    >
                        Далее
                    </Button>
                </Box>
            </Center>
        </Box>
    )
}
