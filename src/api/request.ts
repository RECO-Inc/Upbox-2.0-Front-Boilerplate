import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios, { AxiosError } from 'axios'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import type ApiResponse from '@/types/api'
import type { UserToken } from '@/types/auth'

// Params serializer for array handling
export const paramsSerializer = (params: any) => {
  if (!params) return ''
  return Object.keys(params)
    .map((key) => {
      if (params[key] == null || params[key] === undefined) {
        return null
      }

      if (params[key] instanceof Array) {
        const query = []
        query.push(encodeURIComponent(key) + '=')
        for (const param of params[key]) {
          query.push(encodeURIComponent(param))
        }
        return query.join('&')
      } else {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      }
    })
    .filter((e) => e != null)
    .join('&')
}

// Axios instance
export const axiosInstance = axios.create()

// Settings
export const AXIOS_SETTINGS = {
  DOMAIN: import.meta.env.VITE_API_BASE_URL || '/api',
  UNAUTHORIZED: 403,
  setupApiUrl: (path: string) => {
    if (path.match(/^http/)) {
      return path
    }
    path = path.replace(/\/{2,}/g, '/')
    return `${AXIOS_SETTINGS.DOMAIN}/${path}`
  },
  onUnauthorized: () => {
    const notiStore = useNotificationStore()
    notiStore.error('권한이 없어 로그인화면으로 이동합니다.')

    // Router will be handled by the app
    const event = new CustomEvent('auth:unauthorized')
    window.dispatchEvent(event)
  },
}

// Setup params serializer
axiosInstance.defaults.paramsSerializer = paramsSerializer

// Response interceptor for 403 errors
axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response?.status === AXIOS_SETTINGS.UNAUTHORIZED) {
      AXIOS_SETTINGS.onUnauthorized()
      return Promise.reject(null)
    }
    return Promise.reject(error)
  }
)

// Request function
export async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string | { str: string; vars: any },
  data?: any,
  otherOptions?: any,
  needValidateToken = true
): Promise<AxiosResponse<ApiResponse<T>>> {
  const notiStore = useNotificationStore()
  const userStore = useUserStore()

  // Parse path with variables
  let completePath = ''
  if (typeof path === 'string') {
    completePath = path
  } else {
    completePath = path.str.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, p1) => {
      if (path.vars[p1] == null) {
        throw new Error('요청 파라미터가 없습니다.')
      }
      return path.vars[p1]
    })
  }

  const headers: any = {}
  const requestOptions: AxiosRequestConfig = {
    method: method.toLowerCase(),
    url: AXIOS_SETTINGS.setupApiUrl(completePath),
    withCredentials: true,
    headers: {},
    ...otherOptions,
  }

  const lowerMethod = method.toLowerCase()
  if (lowerMethod === 'post' || lowerMethod === 'delete' || lowerMethod === 'put') {
    headers['Content-Type'] = 'application/json'
    if (data && data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data'
    }
  }

  // Validate token and add Authorization header
  if (needValidateToken) {
    try {
      await userStore.validateToken()
    } catch (error: any) {
      // Token validation failed, trigger logout
      const event = new CustomEvent('auth:token-expired')
      window.dispatchEvent(event)
      throw error
    }

    // Get token from localStorage (AuthKey)
    const savedToken = window.localStorage.getItem('AuthKey')
    if (savedToken) {
      try {
        const key: UserToken = JSON.parse(savedToken)
        if (key?.accessToken) {
          headers['Authorization'] = `Bearer ${key.accessToken}`
        }
      } catch (e) {
        console.error('Failed to parse AuthKey:', e)
      }
    } else if (userStore.token?.accessToken) {
      headers['Authorization'] = `Bearer ${userStore.token.accessToken}`
    }
  }

  // Set data based on method
  if (lowerMethod === 'get' || lowerMethod === 'delete') {
    if (!data) {
      data = {}
    }
    const serializedData = Object.entries(data).reduce((sum: any, field: any) => {
      if (field[1] === null) {
        return { ...sum, [field[0]]: '' }
      }
      if (field[1] === undefined) {
        return sum
      }
      return { ...sum, [field[0]]: String(field[1]) }
    }, {})
    requestOptions.params = { ...serializedData, currentTime: Date.now() }
  } else {
    requestOptions.data = data
  }
  requestOptions.headers = headers

  const startTimestamp = Date.now()

  try {
    const res = await axiosInstance(requestOptions)
    const endTimestamp = Date.now()
    const elapsed = (endTimestamp - startTimestamp) / 1000

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[API ${method}] ${completePath}`, {
        elapsed: `${elapsed.toFixed(2)}s`,
        status: res.status,
        data: res.data,
      })
    }

    // Check for error message in 200 response
    if (res.status === 200 && res.data.errorMessage) {
      notiStore.error(res.data.errorMessage)
      throw new Error(res.data.errorMessage)
    }

    return res
  } catch (error: any) {
    const endTimestamp = Date.now()
    const elapsed = (endTimestamp - startTimestamp) / 1000

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`[API ${method} ERROR] ${completePath}`, {
        elapsed: `${elapsed.toFixed(2)}s`,
        error: error.message,
        response: error.response?.data,
      })
    }

    // Handle different error types
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<any>>

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data?.errorMessage || '요청 처리 중 오류가 발생했습니다.'
        notiStore.error(errorMessage)
      } else if (axiosError.request) {
        notiStore.error('네트워크 연결을 확인해주세요.')
      } else {
        notiStore.error('요청 설정 중 오류가 발생했습니다.')
      }
    }

    throw error
  }
}

// Convenience methods
export const api = {
  get: <T = any>(
    url: string,
    params?: any,
    options?: AxiosRequestConfig,
    needValidateToken = true
  ) => request<T>('GET', url, params, options, needValidateToken),

  post: <T = any>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig,
    needValidateToken = true
  ) => request<T>('POST', url, data, options, needValidateToken),

  put: <T = any>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig,
    needValidateToken = true
  ) => request<T>('PUT', url, data, options, needValidateToken),

  delete: <T = any>(
    url: string,
    params?: any,
    options?: AxiosRequestConfig,
    needValidateToken = true
  ) => request<T>('DELETE', url, params, options, needValidateToken),

  patch: <T = any>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig,
    needValidateToken = true
  ) => request<T>('PATCH', url, data, options, needValidateToken),
}
