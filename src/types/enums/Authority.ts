// 권한
export enum Authority {
  ROLE_MONITOR = "ROLE_MONITOR",
  ROLE_PLATFORM_A = "ROLE_PLATFORM_A",
  ROLE_COLLECTING_P = "ROLE_COLLECTING_P",
  ROLE_COLLECTING_M = "ROLE_COLLECTING_M",
  ROLE_COLLECTING_D = "ROLE_COLLECTING_D",
  ROLE_OPERATION_P = "ROLE_OPERATION_P",
  ROLE_OPERATION_M = "ROLE_OPERATION_M",
  ROLE_OPERATION_D = "ROLE_OPERATION_D",
  ROLE_BUSINESS_P = "ROLE_BUSINESS_P",
  ROLE_BUSINESS_M = "ROLE_BUSINESS_M",
  ROLE_BUSINESS_D = "ROLE_BUSINESS_D",
  ROLE_DISPOSAL_P = "ROLE_DISPOSAL_P",
  ROLE_DISPOSAL_M = "ROLE_DISPOSAL_M",
  ROLE_DISPOSAL_D = "ROLE_DISPOSAL_D",
  ROLE_CUSTOMER = "ROLE_CUSTOMER",
}

export type AuthorityKey = keyof typeof Authority;

// 권한 정보 인터페이스
export interface AuthorityInfo {
  authority: Authority;
  authorityName: string;
  companyId?: number;
  companyUuid?: string;
  companyName?: string;
}

// 권한 사전 (선택적으로 사용)
export interface AuthorityDictionary {
  code: number;
  locale: string;
  key: string;
}

export const AuthorityDic: Record<AuthorityKey, AuthorityDictionary> = {
  ROLE_MONITOR: { code: 0, locale: "모니터링", key: "ROLE_MONITOR" },
  ROLE_PLATFORM_A: { code: 10, locale: "플랫폼", key: "ROLE_PLATFORM_A" },
  ROLE_COLLECTING_P: { code: 20, locale: "수집운반 파트너", key: "ROLE_COLLECTING_P" },
  ROLE_COLLECTING_M: { code: 21, locale: "수집운반 매니저", key: "ROLE_COLLECTING_M" },
  ROLE_COLLECTING_D: { code: 22, locale: "수집운반 기사", key: "ROLE_COLLECTING_D" },
  ROLE_OPERATION_P: { code: 30, locale: "운영 파트너", key: "ROLE_OPERATION_P" },
  ROLE_OPERATION_M: { code: 31, locale: "운영 매니저", key: "ROLE_OPERATION_M" },
  ROLE_OPERATION_D: { code: 32, locale: "운영 기사", key: "ROLE_OPERATION_D" },
  ROLE_BUSINESS_P: { code: 40, locale: "영업 파트너", key: "ROLE_BUSINESS_P" },
  ROLE_BUSINESS_M: { code: 41, locale: "영업 매니저", key: "ROLE_BUSINESS_M" },
  ROLE_BUSINESS_D: { code: 42, locale: "영업 기사", key: "ROLE_BUSINESS_D" },
  ROLE_DISPOSAL_P: { code: 50, locale: "처리 파트너", key: "ROLE_DISPOSAL_P" },
  ROLE_DISPOSAL_M: { code: 51, locale: "처리 매니저", key: "ROLE_DISPOSAL_M" },
  ROLE_DISPOSAL_D: { code: 52, locale: "처리 기사", key: "ROLE_DISPOSAL_D" },
  ROLE_CUSTOMER: { code: 60, locale: "고객", key: "ROLE_CUSTOMER" },
};
