import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import _isEqual from 'lodash/isEqual';
import { axiosInstance } from '@/api/request';
import type { MemberDTO } from '@/api/dto/MemberDTO';
import type { AuthLoginInfo } from '@/api/dto/AuthLoginInfo';
import type { AuthResponse } from '@/api/dto/AuthResponse';
import type { JwtPayload } from '@/api/dto/JwtPayload';
import type { RespRefreshTokenDTO } from '@/api/dto/RespRefreshTokenDTO';
import type { UserToken } from '@/types/auth';
import { Authority } from '@/types/enums/Authority';
import type { AuthorityInfo, AuthorityKey } from '@/types/enums/Authority';
import { KeyState } from '@/types/enums/KeyState';
import type ApiResponse from '@/types/api';
import { useNotificationStore } from './notification';
import { useLoadingStore } from './loading';
import { hashedPassword } from '@/utils/auth';
import { isAndroid, isiOS } from '@/utils/os';

const SAVEKEY = 'AuthKey';
const CREDENTIAL = 'Credential';
const STORAGE_KEY_SELECTED_AUTHORITY = 'selectedAuthority';

/**
 * # 유저 정보 스토어
 * # 정보 저장 단위
 * 유저 정보는 브라우저의 로컬 스토리지에 저장하기 때문에, 탭 간에 공유된다.
 * 새로운 탭에서 새로운 계정으로 로그인하면 기존 탭의 유저 정보도 변경된다.
 *
 * 스토어 변수로 토큰을 가지고 사용하지만, 다른 탭에서 토큰이 변경되는 등 브라우저에 저장된 토큰과 싱크가 맞지 않으면,
 * 각 정보간의 토큰 만료 시간을 비교해서 최근 것을 스토어에 저장하고 사용한다.
 */
export const useUserStore = defineStore('user', () => {
  const user = ref<MemberDTO>({} as MemberDTO); // 유저 정보 state
  const token = ref<UserToken | null>(null);
  const refreshTokenPromise = ref<Promise<KeyState> | null>(null); // 토큰 갱신 프로미스
  const selectedAuthority = ref<AuthorityInfo | null>(null); // 선택한 권한

  const userName = computed(() => {
    if (user.value) {
      return `${user.value.name}`;
    }
    return '';
  });

  const id = computed(() => {
    if (user.value) {
      return user.value.id;
    }
    return 0;
  });

  const uuid = computed(() => {
    if (user.value) {
      return user.value.uuid;
    }
    return '';
  });

  const userId = computed(() => {
    if (user.value) {
      return user.value.userId;
    }
    return '';
  });

  const isAuthenticated = computed(() => !!token.value?.accessToken && !!user.value?.id);

  const isPlatformAdmin = computed<boolean>(() => {
    return selectedAuthority.value?.authority === Authority.ROLE_PLATFORM_A;
  });

  function debugJWT(token: string) {
    return jwtDecode(token);
  }

  /**
   * # 선택권한정보의 업장정보를 변경
   */
  async function changeAuthorityCompany(companyId: number, companyUuid: string, companyName: string) {
    if (!selectedAuthority.value) return;
    try {
      selectedAuthority.value.companyId = companyId;
      selectedAuthority.value.companyUuid = companyUuid;
      selectedAuthority.value.companyName = companyName;
      // await changeAuthority(selectedAuthority.value);
    } catch (errMessage: any) {
      useNotificationStore().error(errMessage || '권한 변경에 실패했습니다.');
      await logout();
    }
  }

  /**
   * # 선택권한을 로드
   */
  function loadAuthority() {
    const authorityInfo = localStorage.getItem(STORAGE_KEY_SELECTED_AUTHORITY);

    // 브라우저에서 가져온 권한이 있다.
    if (authorityInfo) {
      try {
        if (_isEqual(selectedAuthority.value, JSON.parse(authorityInfo))) {
          // 같은 권한이면 리턴
          return;
        }
        selectedAuthority.value = JSON.parse(authorityInfo);
        if (
          selectedAuthority.value &&
          (selectedAuthority.value?.authority === ('ROLE_FLATFORM_A' as any) ||
            selectedAuthority.value?.authority === ('ROLE_PLATFROM_A' as any))
        ) {
          selectedAuthority.value.authority = Authority.ROLE_PLATFORM_A;
          window.localStorage.setItem(STORAGE_KEY_SELECTED_AUTHORITY, JSON.stringify(selectedAuthority.value));
        }
        return;
      } catch (e) {
        // JSON 파싱 실패
        localStorage.removeItem(STORAGE_KEY_SELECTED_AUTHORITY);
      }
    }

    // 브라우저에서 가져온 권한이 없다.
    if (user.value?.authorityList?.length) {
      const authorityMapKeyList = Object.keys(user.value.authorityMap);
      if (authorityMapKeyList.length > 0 && token.value?.accessToken) {
        const tokenInfo: JwtPayload = jwtDecode(token.value!.accessToken);
        const matchedAuthorityMap = user.value.authorityMap[tokenInfo.auth as Authority];
        let matchedCompany;

        if (tokenInfo.auth === Authority.ROLE_PLATFORM_A) {
          // 플랫폼관리자는 업장정보가 없다.
        } else {
          if (matchedAuthorityMap != null) {
            matchedCompany = matchedAuthorityMap.find((company: any) => company.uuid === tokenInfo.uuid);

            if (!matchedCompany) {
              // 토큰에 해당하는 업장정보가 없다면 첫번째 업장정보를 가져옴
              matchedCompany = matchedAuthorityMap[0];
            }
          } else {
            console.log('🛑🛑서버의 권한목록과 권한Map이 매칭되지 않고있다.🛑🛑');
            selectedAuthority.value = null;
          }
        }

        const authorityInfoData: AuthorityInfo = {
          authority: tokenInfo.auth,
          authorityName: tokenInfo.auth,
          companyId: matchedCompany?.id || undefined,
          companyUuid: matchedCompany?.uuid || undefined,
          companyName: matchedCompany?.name || undefined,
        };
        selectedAuthority.value = authorityInfoData;
        window.localStorage.setItem(STORAGE_KEY_SELECTED_AUTHORITY, JSON.stringify(authorityInfoData));
        console.log('🖤 saved selectedAuthority', authorityInfoData);
      }
    } else {
      selectedAuthority.value = null;
    }
  }

  /**
   * # 로그인유지시 해시된 비밀번호를 저장한다.
   */
  function setAuthLoginInfo(authLoginInfo: AuthLoginInfo) {
    window.localStorage.setItem(CREDENTIAL, JSON.stringify(authLoginInfo));
  }

  /**
   * # 응답토큰정보를 저장한다.
   */
  function setToken(userToken: AuthResponse | RespRefreshTokenDTO, isRemember: boolean) {
    const responseUserToken: UserToken = {
      isRemember: isRemember,
      accessToken: userToken.accessToken,
      accessTokenExpiresIn: isAndroid()
        ? new Date().getTime() + 60 * 60 * 1000 // 1시간
        : userToken.accessTokenExpiresIn,
      refreshToken: userToken.refreshToken,
      refreshTokenExpiresIn: userToken.refreshTokenExpiresIn,
      timestamp: new Date().getTime(),
    };
    saveTokenToStore(responseUserToken);
    saveTokenToBrowser(responseUserToken);
  }

  /**
   * # 토큰 정보를 브라우저에 저장한다.
   */
  function saveTokenToBrowser(newToken: UserToken) {
    const localStore: UserToken = {
      isRemember: newToken.isRemember,
      accessToken: newToken.accessToken,
      accessTokenExpiresIn: newToken.accessTokenExpiresIn,
      refreshToken: newToken.refreshToken,
      refreshTokenExpiresIn: newToken.refreshTokenExpiresIn,
      timestamp: newToken.timestamp,
    };
    window.localStorage.setItem(SAVEKEY, JSON.stringify(localStore));
  }

  function saveTokenToStore(newToken: UserToken) {
    if (!token.value) {
      token.value = newToken;
    } else {
      token.value.isRemember = newToken.isRemember;
      token.value.accessToken = newToken.accessToken;
      token.value.accessTokenExpiresIn = newToken.accessTokenExpiresIn;
      token.value.refreshToken = newToken.refreshToken;
      token.value.refreshTokenExpiresIn = newToken.refreshTokenExpiresIn;
      token.value.timestamp = newToken.timestamp;
    }
  }

  /**
   * # 브라우저 토큰을 리셋한다.
   */
  function resetBrowserToken() {
    window.localStorage.removeItem(SAVEKEY);
    window.localStorage.removeItem(CREDENTIAL);
    window.localStorage.removeItem(STORAGE_KEY_SELECTED_AUTHORITY);
  }

  /**
   * # 스토어 토큰을 리셋한다.
   */
  function resetStoreToken() {
    user.value = {} as MemberDTO;
    token.value = null;
    selectedAuthority.value = null;
  }

  /**
   * # 토큰을 리셋한다.
   */
  function resetToken() {
    resetBrowserToken();
    resetStoreToken();
  }

  /**
   * # 아이디와 비밀번호로 로그인한다.
   * @param userid 유저 아이디
   * @param password 유저 비밀번호(평문 또는 해시)
   * @param isRemember 로그인 유지 여부
   * @param isHashed 비밀번호가 암호화 되어있는지 여부
   */
  async function login(userid: string, password: string, isRemember: boolean, isHashed?: boolean): Promise<{ code: number; message: any }> {
    // 로그인 시도 시 토큰을 리셋한다.
    if (!isHashed) {
      resetToken();
    }
    const appType = isAndroid() ? 'ANDROID' : isiOS() ? 'IOS' : 'WEB';
    let fcmToken = '';
    if ((window as any).Reco?.getFcmToken) {
      fcmToken = (window as any).Reco.getFcmToken();
    }
    if ((window as any).Reco?.getIOSFcmToken) {
      fcmToken = await (window as any).Reco.getIOSFcmToken();
    }

    // SHA256 암호화
    const getHashedPassword = isHashed ? password : hashedPassword(password);
    const param = {
      userId: userid,
      password: getHashedPassword,
      type: appType,
      pushToken: fcmToken,
    };
    return axiosInstance
      .post<ApiResponse<AuthResponse>>(`/api/auth/login`, param)
      .then((res) => {
        if (!res.data.content && res.data.errorMessage) {
          throw new Error(res.data.errorMessage);
        }
        setToken(res.data.content, isRemember);
        if (isRemember) {
          // 로그인 유지 시 해시한 비밀번호를 브라우저에 저장
          setAuthLoginInfo({
            userId: userid,
            password: getHashedPassword,
          });
        }
        console.log('🍑 login 🍑 로그인 만료 시간', dayjs(token.value!.accessTokenExpiresIn).format('YYYY-MM-DD HH:mm:ss ddd요일'));
        console.log('🍑 login 🍑 로그인 토큰 정보', debugJWT(token.value!.accessToken));
        console.log('🍑 login 🍑 리프레시 토큰 정보', debugJWT(token.value!.refreshToken));
      })
      .then(getUserInfo)
      .then(() => {
        return {
          code: 200,
          message: null,
        };
      })
      .catch((error) => {
        console.log('🍑 login 🍑 로그인 에러', error);
        throw error;
      })
      .finally(() => {
        refreshTokenPromise.value = null;
      });
  }

  /**
   * # 로그아웃
   */
  async function logout() {
    try {
      if (token.value?.accessToken) {
        await axiosInstance.post(
          '/api/auth/logout',
          {
            deviceType: isAndroid() ? 'ANDROID' : isiOS() ? 'IOS' : 'WEB',
            pushToken: (window as any).Reco?.getFcmToken ? (window as any).Reco?.getFcmToken() : '',
          },
          {
            headers: {
              Authorization: 'Bearer ' + token.value.accessToken,
            },
          },
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      resetToken();

      // 로그아웃 후 로그인 페이지로 이동
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  /**
   * # 로그인 정보를 가져온다.
   * @get /member/me
   */
  function getUserInfo(): Promise<any> {
    if (!token.value) {
      throw new Error('토큰이 존재하지 않습니다.');
    }
    const headers = {
      Authorization: 'Bearer ' + token.value!.accessToken,
    };
    return axiosInstance
      .get<ApiResponse<MemberDTO>>(`/api/member/me`, {
        headers,
      })
      .then((res) => {
        if (res.data.errorMessage) {
          return Promise.reject(new Error(res.data.errorMessage));
        }
        // 성공 시 데이터 세팅
        user.value = res.data.content;
        console.log('🍑 getUserInfo 🍑 유저 정보 가져옴', user.value.userId);
        loadAuthority();
        return true;
      })
      .catch((err: any) => {
        console.log('🍑 getUserInfo 🍑 유저 정보 세팅 중 잘못됨', err);
        resetToken();
        throw err;
      });
  }

  /**
   * # 자동 로그인 시 유저 브라우저에 저장한 키가 유효한지 체크한다.
   * @return {Promise<KeyState>} 토큰 검사 결과 키의 상태
   */
  async function validateToken(): Promise<KeyState> {
    const storageTokenString = window.localStorage.getItem(SAVEKEY);
    if (!storageTokenString) {
      console.log('🍓 validateToken 🍓 브라우저에 토큰이 없다');
      throw new Error('브라우저에 토큰이 없습니다.');
    }

    let storageToken: UserToken;
    try {
      storageToken = JSON.parse(storageTokenString);
    } catch (e) {
      console.log('🍓 validateToken 🍓 브라우저 토큰이 잘못되었다');
      resetBrowserToken();
      throw new Error('브라우저 토큰이 잘못되었습니다.');
    }

    if (!token.value) {
      console.log('🍓 validateToken 🍓 브라우저에는 토큰이 있지만 스토어에 없다');
      saveTokenToStore(storageToken);
    }

    // 브라우저 토큰의 timestamp 와 스토어 토큰의 timestamp 를 비교한다.
    if (token.value?.timestamp && storageToken?.timestamp) {
      if (token.value.timestamp > storageToken.timestamp) {
        // 스토어 토큰이 더 최신이다.
        saveTokenToBrowser({
          isRemember: token.value.isRemember,
          accessToken: token.value.accessToken,
          accessTokenExpiresIn: token.value.accessTokenExpiresIn,
          refreshToken: token.value.refreshToken,
          refreshTokenExpiresIn: token.value.refreshTokenExpiresIn,
          timestamp: token.value.timestamp,
        });
      } else if (token.value.timestamp < storageToken.timestamp) {
        // 브라우저의 토큰이 더 최신이다.
        saveTokenToStore(storageToken);
      }
    }

    if (!token.value) {
      throw new Error('토큰이 존재하지 않습니다.');
    }

    // 저장한 권한을 로드한다.
    loadAuthority();

    // 토큰 만료 시간을 체크
    const now = new Date().getTime();
    const tokenExpiresIn = new Date(token.value!.accessTokenExpiresIn).getTime();

    if (now < tokenExpiresIn) {
      // accessToken 만료 시간이 아직 남았다면 진행
      return KeyState.VALID;
    }

    // refreshToken 만료 시간을 체크
    const refreshTokenExpiresIn = new Date(token.value!.refreshTokenExpiresIn).getTime();

    if (now >= refreshTokenExpiresIn) {
      console.log('🍓 validateToken 🍓 refreshToken 만료');
      const savedCredential = window.localStorage.getItem(CREDENTIAL);
      if (!savedCredential) {
        console.log('🍓 validateToken 🍓 refreshToken 저장된 계정정보 없음');
        throw new Error('저장된 계정정보가 없습니다.');
      }

      let saveUserAuthInfo: AuthLoginInfo;
      try {
        saveUserAuthInfo = JSON.parse(savedCredential!);
      } catch (err) {
        throw new Error('저장된 계정정보 파싱 실패');
      }

      if (token.value.isRemember && saveUserAuthInfo.password != '') {
        // 로그인 유지하기 -> 저장된 비밀번호 해시값으로 로그인
        console.log('🍓 validateToken 🍓 refreshToken 만료 -> 로그인 시도 시작');

        if (refreshTokenPromise.value == null) {
          refreshTokenPromise.value = login(saveUserAuthInfo.userId, saveUserAuthInfo.password, true, true).then((res) => {
            if (res.code === 200) {
              useNotificationStore().success('로그인 정보가 갱신되었습니다.');
              return KeyState.VALID;
            }
            console.log('🍓 validateToken 🍓 로그인 실패');
            throw new Error('로그인 실패');
          });
        }
        return refreshTokenPromise.value;
      } else {
        console.log('🍓 validateToken 🍓 refreshToken 만료 -> 유지하기 off');
        return KeyState.NEED_LOGIN;
      }
    }

    if (now >= tokenExpiresIn) {
      // accessToken 만료시점이 지났다.
      console.log('🍓 validateToken 🍓 accessToken 만료');
      if (now < refreshTokenExpiresIn) {
        // refreshToken 만료 시간이 아직 남았다면 refreshToken 으로 accessToken 을 갱신한다.
        if (refreshTokenPromise.value == null) {
          refreshTokenPromise.value = requestRefreshToken(token.value.accessToken, token.value.refreshToken);
        }
        return refreshTokenPromise.value;
      }
    }

    return KeyState.VALID;
  }

  /**
   * # accessToken 이 만료되었을 때 refreshToken 으로 accessToken 을 갱신한다.
   */
  async function requestRefreshToken(oldAccessToken: string, oldRefreshToken: string): Promise<KeyState> {
    console.log('🍑 requestRefreshToken 🍑 토큰을 다시 받아옵니다!');
    if (!token.value) {
      throw new Error('토큰이 존재하지 않습니다.');
    }
    const param = {
      accessToken: oldAccessToken,
      refreshToken: oldRefreshToken,
    };
    return axiosInstance
      .post<ApiResponse<RespRefreshTokenDTO>>(`/api/auth/reissue`, param)
      .then((res) => {
        if (res.status === 200 && res.data.errorMessage) {
          if (!token.value!.isRemember) {
            useNotificationStore().error(`토큰 재발급 오류: ${res.data.errorMessage}`);
          }
          resetToken();
          throw new Error(`토큰 재발급 오류: ${res.data.errorMessage}`);
        }
        setToken(res.data.content, token.value!.isRemember);

        console.log('🍑 requestRefreshToken 🍑 토큰 재발급', dayjs(token.value!.accessTokenExpiresIn).format('YYYY-MM-DD HH:mm:ss ddd요일'));
        // 토큰 갱신 성공 메시지는 로그만 출력 (사용자에게 표시하지 않음)
        return KeyState.VALID;
      })
      .catch((err) => {
        console.log('🍑 requestRefreshToken 🍑 토큰 재발급 실패', err);
        throw err;
      })
      .finally(() => {
        refreshTokenPromise.value = null;
      });
  }

  /**
   * # 권한 체크
   */
  function hasAuthority(authority: Authority): boolean {
    return user.value?.authorityList.includes(authority) || false;
  }

  /**
   * # 여러 권한 중 하나라도 있는지 체크
   */
  function hasAnyAuthority(authorities: Authority[]): boolean {
    return authorities.some((auth) => hasAuthority(auth));
  }

  /**
   * # 데모 모드용 사용자 데이터 설정 (GitHub Pages 배포용)
   */
  function setDemoUser() {
    user.value = {
      id: 1,
      uuid: 'demo-uuid-12345',
      userId: 'demo@example.com',
      name: 'Demo User',
      authorityList: [Authority.ROLE_PLATFORM_A],
      authorityMap: {},
    } as MemberDTO;
  }

  return {
    // State
    user,
    token,
    selectedAuthority,

    // Computed
    userName,
    userId,
    id,
    uuid,
    isAuthenticated,
    isPlatformAdmin,

    // Actions
    setToken,
    setUser: (userData: MemberDTO) => {
      user.value = userData;
    },
    setDemoUser,
    login,
    logout,
    validateToken,
    requestRefreshToken,
    getUserInfo,
    loadAuthority,
    hasAuthority,
    hasAnyAuthority,
    resetToken,
  };
});
