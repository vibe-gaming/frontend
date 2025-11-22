import { createFileRoute } from '@tanstack/react-router'

import type { BenefitsSearchParams } from '@/entities/benefits'
import { BenefitsPage } from '@/pages/benefits-page'
import {
    BENEFIT_TYPES_ENUMS,
    CATEGORIES_ENUMS,
    TAGS_ENUMS,
    TARGET_GROUPS_ENUMS,
} from '@/shared/model/constants'

export const Route = createFileRoute('/_authenticated-layout/benefits/')({
    component: BenefitsPage,
    validateSearch: (search: Record<string, unknown>): BenefitsSearchParams => {
        return {
            page: search.page as number,
            search: search.search === '' ? undefined : (search.search as string),
            benefit_types:
                Array.isArray(search.benefit_types) && search.benefit_types.length === 0
                    ? undefined
                    : (search.benefit_types as BENEFIT_TYPES_ENUMS[]),
            target_groups:
                Array.isArray(search.target_groups) && search.target_groups.length === 0
                    ? undefined
                    : (search.target_groups as TARGET_GROUPS_ENUMS[]),
            tags:
                Array.isArray(search.tags) && search.tags.length === 0
                    ? undefined
                    : (search.tags as TAGS_ENUMS[]),
            categories:
                Array.isArray(search.categories) && search.categories.length === 0
                    ? undefined
                    : (search.categories as CATEGORIES_ENUMS[]),
            city_id: search.city_id === '' ? undefined : (search.city_id as string),
            date_from: search.date_from as string,
            date_to: search.date_to as string,
            sort_by: search.sort_by as string,
            order: search.order as string,
            favorites: search.favorites as boolean,
            filter_by_user_groups: search.filter_by_user_groups as boolean,
            format: search.format as string,
        }
    },
})
