import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated-layout/profile/')({
    onEnter: () => {
        // document.title = 'Профиль'
    },
})
