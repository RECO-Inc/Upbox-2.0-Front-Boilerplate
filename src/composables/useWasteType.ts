import { useEnumsStore, EnumKey } from '@/stores/enums'
import { useUserStore } from '@/stores/user'
import EnumService from '@/api/enum.service'
import { enumDTO2Dictionary } from '@/utils/enum'
import _isEmpty from 'lodash/isEmpty'

export function useWasteType() {
    const enumsStore = useEnumsStore()
    const userStore = useUserStore()

    /**
     * # 폐기물 종류 목록 조회
     * - 로그인 된 상태에서만 동작
     * - 이미 불러온 경우 스킵
     */
    async function fetchWasteTypeEnums() {
        // 로그인 상태가 아니면 스킵
        if (!userStore.token) {
            return
        }

        if (enumsStore.promiseLock[EnumKey.WASTETYPE]) {
            return enumsStore.promiseLock[EnumKey.WASTETYPE]
        }

        // Promise Lock 설정
        enumsStore.setPromiseLock(
            EnumKey.WASTETYPE,
            new Promise<void>(async (resolve, reject) => {
                try {
                    const promiseList: Promise<any>[] = []

                    // 폐기물 대분류
                    if (_isEmpty(enumsStore.getEnumsDic('wasteTypeGroup'))) {
                        promiseList.push(
                            EnumService.getWasteTypeGroup().then((res: any) => {
                                const content = res.data.content as any[]
                                const dic = enumDTO2Dictionary(content)
                                for (const key in dic) {
                                    if (dic[key]) {
                                        dic[key].locale = `(${dic[key].code})${dic[key].locale}`
                                    }
                                }
                                enumsStore.setEnumsDic('wasteTypeGroup', dic)
                            })
                        )
                    }

                    // 폐기물 중분류
                    if (_isEmpty(enumsStore.getEnumsDic('wasteType'))) {
                        promiseList.push(
                            EnumService.getWasteType().then((res: any) => {
                                const content = res.data.content as any[]
                                const dic = enumDTO2Dictionary(content)
                                for (const key in dic) {
                                    if (dic[key]) {
                                        dic[key].locale = `(${dic[key].code})${dic[key].locale}`
                                    }
                                }
                                enumsStore.setEnumsDic('wasteType', dic)
                            })
                        )
                    }

                    // 폐기물 소분류
                    if (_isEmpty(enumsStore.getEnumsDic('wasteTypeDetail'))) {
                        promiseList.push(
                            EnumService.getWasteTypeDetail().then((res: any) => {
                                const content = res.data.content as any[]
                                const dic = enumDTO2Dictionary(content)
                                for (const key in dic) {
                                    if (dic[key]) {
                                        dic[key].locale = `(${dic[key].code})${dic[key].locale}`
                                    }
                                }
                                enumsStore.setEnumsDic('wasteTypeDetail', dic)
                            })
                        )
                    }

                    await Promise.all(promiseList)
                    resolve()
                } catch (error: any) {
                    console.error('Failed to fetch waste type enums', error)
                    reject(error)
                }
            })
        )

        try {
            await enumsStore.promiseLock[EnumKey.WASTETYPE]
        } finally {
            // Lock 해제
            enumsStore.setPromiseLock(EnumKey.WASTETYPE, undefined)
        }
    }

    return {
        fetchWasteTypeEnums
    }
}
