import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
    onEnter: () => {
        document.title = 'Авторизация'
    },
})