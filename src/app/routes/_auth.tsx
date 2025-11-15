import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
    beforeLoad: async ({ context }) => {
        const { isAuthenticated, isUserRegistered } = context
        if (isAuthenticated && isUserRegistered) {
            throw redirect({
                to: '/',
            })
        } else if (isAuthenticated && !isUserRegistered) {
            throw redirect({
                to: '/register',
            })
        }
    },
})
