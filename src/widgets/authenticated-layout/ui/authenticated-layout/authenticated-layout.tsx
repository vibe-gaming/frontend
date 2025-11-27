import { Navigate, Outlet } from '@tanstack/react-router'

import { useAuthState } from '@/entities/auth'
import { ChatWidget } from '@/widgets/chat-widget'

export const AuthenticatedLayout = () => {
    const { isAuthenticated } = useAuthState()

    if (!isAuthenticated) {
        return <Navigate to='/login' />
    }

    return (
        <>
            <Outlet />
            <ChatWidget />
        </>
    )
}
