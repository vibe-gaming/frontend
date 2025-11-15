import { Outlet } from '@tanstack/react-router'

export const RegisterLayout = () => {
    return (
        <div>
            <Outlet />
            <h1>Регистрация</h1>
        </div>
    )
}
