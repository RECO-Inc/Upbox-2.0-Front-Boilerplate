# Upbox 2.0 보일러플레이트
Vue 3 + TypeScript 기반.
JWT 인증, 다국어 지원, 모던 UI 컴포넌트를 갖춘 프로덕션 레디 Vue 3 보일러플레이트

## 주요 기능

### 핵심 스택
- ⚡️ **Vite** - 빠른 빌드 도구 및 개발 서버
- 🎨 **Vue 3** - Composition API를 사용한 프로그레시브 자바스크립트 프레임워크
- 📘 **TypeScript** - 타입 안정성과 향상된 개발자 경험
- 🎯 **Pinia** - 경량 상태 관리
- 🛣️ **Vue Router** - 공식 라우팅 솔루션

### UI 및 스타일링
- 🎭 **Tailwind CSS v3** - 유틸리티 우선 CSS 프레임워크
- 🧩 **shadcn-vue** - Radix Vue 기반의 고품질 접근성 컴포넌트
- 🌈 **CSS Variables** - 동적 테마 지원 (라이트/다크 모드 준비)
- 📱 **반응형 디자인** - 모바일 우선 접근 방식

### 인증 및 보안
- 🔐 **JWT 인증** - Access & Refresh 토큰 관리
- 🔄 **자동 토큰 갱신** - 프로미스 캐싱을 통한 원활한 토큰 갱신
- 🛡️ **라우트 가드** - 인증 검사가 있는 보호된 라우트
- 👮 **권한 기반 접근 제어** - 역할 기반 권한 시스템
- 💾 **LocalStorage 지속성** - 'AuthKey'를 사용한 안전한 토큰 저장

### API 관리
- 🌐 **Axios HTTP 클라이언트** - 프로미스 기반 요청
- 🔌 **요청/응답 인터셉터** - 자동 토큰 주입 및 에러 처리
- 🎯 **중앙화된 API 서비스** - 깔끔한 서비스 레이어 아키텍처
- 🔄 **401 자동 재시도** - 인증 에러 시 자동 토큰 갱신
- 📊 **개발 로깅** - 요청/응답 타이밍 및 디버깅

### 다국어 지원
- 🌍 **vue-i18n** - 다국어 지원 (한국어/영어)
- 🗂️ **로케일 지속성** - localStorage에 언어 설정 저장
- 🔄 **동적 언어 전환** - 런타임 로케일 변경

### 개발자 경험
- 📦 **pnpm** - 빠르고 디스크 공간 효율적인 패키지 매니저
- 🎨 **컴포넌트 라이브러리** - 사전 제작된 UI 컴포넌트 (Button, Input, Toast, Loading)
- 🎯 **경로 별칭** - `@/` 접두사로 깔끔한 import
- 🔥 **Hot Module Replacement** - 개발 중 빠른 새로고침
- 📝 **타입 안전성** - 전체 TypeScript 커버리지

## 프로젝트 구조

```
LinkBoilerplate/
├── src/
│   ├── api/                    # API 서비스 및 요청 핸들러
│   │   ├── auth.service.ts    # 인증 엔드포인트
│   │   └── request.ts         # Axios 설정 및 인터셉터
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── ui/               # UI 컴포넌트 (Button, Input)
│   │   ├── Toast.vue         # 알림 컴포넌트
│   │   └── Loading.vue       # 전역 로딩 인디케이터
│   ├── locales/              # i18n 번역
│   │   ├── ko/              # 한국어 번역
│   │   └── en/              # 영어 번역
│   ├── plugins/              # Vue 플러그인
│   │   └── i18n.ts          # i18n 설정
│   ├── router/               # Vue Router
│   │   └── index.ts         # 라우트 및 네비게이션 가드
│   ├── stores/               # Pinia 스토어
│   │   ├── user.ts          # 사용자 인증 스토어
│   │   ├── notification.ts  # Toast 알림 스토어
│   │   └── loading.ts       # 로딩 상태 스토어
│   ├── types/                # TypeScript 정의
│   │   ├── auth.ts          # 인증 타입
│   │   └── api.ts           # API 응답 타입
│   ├── views/                # 페이지 컴포넌트
│   │   ├── auth/            # 인증 페이지
│   │   ├── dashboard/       # 대시보드 및 프로필 페이지
│   │   └── NotFoundView.vue # 404 페이지
│   ├── lib/                  # 유틸리티 함수
│   │   └── utils.ts         # shadcn-vue 유틸리티
│   ├── App.vue              # 루트 컴포넌트
│   ├── main.ts              # 애플리케이션 진입점
│   └── style.css            # shadcn-vue 변수가 있는 전역 스타일
├── .env.example             # 환경 변수 템플릿
├── package.json             # 의존성 및 스크립트
├── tsconfig.json            # TypeScript 설정
├── tailwind.config.js       # Tailwind CSS 설정
└── vite.config.ts           # Vite 설정
```

## 시작하기

### 사전 요구사항

- Node.js 18+ (LTS 권장)
- pnpm 8+

pnpm 설치:
```bash
npm install -g pnpm
```

### 설치

1. 보일러플레이트 복제 또는 복사:
```bash
cd LinkBoilerplate
```

2. 의존성 설치:
```bash
pnpm install
```

3. 환경 변수 설정:
```bash
cp .env.example .env
```

`.env` 파일을 편집하고 API 엔드포인트 설정:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
NODE_ENV=development
```

4. 개발 서버 시작:
```bash
pnpm dev
```

앱은 `http://localhost:5173`에서 실행됩니다.

### 프로덕션 빌드

```bash
pnpm build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

### 프로덕션 빌드 미리보기

```bash
pnpm preview
```

## 설정

### API 엔드포인트

`.env`에서 API 기본 URL 설정:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

API 요청 핸들러는 `src/api/request.ts`에 있으며 자동으로:
- 요청에 Bearer 토큰 추가
- 토큰 검증 및 갱신
- 사용자 알림으로 에러 처리
- 개발 모드에서 요청 로깅

### 인증 흐름

인증 시스템은 다음 흐름으로 JWT 토큰을 사용합니다:

1. **로그인**: 사용자 자격증명 → API → Access & Refresh 토큰
2. **저장**: 토큰을 'AuthKey' 키로 localStorage에 저장
3. **검증**: 모든 보호된 라우트는 토큰 유효성 검사
4. **갱신**: 만료된 액세스 토큰은 리프레시 토큰을 사용하여 자동 갱신
5. **로그아웃**: 스토어 및 localStorage에서 토큰 제거

#### 토큰 관리

`src/stores/user.ts`에 위치:

```typescript
// 인증 상태 확인
userStore.isAuthenticated

// 토큰 검증 (필요시 자동 갱신)
await userStore.validateToken()

// 수동 갱신
await userStore.refreshAccessToken()

// 로그아웃
userStore.logout()
```

#### 라우트 보호

`src/router/index.ts`에서 보호된 라우트 정의:

```typescript
{
  path: '/admin',
  component: AdminView,
  meta: {
    requiresAuth: true,
    authorities: [Authority.PLATFORM_ADMIN]
  }
}
```

### 다국어 지원

프로그래밍 방식으로 언어 변경:

```typescript
import { useI18n } from 'vue-i18n'
import { saveLocale } from '@/plugins/i18n'

const { locale } = useI18n()

// 한국어로 전환
locale.value = 'ko'
saveLocale('ko')

// 영어로 전환
locale.value = 'en'
saveLocale('en')
```

`src/locales/[lang]/index.ts`에 새 번역 추가

### shadcn-vue 컴포넌트 추가

이 보일러플레이트는 shadcn-vue가 사전 구성되어 있습니다. 새 컴포넌트 추가:

```bash
pnpm dlx shadcn-vue@latest add [component-name]
```

예시:
```bash
pnpm dlx shadcn-vue@latest add dialog
pnpm dlx shadcn-vue@latest add dropdown-menu
```

## API 서비스

### 새 서비스 생성

`src/api/`에 서비스 파일 생성:

```typescript
// src/api/user.service.ts
import { api } from './request'
import type { User } from '@/types/auth'

export const UserService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('users')
    return response.data.content
  },

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`users/${id}`, data)
    return response.data.content
  }
}
```

### 요청 옵션

`request` 함수는 다음을 허용합니다:

```typescript
request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string | { str: string; vars: any },
  data?: any,
  otherOptions?: AxiosRequestConfig,
  needValidateToken = true
): Promise<AxiosResponse<ApiResponse<T>>>
```

경로 변수 사용 예시:

```typescript
await api.get('users/{id}/posts', null, {}, {
  str: 'users/{id}/posts',
  vars: { id: 123 }
})
```

## 상태 관리

### User Store

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 사용자 데이터 접근
userStore.user
userStore.userName
userStore.userId
userStore.isAuthenticated

// 권한 확인
userStore.hasAuthority(Authority.PLATFORM_ADMIN)
userStore.hasAnyAuthority([Authority.PARTNER, Authority.CUSTOMER])
```

### Notification Store

```typescript
import { useNotificationStore } from '@/stores/notification'

const notiStore = useNotificationStore()

// 알림 표시
notiStore.success('작업이 성공했습니다')
notiStore.error('오류가 발생했습니다')
notiStore.warning('주의해 주세요')
notiStore.info('알고 계셨나요?')

// 사용자 정의 지속 시간
notiStore.success('빠른 메시지', 2000)
```

### Loading Store

```typescript
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()

// 작업 ID로 로딩 시작
loadingStore.startLoading('fetch-data')

// 특정 작업에 대한 로딩 중지
loadingStore.stopLoading('fetch-data')

// 로딩 상태 확인
loadingStore.isLoading
```

## TypeScript 타입

### 사용자 정의 타입 추가

`src/types/`에 타입 정의:

```typescript
// src/types/product.ts
export interface Product {
  id: number
  name: string
  price: number
  category: string
}

export interface ProductFilter {
  category?: string
  minPrice?: number
  maxPrice?: number
}
```

### 라우트 메타 타입

`src/router/index.ts`에서 라우트 메타 타입 확장:

```typescript
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    authorities?: Authority[]
    title?: string
  }
}
```

## 커스터마이징

### 테마 색상

`src/style.css`에서 테마 색상 수정:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-80: 210 40% 98%;
  /* 사용자 정의 색상 추가 */
}
```

### Tailwind 설정

`tailwind.config.js`에서 Tailwind 확장:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        'brand': '#your-color',
      },
      fontFamily: {
        sans: ['Your Font', 'sans-serif'],
      }
    }
  }
}
```

## 사용 가능한 스크립트

```bash
# 개발
pnpm dev          # 개발 서버 시작
pnpm build        # 프로덕션 빌드
pnpm preview      # 프로덕션 빌드 미리보기

# 코드 품질
pnpm type-check   # TypeScript 컴파일러 체크 실행
pnpm lint         # ESLint 실행 (설정된 경우)
```

## 환경 변수

| 변수 | 설명 | 기본값 |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | 백엔드 API 기본 URL | `/api` |
| `VITE_API_TIMEOUT` | 요청 타임아웃 (ms) | `30000` |
| `NODE_ENV` | 환경 모드 | `development` |

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 주요 기능 세부사항

### JWT 토큰 아키텍처

- **Access Token**: 단기 토큰 (Authorization 헤더로 전송)
- **Refresh Token**: 장기 토큰 (새 액세스 토큰을 얻는 데 사용)
- **토큰 디코딩**: 만료를 확인하기 위한 클라이언트 측 JWT 파싱
- **자동 갱신**: 만료 30초 전에 토큰 갱신
- **프로미스 캐싱**: 여러 동시 갱신 호출 방지

### 라우터 가드 흐름

1. 라우트가 인증을 요구하는지 확인
2. 인증되지 않은 경우 로그인으로 리디렉션
3. 필요시 토큰 검증 및 갱신
4. 사용자 정보가 로드되지 않은 경우 가져오기
5. 권한 기반 접근 확인
6. 라우트로 진행 또는 리디렉션

### 에러 처리

- **네트워크 에러**: Toast 알림을 통한 사용자 친화적 메시지
- **API 에러**: 사용자에게 서버 에러 메시지 표시
- **인증 에러**: 자동 로그아웃 및 로그인으로 리디렉션
- **403 에러**: 무단 접근 알림

## 보안 고려사항

1. **토큰 저장**: 토큰은 localStorage에 저장됨 (프로덕션에서는 httpOnly 쿠키 고려)
2. **XSS 방지**: 사용자 입력 정제
3. **HTTPS**: 프로덕션에서 항상 HTTPS 사용
4. **CORS**: 백엔드에서 CORS 설정
5. **토큰 만료**: 액세스 토큰은 빠르게 만료되고, 리프레시 토큰은 더 긴 수명

## 문제 해결

### 포트가 이미 사용 중

`vite.config.ts`에서 포트 변경:

```typescript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### API 연결 문제

1. `.env`의 `VITE_API_BASE_URL` 확인
2. 백엔드 CORS 설정 확인
3. 브라우저 DevTools의 네트워크 탭 확인
4. 자세한 에러 메시지는 콘솔 로그 검토

### 인증 루프

1. localStorage 클리어: `localStorage.clear()`
2. 토큰 만료 시간 확인
3. 리프레시 토큰 엔드포인트가 작동하는지 확인
4. 토큰 검증 에러에 대한 브라우저 콘솔 확인
