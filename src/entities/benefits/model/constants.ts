import type { GetBenefitsQueryParams } from '@/shared/api/generated'
import type {
    BENEFIT_TYPES_ENUMS,
    CATEGORIES_ENUMS,
    TAGS_ENUMS,
    TARGET_GROUPS_ENUMS,
} from '@/shared/model/constants'

export type BenefitsSearchParams = Omit<
    GetBenefitsQueryParams,
    'type' | 'target_groups' | 'tags' | 'categories' | 'limit'
> & {
    benefit_types?: BENEFIT_TYPES_ENUMS[]
    target_groups?: TARGET_GROUPS_ENUMS[]
    tags?: TAGS_ENUMS[]
    categories?: CATEGORIES_ENUMS[]
}
