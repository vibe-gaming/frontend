import { useAuthState } from '@/entities/auth'
import { Navigate, Outlet } from '@tanstack/react-router'

export const AuthenticatedLayout = () => {
    const { isAuthenticated } = useAuthState()
    
    // if (!isAuthenticated) {
    //     return <Navigate to='/login' />
    // }

    return <Outlet />
}
