import { createLazyFileRoute } from '@tanstack/react-router'

import { LoginCallbackPage } from '@/pages/login-callback-page'

export const Route = createLazyFileRoute('/_auth/login/callback')({
    component: LoginCallbackPage,
})
