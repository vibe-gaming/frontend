import { createFileRoute } from '@tanstack/react-router'

import { BenefitsPage } from '@/pages/benefits-page'

export const Route = createFileRoute('/_authenticated-layout/benefits/')({
    component: BenefitsPage,
    onEnter: () => {
        // document.title = 'Льготы'
    },
})
