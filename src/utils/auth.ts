import CryptoJS from 'crypto-js';

/**
 * # 비밀번호 해싱
 * SHA256으로 암호화
 * @param password 평문 비밀번호
 * @returns 해시된 비밀번호
 */
export function hashedPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}
