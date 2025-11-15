import { createFileRoute } from '@tanstack/react-router'

import { AuthenticatedLayout } from '@/widgets/authenticated-layout'

export const Route = createFileRoute('/_authenticated-layout')({
    component: AuthenticatedLayout,
})
