import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { AppHeader } from '@/shared/ui/app-header'
import { Footer } from '@/shared/ui/footer'

export interface MyRouterContext {
    queryClient: QueryClient
    isAuthenticated?: boolean
    isUserRegistered?: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
})

function Root() {
    return (
        <>
            {globalThis.location.pathname !== '/login' && (
                // <Box
                //     bg='white'
                //     maxW='1280px'
                //     mx='auto'
                //     position='sticky'
                //     top={0}
                //     w='100%'
                //     zIndex={1000}
                // >
                //     <AppHeader />
                // </Box>
                <AppHeader />
            )}
            <Outlet />
            <Footer />
        </>
    )
}
