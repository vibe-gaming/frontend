import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register/')({
    beforeLoad: async ({ context }) => {
        const { isAuthenticated, isUserRegistered } = context
        if (isAuthenticated && isUserRegistered) {
            throw redirect({
                to: '/',
            })
        }
        if (isAuthenticated && !isUserRegistered) {
            throw redirect({
                to: '/register/check-info',
            })
        }
    },
    onEnter: () => {
        document.title = 'Мои Льготы | Регистрация'
    },
})
