export enum BENEFIT_TYPES_ENUMS {
    FEDERAL = 'federal',
    REGIONAL = 'regional',
    COMMERCIAL = 'commercial',
}

export const BENEFIT_TYPES_ARRAY = [
    { value: BENEFIT_TYPES_ENUMS.FEDERAL, label: 'Федеральная' },
    { value: BENEFIT_TYPES_ENUMS.REGIONAL, label: 'Региональная' },
    { value: BENEFIT_TYPES_ENUMS.COMMERCIAL, label: 'Коммерческая' },
]

export enum TARGET_GROUPS_ENUMS {
    PENSIONERS = 'pensioners',
    DISABLED = 'disabled',
    STUDENTS = 'students',
    YOUNG_FAMILIES = 'young_families',
    LOW_INCOME = 'low_income',
    LARGE_FAMILIES = 'large_families',
    CHILDREN = 'children',
    VETERANS = 'veterans',
}

export const TARGET_GROUPS_ARRAY = [
    { value: TARGET_GROUPS_ENUMS.PENSIONERS, label: 'Пенсионеры' },
    { value: TARGET_GROUPS_ENUMS.DISABLED, label: 'Инвалиды' },
    { value: TARGET_GROUPS_ENUMS.STUDENTS, label: 'Студенты' },
    { value: TARGET_GROUPS_ENUMS.YOUNG_FAMILIES, label: 'Молодые семьи' },
    { value: TARGET_GROUPS_ENUMS.LOW_INCOME, label: 'Малоимущие' },
    { value: TARGET_GROUPS_ENUMS.LARGE_FAMILIES, label: 'Многодетные семьи' },
    { value: TARGET_GROUPS_ENUMS.CHILDREN, label: 'Дети' },
    { value: TARGET_GROUPS_ENUMS.VETERANS, label: 'Ветераны' },
]

export enum TAGS_ENUMS {
    SAVED = 'saved',
    AVAILABLE_TO_ME = 'available_to_me',
    NEW = 'new',
    RECOMMENDED = 'recommended',
    POPULAR = 'popular',
}

export const TAGS_ARRAY = [
    { value: TAGS_ENUMS.SAVED, label: 'Сохраненные' },
    { value: TAGS_ENUMS.AVAILABLE_TO_ME, label: 'Доступные мне' },
    { value: TAGS_ENUMS.NEW, label: 'Новые' },
    { value: TAGS_ENUMS.RECOMMENDED, label: 'Рекомендуемые' },
    { value: TAGS_ENUMS.POPULAR, label: 'Популярные' },
]

export enum CATEGORIES_ENUMS {
    MEDICINE = 'medicine',
    TRANSPORT = 'transport',
    FOOD = 'food',
    CLOTHING = 'clothing',
    EDUCATION = 'education',
    PAYMENTS = 'payments',
    OTHER = 'other',
}

export const CATEGORIES_ARRAY = [
    { value: CATEGORIES_ENUMS.MEDICINE, label: 'Медицина' },
    { value: CATEGORIES_ENUMS.TRANSPORT, label: 'Транспорт' },
    { value: CATEGORIES_ENUMS.FOOD, label: 'Питание' },
    { value: CATEGORIES_ENUMS.CLOTHING, label: 'Одежда' },
    { value: CATEGORIES_ENUMS.EDUCATION, label: 'Образование' },
    { value: CATEGORIES_ENUMS.PAYMENTS, label: 'Выплаты' },
    { value: CATEGORIES_ENUMS.OTHER, label: 'Другое' },
]

export enum SORT_OPTIONS_ENUMS {
    CREATED_AT = 'created_at',
    VIEWS = 'views',
}

export const SORT_OPTIONS_ARRAY = [
    { value: SORT_OPTIONS_ENUMS.CREATED_AT, label: 'По дате создания' },
    { value: SORT_OPTIONS_ENUMS.VIEWS, label: 'По популярности' },
]

export enum SORT_ORDER_OPTIONS_ENUMS {
    DESC = 'desc',
    ASC = 'asc',
}

export const SORT_ORDER_OPTIONS_ARRAY = [
    { value: SORT_ORDER_OPTIONS_ENUMS.DESC, label: 'По убыванию' },
    { value: SORT_ORDER_OPTIONS_ENUMS.ASC, label: 'По возрастанию' },
]

export const ITEMS_PER_PAGE = 20
