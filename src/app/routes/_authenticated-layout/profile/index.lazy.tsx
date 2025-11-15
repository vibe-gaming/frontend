import { createLazyFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '@/pages/profile-page'

export const Route = createLazyFileRoute('/_authenticated-layout/profile/')({
    component: ProfilePage,
})
