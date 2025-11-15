import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

// import { Devtools } from '@/shared/ui/devtools/devtools'
// import { NotFound } from '@/shared/ui/not-found'

export interface MyRouterContext {
    queryClient: QueryClient
    isAuthenticated?: boolean
    isUserRegistered?: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
    // notFoundComponent: NotFound,
})

function Root() {
    return (
        <>
            <Outlet />
        </>
    )
}
