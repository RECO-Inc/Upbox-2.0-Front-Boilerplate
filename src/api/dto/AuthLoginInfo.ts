/**
 * 인증 로그인 정보 (로그인 유지용)
 */
export interface AuthLoginInfo {
  userId: string;
  password: string; // 해시된 비밀번호
}
