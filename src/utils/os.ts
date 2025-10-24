/**
 * # 안드로이드인지 여부
 * @returns {boolean} true 안드로이드, false 아님
 */
export function isAndroid() {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  return /android/.test(userAgent) || platform === 'android';
}

/**
 * # ios인지 여부
 * @returns {boolean} true ios, false 아님
 */
export function isiOS() {
  return !(navigator.userAgent.match(/iPhone|iPad|iPod|macintosh/i) == null);
}

/**
 * # 모바일인지 여부
 * @returns {boolean} true 모바일, false 아님
 */
export function isMobile() {
  // 아이폰 agent가 데스크톱과 동일한 현상으로 maxTouchPoints 값을 추가 비교
  return isAndroid() || (isiOS() && !(navigator.maxTouchPoints == 0));
}

/**
 * # 안드로이드 삼성브라우저 여부
 * @returns {boolean} true samsung, false 아님
 */
export function isAndroidSamsung() {
  return isAndroid() && /samsungbrowser/i.test(navigator.userAgent.toLowerCase());
}
