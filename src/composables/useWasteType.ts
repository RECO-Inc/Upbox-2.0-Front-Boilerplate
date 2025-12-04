import { computed, ref, type Ref } from 'vue'
import { useEnumsStore, EnumKey } from '@/stores/enums'
import { useUserStore } from '@/stores/user'
import EnumService from '@/api/enum.service'
import { enumDTO2Dictionary, enumDictionaryToEntry, type EnumDictionary } from '@/utils/enum'
import _isEmpty from 'lodash/isEmpty'

interface IParamOptions {
    wasteTypeGroupRef?: Ref<string> // 필터를 위한 폐기물 종류1
    wasteTypeRef?: Ref<string> // 필터를 위한 폐기물 종류2
}

export function useWasteType(options?: IParamOptions) {
    const enumsStore = useEnumsStore()
    const userStore = useUserStore()

    const wasteTypeGroupDic = ref<EnumDictionary<string>>(enumsStore.getEnumsDic('wasteTypeGroup')) // 대
    const wasteTypeDic = ref<EnumDictionary<string>>(enumsStore.getEnumsDic('wasteType')) // 중
    const wasteTypeDetailDic = ref<EnumDictionary<string>>(enumsStore.getEnumsDic('wasteTypeDetail')) // 소

    const wasteTypeGroupOptions = computed(() => {
        // 폐기물 종류 분류 - store에서 직접 읽어서 반응성 유지
        const dic = enumsStore.enumsDic['wasteTypeGroup'] || {}
        console.log('[wasteTypeGroupOptions] dic:', dic)
        return enumDictionaryToEntry(dic, true, false)
    })

    // 폐기물 소분류 전체 옵션 리스트 - store에서 직접 읽어서 반응성 유지
    const wasteTypeDetailOptions = computed(() => {
        const dic = enumsStore.enumsDic['wasteTypeDetail'] || {}
        console.log('[wasteTypeDetailOptions] dic:', dic)
        return enumDictionaryToEntry(dic, true, false)
    })

    // wasteTypeGroup 선택에 따른 wasteType 옵션 리스트
    const wasteTypeOptions = computed(() => {
        // 폐기물 종류
        const groupValue = options?.wasteTypeGroupRef?.value || ''
        const filteredDic = Object.keys(wasteTypeDic.value).reduce((acc: any, cur: string) => {
            const item = wasteTypeDic.value[cur]
            if (item && item.key && item.key.startsWith(groupValue)) {
                acc[cur] = item
            }
            return acc
        }, {})
        return enumDictionaryToEntry(filteredDic, true, false)
    })

    // wasteType 선택에 따른 wasteTypeDetail 옵션 리스트
    const filteredWasteTypeDetailOptions = computed(() => {
        const typeValue = options?.wasteTypeRef?.value || ''
        const filteredDic = Object.keys(wasteTypeDetailDic.value).reduce((acc: any, cur: string) => {
            const item = wasteTypeDetailDic.value[cur]
            if (item && item.key && item.key.startsWith(typeValue)) {
                acc[cur] = item
            }
            return acc
        }, {})
        return enumDictionaryToEntry(filteredDic, true, false)
    })

    /**
     * [GET] 폐기물 종류 대분류 조회
     */
    async function fetchWasteTypeGroup() {
        try {
            const res = await EnumService.getWasteTypeGroup()
            const content = (Array.isArray(res.data) ? res.data : res.data.content) as unknown as any[]
            wasteTypeGroupDic.value = enumDTO2Dictionary(content)
            // 코드를 앞에 붙임
            for (const key in wasteTypeGroupDic.value) {
                if (wasteTypeGroupDic.value[key]) {
                    wasteTypeGroupDic.value[key].locale = `(${wasteTypeGroupDic.value[key].code})${wasteTypeGroupDic.value[key].locale}`
                }
            }
            enumsStore.setEnumsDic('wasteTypeGroup', wasteTypeGroupDic.value)
        } catch (error: any) {
            console.error('폐기물 종류 대분류 조회에 실패했습니다.', error)
            throw error
        }
    }

    /**
     * [GET] 폐기물 종류 소분류 조회
     */
    async function fetchWasteType() {
        try {
            const res = await EnumService.getWasteType()
            const content = (Array.isArray(res.data) ? res.data : res.data.content) as unknown as any[]
            wasteTypeDic.value = enumDTO2Dictionary(content)
            for (const key in wasteTypeDic.value) {
                if (wasteTypeDic.value[key]) {
                    wasteTypeDic.value[key].locale = `(${wasteTypeDic.value[key].code})${wasteTypeDic.value[key].locale}`
                }
            }
            enumsStore.setEnumsDic('wasteType', wasteTypeDic.value)
        } catch (error: any) {
            console.error('폐기물 종류 소분류 조회에 실패했습니다.', error)
            throw error
        }
    }

    /**
     * [GET] 폐기물 종류 조회
     */
    async function fetchWasteTypeDetail() {
        try {
            const res = await EnumService.getWasteTypeDetail()
            const content = (Array.isArray(res.data) ? res.data : res.data.content) as unknown as any[]
            wasteTypeDetailDic.value = enumDTO2Dictionary(content)
            for (const key in wasteTypeDetailDic.value) {
                if (wasteTypeDetailDic.value[key]) {
                    wasteTypeDetailDic.value[key].locale = `(${wasteTypeDetailDic.value[key].code})${wasteTypeDetailDic.value[key].locale}`
                }
            }
            enumsStore.setEnumsDic('wasteTypeDetail', wasteTypeDetailDic.value)
        } catch (error: any) {
            console.error('폐기물 종류 조회에 실패했습니다.', error)
            throw error
        }
    }

    async function getAllWasteTypeEnum(): Promise<any> {
        // 로그인 상태가 아니면 스킵
        if (!userStore.token) {
            return
        }

        if (enumsStore.promiseLock[EnumKey.WASTETYPE]) {
            // 가져오고 있는 중이면 promise 를 반환한다.
            return enumsStore.promiseLock[EnumKey.WASTETYPE]
        } else {
            // 동시에 접근할 경우 한번만 발생
            enumsStore.setPromiseLock(
                EnumKey.WASTETYPE,
                new Promise<void>((resolve, reject) => {
                    const promiseList: Promise<any>[] = []
                    // 폐기물 대분류 비어 있음
                    if (_isEmpty(wasteTypeGroupDic.value)) {
                        if (Object.keys(enumsStore.getEnumsDic('wasteTypeGroup')).length > 0) {
                            wasteTypeGroupDic.value = enumsStore.getEnumsDic('wasteTypeGroup')
                        } else {
                            promiseList.push(fetchWasteTypeGroup())
                        }
                    }
                    // 폐기물 중분류 비어 있음
                    if (_isEmpty(wasteTypeDic.value)) {
                        if (Object.keys(enumsStore.getEnumsDic('wasteType')).length > 0) {
                            wasteTypeDic.value = enumsStore.getEnumsDic('wasteType')
                        } else {
                            promiseList.push(fetchWasteType())
                        }
                    }
                    // 폐기물 소분류 비어 있음
                    if (_isEmpty(wasteTypeDetailDic.value)) {
                        if (Object.keys(enumsStore.getEnumsDic('wasteTypeDetail')).length > 0) {
                            wasteTypeDetailDic.value = enumsStore.getEnumsDic('wasteTypeDetail')
                        } else {
                            promiseList.push(fetchWasteTypeDetail())
                        }
                    }
                    // 완료되면 enumsStore.promiseLock = null
                    Promise.all(promiseList)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => reject(err))
                })
            )
            return enumsStore.promiseLock[EnumKey.WASTETYPE]!.then(() => {
                enumsStore.setPromiseLock(EnumKey.WASTETYPE, undefined)
            })
        }
    }

    async function initWasteTypeEnums() {
        return getAllWasteTypeEnum().then(() => {
            // 호출하는 컴포넌트마다 실행될 로직
            if (_isEmpty(wasteTypeGroupDic.value)) {
                if (Object.keys(enumsStore.getEnumsDic('wasteTypeGroup')).length > 0) {
                    wasteTypeGroupDic.value = enumsStore.getEnumsDic('wasteTypeGroup')
                }
            }
            if (_isEmpty(wasteTypeDic.value)) {
                if (Object.keys(enumsStore.getEnumsDic('wasteType')).length > 0) {
                    wasteTypeDic.value = enumsStore.getEnumsDic('wasteType')
                }
            }
            if (_isEmpty(wasteTypeDetailDic.value)) {
                if (Object.keys(enumsStore.getEnumsDic('wasteTypeDetail')).length > 0) {
                    wasteTypeDetailDic.value = enumsStore.getEnumsDic('wasteTypeDetail')
                }
            }
        })
    }

    return {
        wasteTypeGroupDic,
        wasteTypeDic,
        wasteTypeDetailDic,

        wasteTypeGroupOptions,
        wasteTypeDetailOptions,
        wasteTypeOptions,
        filteredWasteTypeDetailOptions,
        initWasteTypeEnums
    }
}
