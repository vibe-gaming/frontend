import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
    onEnter: () => {
        document.title = 'Авторизация'
    },
    component: LoginPage,
})

function LoginPage() {
    return <div>LoginPage</div>
}
