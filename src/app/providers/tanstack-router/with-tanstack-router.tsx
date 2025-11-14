import React from 'react'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from '@/app/route-tree.generated'

import * as TanstackQuery from '../tanstack-query'

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        ...TanstackQuery.getContext(),
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
    return (
        <RouterProvider
            router={router}
            // context={{
            //     auth: {
            //         profile,
            //     },
            // }}
        />
    )
}
