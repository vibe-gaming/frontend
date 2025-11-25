import '@/shared/styles/global.scss'

import { OfflineBenefitsPreloader } from '@/shared/ui/offline-benefits-preloader'

import { WithAxios } from './axios'
import { WithChakraUI } from './chakra-ui'
import { WithTanstackQuery } from './tanstack-query'
import { WithTanstackRouter } from './tanstack-router'
import { WithToast } from './toast'

export const WithProviders = () => {
    return (
        <WithChakraUI>
            <WithTanstackQuery>
                <OfflineBenefitsPreloader />
                <WithTanstackRouter />
                <WithToast />
                <WithAxios />
            </WithTanstackQuery>
        </WithChakraUI>
    )
}
