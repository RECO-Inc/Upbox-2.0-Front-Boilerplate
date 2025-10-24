import type { Authority } from "@/types/enums/Authority";

/**
 * JWT 페이로드
 */
export interface JwtPayload {
  uuid: string;
  iss: string;
  sub: string;
  auth: Authority;
  exp: number;
}
