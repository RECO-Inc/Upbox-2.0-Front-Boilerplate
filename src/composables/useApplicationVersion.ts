import { ref } from "vue"

interface IVersion {
  buildTime: string
  profile: string
  version: string
}

/**
 * 각종 어플리케이션의 버전 정보를 취합한다.
 * 웹, 서버의 버전과 빌드타입을 가져오고 반환한다.
 * @example
 *   const version = useApplicationVersion()
 *   version.fetchServerVersion()
 */
export default function useApplicationVersion() {
  const webVersion = import.meta.env.VITE_APP_VERSION as string || '1.0.0'
  const webBuildType = import.meta.env.VITE_APP_ENV as string || 'development'
  const serverVersion = ref('')
  const serverBuildType = ref('')

  /**
   * 서버로부터 버전 정보를 가져온다.
   */
  async function fetchServerVersion() {
    try {
      const versionInfo: IVersion = await fetch('/api/settings/version', {
        method: "GET"
      }).then(res => res.json())
      serverVersion.value = versionInfo.version
      serverBuildType.value = versionInfo.profile
    } catch (err: unknown) {
      console.error('서버 버전 정보 가져오기 실패', err)
      serverVersion.value = ''
      serverBuildType.value = ''
    }
  }

  return {
    webVersion,
    webBuildType,
    serverVersion,
    serverBuildType,
    fetchServerVersion,
  }
}
