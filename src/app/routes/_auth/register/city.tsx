import { createFileRoute } from '@tanstack/react-router'

import { RegisterCityPage } from '@/pages/register-city-page'

export type RegisterCitySearch = {
    group_type?: string[]
}

export const Route = createFileRoute('/_auth/register/city')({
    component: RegisterCityPage,
    validateSearch: (search: Record<string, unknown>): RegisterCitySearch => {
        return {
            group_type: search.group_type as string[],
        }
    },
})
