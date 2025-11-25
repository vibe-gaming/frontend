export const formatPhoneNumber = (phone?: string): string => {
    if (!phone) return '—'
    // Форматируем телефон в вид +7 (XXX)-XXX-XX-XX
    const cleaned = phone.replaceAll(/\D/g, '')
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
        return `+7 (${cleaned.slice(1, 4)})-${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
    }

    return phone
}
