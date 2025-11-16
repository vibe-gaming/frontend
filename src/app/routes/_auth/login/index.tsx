import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login/')({
    onEnter: () => {
        document.title = 'Мои Льготы | Авторизация'
    },
})
