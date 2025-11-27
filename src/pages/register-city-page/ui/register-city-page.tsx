import * as React from 'react'
import { Combobox, Portal, Spinner, Text, useFilter, useListCollection } from '@chakra-ui/react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'

import {
    AuthBackButton,
    AuthButton,
    AuthButtonBox,
    AuthContent,
    AuthContentBox,
    AuthHeading,
    AuthPageBox,
} from '@/entities/auth'
import { DomainGroupTypeEnum, useGetCities, usePostUsersUpdateInfo } from '@/shared/api/generated'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'

interface CityOption {
    label: string
    value: string
}

export const RegisterCityPage = () => {
    const navigate = useNavigate()
    const router = useRouter()
    const search = router.state.location.search as {
        group_type?: string[]
    }

    const [selectedCityId, setSelectedCityId] = React.useState<string | null>(null)

    const { data: cities, isLoading } = useGetCities()

    const { mutateAsync, isPending } = usePostUsersUpdateInfo()

    const handleSubmit = async () => {
        if (!selectedCityId || !search.group_type?.length) return

        try {
            await mutateAsync(
                {
                    data: {
                        city_id: selectedCityId,
                        groups: search.group_type as DomainGroupTypeEnum[],
                    },
                },
                {
                    onSuccess: () => {
                        navigate({ to: '/benefits' })
                        toast.success('Данные успешно сохранены')
                    },
                }
            )
        } catch (error) {
            console.error(error)
        }
    }

    const { isDesktop } = useDeviceDetect()

    const { contains } = useFilter({ sensitivity: 'base' })

    const { collection, filter, set } = useListCollection<CityOption>({
        initialItems: [],
        filter: contains,
    })

    React.useEffect(() => {
        if (cities && !isLoading) {
            const initialItems: CityOption[] = cities.map((city) => ({
                label: city.name ?? '',
                value: city.id ?? '',
            }))

            set(initialItems)
        }
    }, [cities, isLoading, set])

    return (
        <AuthPageBox>
            <AuthContentBox>
                <AuthHeading>Ваш город</AuthHeading>
                <AuthContent>
                    <Combobox.Root
                        openOnClick
                        collection={collection}
                        maxW={{ base: '100%', md: '343px' }}
                        w='100%'
                        onInputValueChange={(event) => filter(event.inputValue)}
                        onValueChange={(event) => setSelectedCityId(event.value[0] ?? null)}
                    >
                        <Combobox.Control>
                            <Combobox.Input
                                bgColor='bg.subtle'
                                border='1px solid'
                                borderColor='whiteAlpha.50'
                                borderRadius='2xl'
                                color={selectedCityId ? 'fg.subtle' : '#A1A1AA'}
                                fontSize='lg'
                                fontWeight='normal'
                                height='16'
                                placeholder='Название города'
                                px='5'
                                py='10px'
                            />
                            <Combobox.IndicatorGroup pr='6'>
                                <Combobox.ClearTrigger>
                                    <XIcon size={24} />
                                </Combobox.ClearTrigger>
                                {isLoading && (
                                    <Spinner borderWidth='1.5px' color='fg.muted' size='xs' />
                                )}
                            </Combobox.IndicatorGroup>
                        </Combobox.Control>
                        <Portal>
                            <Combobox.Positioner>
                                <Combobox.Content
                                    borderRadius='xl'
                                    display='flex'
                                    flexDirection='column'
                                    gap='12px'
                                    px='1.5'
                                    py='3'
                                >
                                    <Combobox.Empty gap='2' pb='1' pl='1.5' pr='1.5' pt='1'>
                                        <Text color='fg' fontSize='md' fontWeight={500}>
                                            Город не найден
                                        </Text>
                                    </Combobox.Empty>
                                    {collection.items.map((item) => (
                                        <Combobox.Item
                                            key={item.value}
                                            cursor='pointer'
                                            gap='2'
                                            item={item}
                                            pb='1'
                                            pl='1.5'
                                            pr='1.5'
                                            pt='1'
                                        >
                                            <Text color='fg' fontSize='lg' fontWeight={500}>
                                                {item.label}
                                            </Text>
                                            <Combobox.ItemIndicator />
                                        </Combobox.Item>
                                    ))}
                                </Combobox.Content>
                            </Combobox.Positioner>
                        </Portal>
                    </Combobox.Root>

                    <AuthButtonBox
                        display={isDesktop ? 'flex' : 'grid'}
                        gap='16px'
                        {...(isDesktop
                            ? { alignSelf: 'flex-start' }
                            : { gridTemplateColumns: '1fr 1fr' })}
                    >
                        <AuthBackButton
                            flexGrow={1}
                            onClick={() =>
                                navigate({
                                    to: '/register/category',
                                    search: { group_type: search.group_type },
                                })
                            }
                        >
                            <ArrowLeftIcon color='#173DA6' size={6} /> Назад
                        </AuthBackButton>
                        <AuthButton
                            disabled={isPending || !selectedCityId || !search.group_type?.length}
                            flexGrow={1}
                            onClick={handleSubmit}
                        >
                            Далее <ArrowRightIcon />
                        </AuthButton>
                    </AuthButtonBox>
                </AuthContent>
            </AuthContentBox>
        </AuthPageBox>
    )
}
