import { createLazyFileRoute } from '@tanstack/react-router'

import { BenefitsPage } from '@/pages/benefits-page'

export const Route = createLazyFileRoute('/_authenticated-layout/benefits/')({
    component: BenefitsPage,
})
