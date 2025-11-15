import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated-layout/benefits/')({
    onEnter: () => {
        document.title = 'Льготы'
    },
})
