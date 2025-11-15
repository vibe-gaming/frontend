import { Navigate } from '@tanstack/react-router'

export const AuthenticatedLayout = () => {
    return <Navigate to='/login' />
}
