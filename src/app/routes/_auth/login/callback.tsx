import { createFileRoute } from '@tanstack/react-router'

import type { GetUsersAuthCallbackQueryParams } from '@/shared/api/generated'

type CallbackSearch = GetUsersAuthCallbackQueryParams

export const Route = createFileRoute('/_auth/login/callback')({
    validateSearch: (search: Record<string, unknown>): CallbackSearch => {
        return {
            code: search.code as string,
            state: search.state as string,
        }
    },
})
