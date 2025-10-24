import type { Authority } from './enums/Authority';

export interface User {
  id: number;
  uuid: string;
  userId: string;
  name: string;
  email?: string;
  authorityList: Authority[];
}

// 사용자 토큰
export interface UserToken {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;  // 액세스 토큰 만료 시간 (timestamp)
  refreshTokenExpiresIn: number; // 리프레시 토큰 만료 시간 (timestamp)
  isRemember: boolean;
  timestamp: number;  // 토큰 저장 시간
}
