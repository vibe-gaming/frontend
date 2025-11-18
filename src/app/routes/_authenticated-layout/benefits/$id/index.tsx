import { createFileRoute } from '@tanstack/react-router'

import { BenefitPage } from '@/pages/benefit-page'

export const Route = createFileRoute('/_authenticated-layout/benefits/$id/')({
    component: BenefitPage,
    onEnter: () => {
        document.title = 'Льгота'
    },
})
