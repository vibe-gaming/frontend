import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register/')({
    onEnter: () => {
        // document.title = 'Мои Льготы | Регистрация'
    },
})
