export const formatSnils = (snils?: string): string => {
    if (!snils) return '—'
    const cleaned = snils.replaceAll(/\D/g, '')
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
    }

    return snils
}
