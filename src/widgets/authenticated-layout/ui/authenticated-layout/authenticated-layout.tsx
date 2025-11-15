import { Outlet } from '@tanstack/react-router'

export const AuthenticatedLayout = () => {
    // ВРЕМЕННО: отключена проверка авторизации для тестирования
    // TODO: вернуть проверку авторизации после реализации
    // const isAuthenticated = useAuthIsAuthenticated()
    // if (!isAuthenticated) {
    //     return <Navigate to='/login' />
    // }

    return <Outlet />
}
