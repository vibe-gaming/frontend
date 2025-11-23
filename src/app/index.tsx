import { Center, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

import { WithProviders } from './providers'

dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.locale('ru')
dayjs.extend(relativeTime)

export const App = () => {
    if (!globalThis.location.hostname.includes('localhost')) {
        return (
            <Center minH='100dvh' minW='100dvw'>
                <Text>Ведутся технические работы</Text>
            </Center>
        )
    }

    return <WithProviders />
}
