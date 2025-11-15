import { createLazyFileRoute } from '@tanstack/react-router'

import { RegisterLayout } from '@/widgets/register-layout'

export const Route = createLazyFileRoute('/_auth/register')({
    component: RegisterLayout,
})
