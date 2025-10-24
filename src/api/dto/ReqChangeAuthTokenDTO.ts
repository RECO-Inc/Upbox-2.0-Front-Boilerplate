import type { Authority } from "@/types/enums/Authority";

/**
 * 권한 변경 요청 DTO
 */
export interface ReqChangeAuthTokenDTO {
  authority: Authority;
  accessToken: string;
  refreshToken: string;
  uuid: string;
}
