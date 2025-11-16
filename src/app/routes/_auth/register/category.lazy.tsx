import { createLazyFileRoute } from '@tanstack/react-router'

import { RegisterCategoryPage } from '@/pages/register-category-page'

export const Route = createLazyFileRoute('/_auth/register/category')({
    component: RegisterCategoryPage,
})
