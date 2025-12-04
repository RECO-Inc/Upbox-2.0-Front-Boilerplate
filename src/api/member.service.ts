import { api } from './request';
import type { MemberDTO } from '@/api/dto/MemberDTO';
import type { MemberRole } from '@/types/enums/MemberRole';

/**
 * 내 계정 정보 수정 요청 DTO
 */
export interface ReqModifyMyInfoDTO {
  id: number;           // 필수
  uuid: string;         // 필수
  userId: string;       // 필수
  memberRole: MemberRole; // 필수
  name?: string;
  phoneNumber?: string;
  email?: string;
  memo?: string;
  fileId?: number;
}

export const MemberService = {
  /**
   * 내 계정 정보 조회
   * @get /member/me
   */
  async getMyInfo(): Promise<MemberDTO> {
    const response = await api.get<MemberDTO>('member/me');
    return response.data.content;
  },

  /**
   * 내 계정 정보 수정
   * - 등록업장은 수정할 수 없다.
   * @put /member/me
   */
  async updateMyInfo(data: ReqModifyMyInfoDTO): Promise<MemberDTO> {
    const response = await api.put<MemberDTO>('member/me', data);
    return response.data.content;
  },
};
