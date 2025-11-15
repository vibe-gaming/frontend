import { createLazyFileRoute } from '@tanstack/react-router'

import { RegisterCityPage } from '@/pages/register-city-page'

export const Route = createLazyFileRoute('/_auth/register/city')({
    component: RegisterCityPage,
})
