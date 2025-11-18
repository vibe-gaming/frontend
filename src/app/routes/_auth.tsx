import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
    beforeLoad: async ({ context, location }) => {
        const { isAuthenticated, isUserRegistered } = context

        // Если пользователь авторизован и зарегистрирован, редирект на главную
        if (isAuthenticated && isUserRegistered) {
            throw redirect({
                to: '/',
            })
        }

        // Если пользователь авторизован но не зарегистрирован
        if (isAuthenticated && !isUserRegistered) {
            // Разрешаем доступ к страницам регистрации (начинаются с /register/)
            if (location.pathname.startsWith('/register/')) {
                return // Разрешаем доступ
            }

            // Если пытается попасть на другие страницы (например /login), редирект на check-info
            throw redirect({
                to: '/register/check-info',
            })
        }

        // Если пользователь НЕ авторизован
        if (
            !isAuthenticated && // Если пытается попасть на страницы регистрации - редирект на логин
            location.pathname.startsWith('/register/')
        ) {
            throw redirect({
                to: '/login',
            })
        }
        // Для /login и других страниц _auth разрешаем доступ
    },
})
