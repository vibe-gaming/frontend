import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'

import { ChatWidget } from '@/widgets/chat-widget'

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
    const location = useLocation()
    const isChatPage = location.pathname === '/chat' || location.pathname.startsWith('/chat/')
    const isLoginPage = location.pathname === '/login'

    return (
        <>
            {!isLoginPage && !isChatPage && <AppHeader />}
            <Outlet />
            <ChatWidget />
            {!isChatPage && <Footer />}
        </>
    )
}
