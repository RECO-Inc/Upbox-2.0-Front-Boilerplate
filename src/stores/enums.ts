import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EnumDictionary } from '@/utils/enum'

export enum EnumKey {
    WASTETYPE = 'WASTETYPE',
    DISPOSALMETHOD = 'DISPOSALMETHOD'
}

export const useEnumsStore = defineStore('enums', () => {
    const enumsDic = ref<Record<string, EnumDictionary<string>>>({})
    const promiseLock = ref<Record<string, Promise<any> | undefined>>({})

    function getEnumsDic(key: string): EnumDictionary<string> {
        return enumsDic.value[key] || {}
    }

    function setEnumsDic(key: string, dic: EnumDictionary<string>) {
        enumsDic.value = { ...enumsDic.value, [key]: dic }
    }

    function getPromiseLock(key: string): Promise<any> | undefined {
        return promiseLock.value[key]
    }

    function setPromiseLock(key: string, promise: Promise<any> | undefined) {
        promiseLock.value[key] = promise
    }

    return {
        enumsDic,
        getEnumsDic,
        setEnumsDic,
        promiseLock,
        getPromiseLock,
        setPromiseLock
    }
})
