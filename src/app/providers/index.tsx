import '@/shared/styles/global.scss'

import { WithAxios } from './axios'
import { WithChakraUI } from './chakra-ui'
import { WithTanstackQuery } from './tanstack-query'
import { WithTanstackRouter } from './tanstack-router'
import { WithToast } from './toast'

export const WithProviders = () => {
    return (
        <WithChakraUI>
            <WithTanstackQuery>
                <WithTanstackRouter />
                <WithToast />
                <WithAxios />
            </WithTanstackQuery>
        </WithChakraUI>
    )
}
