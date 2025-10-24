import type { MemberDTO } from "@/api/dto/MemberDTO";

/**
 * 로그인 응답 DTO
 */
export interface AuthResponse {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  user?: MemberDTO;  // 로그인 시 유저 정보도 함께 응답
}
