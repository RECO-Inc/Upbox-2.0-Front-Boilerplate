import { api } from './request';
import type { LoginCredentials } from '@/api/dto/LoginCredentials';
import type { AuthResponse } from '@/api/dto/AuthResponse';
import type { ReqChangeAuthTokenDTO } from '@/api/dto/ReqChangeAuthTokenDTO';
import type { RespRefreshTokenDTO } from '@/api/dto/RespRefreshTokenDTO';
import type { MemberDTO } from '@/api/dto/MemberDTO';

export const AuthService = {
  /**
   * 로그인
   * @post /auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('auth/login', credentials, {}, false); // 로그인은 토큰 검증 불필요
    return response.data.content;
  },

  /**
   * 로그아웃
   * @post /auth/logout
   */
  async logout(params: { deviceType: string; pushToken: string }): Promise<void> {
    await api.post('auth/logout', params);
  },

  /**
   * Refresh Token으로 Access Token 갱신
   * @post /auth/reissue
   */
  async refreshToken(accessToken: string, refreshToken: string): Promise<RespRefreshTokenDTO> {
    const response = await api.post<RespRefreshTokenDTO>(
      'auth/reissue',
      { accessToken, refreshToken },
      {},
      false, // Refresh는 토큰 검증 불필요
    );
    return response.data.content;
  },

  /**
   * 현재 사용자 정보 조회
   * @get /member/me
   */
  async getCurrentUser(): Promise<MemberDTO> {
    const response = await api.get<MemberDTO>('member/me');
    return response.data.content;
  },

  /**
   * 내 비밀번호 변경
   * @put /member/me/password/change
   */
  async changeMyPassword(userId: string, password: string): Promise<void> {
    await api.put('member/me/password/change', {
      userId,
      password,
    });
  },

  /**
   * 권한 변경 (토큰 재발급)
   * @post /auth/change-auth-token
   */
  async changeAuthToken(params: ReqChangeAuthTokenDTO): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('auth/change-auth-token', params);
    return response.data.content;
  },
};
