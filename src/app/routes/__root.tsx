import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'

import { AppHeader } from '@/shared/ui/app-header'
import { Footer } from '@/shared/ui/footer'
import { ChatWidget } from '@/widgets/chat-widget'

export interface MyRouterContext {
    queryClient: QueryClient
    isAuthenticated?: boolean
    isUserRegistered?: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
})

function Root() {
    const location = useLocation()
    const isChatPage = location.pathname === '/chat' || location.pathname.startsWith('/chat/')
    const isAuthPages =
        location.pathname.startsWith('/login') || location.pathname.startsWith('/register')

    return (
        <>
            <AppHeader />
            <Outlet />
            <ChatWidget />
            {!isChatPage && !isAuthPages && <Footer />}
        </>
    )
}
