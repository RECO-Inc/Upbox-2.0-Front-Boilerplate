export interface EnumDictionary<T> {
    [key: string]: {
        code: string
        key: string
        locale: string
        value: T
    }
}

export interface EnumEntry {
    label: string
    value: string
}

export function enumDTO2Dictionary(dtoList: any[]): EnumDictionary<string> {
    const dictionary: EnumDictionary<string> = {}
    if (!dtoList) return dictionary

    dtoList.forEach((item) => {
        // API 응답: { value: '0', name: 'NONE', description: '알수 없음' }
        // 변환: { code, key, locale, value }
        const code = item.value || item.code
        const key = item.name || item.key
        const locale = item.description || item.locale

        dictionary[code] = {
            code: code,
            key: key,
            locale: locale,
            value: code
        }
    })
    return dictionary
}

export function enumDictionaryToEntry(
    dic: EnumDictionary<string>,
    isSort: boolean = true,
    isAll: boolean = false
): EnumEntry[] {
    const entries: EnumEntry[] = []
    if (isAll) {
        entries.push({ label: '전체', value: '' })
    }

    if (!dic) return entries

    Object.values(dic).forEach((item) => {
        entries.push({
            label: item.locale,
            value: item.code
        })
    })

    if (isSort) {
        entries.sort((a, b) => a.label.localeCompare(b.label))
    }

    return entries
}
