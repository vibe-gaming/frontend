import { createFileRoute } from '@tanstack/react-router'

import { RegisterCategoryPage } from '@/pages/register-category-page'

export type RegisterCategorySearch = {
    group_type?: string[]
}

export const Route = createFileRoute('/_auth/register/category')({
    component: RegisterCategoryPage,
    validateSearch: (search: Record<string, unknown>): RegisterCategorySearch => {
        return {
            group_type: search.group_type as string[],
        }
    },
})
