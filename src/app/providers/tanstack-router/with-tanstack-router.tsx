import React from 'react'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from '@/app/route-tree.generated'
import { useAuthState } from '@/entities/auth'

import { getContext } from '../tanstack-query/index'

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        ...getContext(),
        isAuthenticated: false,
        isUserRegistered: false,
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    notFoundMode: 'root',
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export const WithTanstackRouter = () => {
    const { isAuthenticated } = useAuthState()

    // Мемоизируем контекст, чтобы избежать лишних перерендеров
    const context = React.useMemo(
        () => ({
            isAuthenticated,
            // isUserRegistered не нужен для роутера, так как проверка идет уже на страницах
            isUserRegistered: false,
        }),
        [isAuthenticated]
    )

    return <RouterProvider router={router} context={context} />
}
