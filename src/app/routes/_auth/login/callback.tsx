import { createFileRoute } from '@tanstack/react-router'

import { LoginCallbackPage } from '@/pages/login-callback-page'
import type { GetUsersAuthCallbackQueryParams } from '@/shared/api/generated'

type CallbackSearch = GetUsersAuthCallbackQueryParams

export const Route = createFileRoute('/_auth/login/callback')({
    component: LoginCallbackPage,
    validateSearch: (search: Record<string, unknown>): CallbackSearch => {
        return {
            code: search.code as string,
            state: search.state as string,
        }
    },
})
