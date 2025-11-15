import { createLazyFileRoute } from '@tanstack/react-router'

import { BenefitPage } from '@/pages/benefit-page'

export const Route = createLazyFileRoute('/_authenticated-layout/benefits/$id/')({
    component: BenefitPage,
})
