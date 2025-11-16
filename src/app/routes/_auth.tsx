import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
    beforeLoad: async ({ context }) => {
        console.log('context', context)
        const { isAuthenticated, isUserRegistered } = context
        if (isAuthenticated && isUserRegistered) {
            throw redirect({
                to: '/',
            })
        } else if (isAuthenticated && !isUserRegistered) {
            throw redirect({
                to: '/register/check-info',
            })
        }
    },
})
