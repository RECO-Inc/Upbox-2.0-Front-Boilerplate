/**
 * 리프레시 토큰 응답 DTO
 */
export interface RespRefreshTokenDTO {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}
