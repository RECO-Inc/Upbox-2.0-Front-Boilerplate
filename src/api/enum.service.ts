import { api } from '@/api/request'
import type ApiResponse from '@/types/api'

export default {
    /**
     * 폐기물 종류 대분류 조회
     */
    getWasteTypeGroup() {
        return api.get<ApiResponse<any>>('enums/waste-type-group')
    },
    /**
     * 폐기물 종류 중분류 조회
     */
    getWasteType() {
        return api.get<ApiResponse<any>>('enums/waste-type')
    },
    /**
     * 폐기물 종류 소분류 조회
     */
    getWasteTypeDetail() {
        return api.get<ApiResponse<any>>('enums/waste-type-detail')
    }
}
