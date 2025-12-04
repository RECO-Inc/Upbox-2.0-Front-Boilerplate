import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { EnumDictionary } from '@/utils/enum'

export enum EnumKey {
    WASTETYPE = 'WASTETYPE',
    DISPOSALMETHOD = 'DISPOSALMETHOD'
}

interface EnumsState {
    getEnumsDic: (key: string) => EnumDictionary<string>
    setEnumsDic: (key: string, value: EnumDictionary<string>) => void
    promiseLock: Record<string, Promise<any> | undefined>
    getPromiseLock: (key: string) => Promise<any> | undefined
    setPromiseLock: (key: string, promise: Promise<any> | undefined) => void
}

export const useEnumsStore = defineStore('enums', () => {
    const enumsDic = reactive<Map<string, EnumDictionary<string>>>(new Map())
    const promiseLock = ref<Record<string, Promise<any> | undefined>>({})

    function getEnumsDic(key: string): EnumDictionary<string> {
        return enumsDic.get(key) || {}
    }

    function setEnumsDic(key: string, dic: EnumDictionary<string>) {
        enumsDic.set(key, dic)
    }

    function getPromiseLock(key: string): Promise<any> | undefined {
        return promiseLock.value[key]
    }

    function setPromiseLock(key: string, promise: Promise<any> | undefined) {
        promiseLock.value[key] = promise
    }

    return {
        getEnumsDic,
        setEnumsDic,
        promiseLock,
        getPromiseLock,
        setPromiseLock
    }
})
