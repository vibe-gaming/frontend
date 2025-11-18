import '@/shared/styles/global.scss'

import { WithAxios } from './axios'
import { WithChakraUI } from './chakra-ui'
import { WithTanstackQuery } from './tanstack-query'
import { WithTanstackRouter } from './tanstack-router'
import { WithToast } from './toast'
import { OfflineBenefitsPreloader } from '@/shared/components/offline-benefits-preloader/offline-benefits-preloader'

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
