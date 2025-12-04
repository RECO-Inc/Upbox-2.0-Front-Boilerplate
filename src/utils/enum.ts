export interface EnumDictionary<T> {
    [key: string]: {
        code: string
        key: string
        locale: string
        value: T
    }
}

export function enumDTO2Dictionary(dtoList: any[]): EnumDictionary<string> {
    const dictionary: EnumDictionary<string> = {}
    if (!dtoList) return dictionary

    dtoList.forEach((item) => {
        dictionary[item.code] = {
            code: item.code,
            key: item.key,
            locale: item.locale,
            value: item.value
        }
    })
    return dictionary
}
