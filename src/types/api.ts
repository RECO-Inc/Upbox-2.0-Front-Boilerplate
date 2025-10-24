// 서버 응답의 공통 형태
export default interface ApiResponse<T> {
  errorMessage: string;
  content: T;
}

// Pageable 인터페이스
export interface Pageable {
  size: number;   // 한 페이지당 개수
  page: number; // 0-based 페이지 번호
  [k: string]: any;
}

// 페이지네이션 응답
export interface Page<T> {
  number: number;
  first: boolean;
  last: boolean;
  pageable: Pageable;
  sort: any;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}

// 프론트에서 관리하는 에러 타입
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
