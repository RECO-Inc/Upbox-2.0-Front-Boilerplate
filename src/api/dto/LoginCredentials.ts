/**
 * 로그인 요청 DTO
 */
export interface LoginCredentials {
  userId: string;
  password: string;
  type: string;
  pushToken: string;
}
