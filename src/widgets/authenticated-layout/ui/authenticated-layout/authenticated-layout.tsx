import { Navigate, Outlet } from '@tanstack/react-router'

import { useAuthState } from '@/entities/auth'

export const AuthenticatedLayout = () => {
    const { isAuthenticated } = useAuthState()

    if (!isAuthenticated) {
        return <Navigate to='/login' />
    }

    return <Outlet />
}
