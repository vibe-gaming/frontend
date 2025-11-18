export const BENEFIT_TYPES = [
    { value: 'federal', label: 'Федеральная' },
    { value: 'regional', label: 'Региональная' },
    { value: 'commercial', label: 'Коммерческая' },
] as const

export const TARGET_GROUPS = [
    { value: 'pensioners', label: 'Пенсионеры' },
    { value: 'disabled', label: 'Инвалиды' },
    { value: 'students', label: 'Студенты' },
    { value: 'young_families', label: 'Молодые семьи' },
    { value: 'low_income', label: 'Малоимущие' },
    { value: 'large_families', label: 'Многодетные семьи' },
    { value: 'children', label: 'Дети' },
    { value: 'veterans', label: 'Ветераны' },
] as const

export const TAGS = [
    { value: 'new', label: 'Новые' },
    { value: 'recommended', label: 'Рекомендуемые' },
    { value: 'popular', label: 'Популярные' },
] as const

export const CATEGORIES = [
    { value: 'medicine', label: 'Медицина' },
    { value: 'transport', label: 'Транспорт' },
    { value: 'food', label: 'Питание' },
    { value: 'clothing', label: 'Одежда' },
    { value: 'education', label: 'Образование' },
    { value: 'payments', label: 'Выплаты' },
    { value: 'other', label: 'Другое' },
] as const

export const SORT_OPTIONS = [
    { value: 'created_at', label: 'По дате создания' },
    { value: 'views', label: 'По популярности' },
] as const

export const SORT_ORDER_OPTIONS = [
    { value: 'desc', label: 'По убыванию' },
    { value: 'asc', label: 'По возрастанию' },
] as const

export const ITEMS_PER_PAGE = 20

