import { Authority } from "@/types/enums/Authority";
import type { LocalDateTime } from "@/api/dto/LocalDate";
import { MemberStatus } from "@/types/enums/MemberStatus";
import { MemberRole } from "@/types/enums/MemberRole";
import type { FileDTO } from "@/api/dto/FileDTO";
import type { CompanyDTO } from "@/api/dto/CompanyDTO";
import type { DriverInfoDTO } from "@/api/dto/DriverInfoDTO";

/**
 * 계정 정보
 * @DTO MemberVO
 */
export interface MemberDTO {
  id: number;
  userId: string;
  password: string;
  memberStatus: MemberStatus; // 상태
  uuid: string;
  memberRole: MemberRole;     // 계정 역할
  authorityList: Authority[]; // 권한 리스트
  authorityMap: Record<Authority, CompanyDTO[]>; // 권한별 업장 맵
  fileDTO?: FileDTO;    // 이미지 정보
  name: string;
  phoneNumber: string;
  email: string;
  memo: string;
  driverInfoVO?: DriverInfoDTO;  // 기사 정보
  lastLogLogin: LocalDateTime;     // 최종 로그인 시간
  passwordUpdatedAt?: LocalDateTime;    // 비밀번호 변경 시간
  createdAt?: LocalDateTime;
  updatedAt?: LocalDateTime;
  companyCount: number;     // 연동된 업장 목록
  hasTermsOfServiceToNeedToAgree: boolean;     // 동의 필요 약관 존재 여부
}
