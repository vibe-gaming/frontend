import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '@/pages/profile-page'

export const Route = createFileRoute('/_authenticated-layout/profile/')({
    component: ProfilePage,
    onEnter: () => {
        // document.title = 'Профиль'
    },
})
