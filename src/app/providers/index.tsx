import '@/shared/styles/global.scss'

import { WithTanstackQuery } from './tanstack-query'
import { WithTanstackRouter } from './tanstack-router'
import { WithToast } from './toast'

export const WithProviders = () => {
    return (
        <WithTanstackQuery>
            <WithTanstackRouter />
            <WithToast />
        </WithTanstackQuery>
    )
}
