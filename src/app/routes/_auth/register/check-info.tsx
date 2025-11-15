import { createFileRoute } from '@tanstack/react-router'

import { RegisterCheckInfoPage } from '@/pages/register-check-info-page'

export const Route = createFileRoute('/_auth/register/check-info')({
    component: RegisterCheckInfoPage,
})
