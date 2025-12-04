/**
 * FileObject 타입 정의
 */
export interface FileObject {
  id: number;
  displayName: string;
  fileType: 'local' | 'remote';
  fileObject?: File;
  url: string;
  fileName?: string;
}

/**
 * input file 로부터 받은 파일을 FileObject 형식으로 바꾼다.
 */
export function inputFileToFileObject(file: File): FileObject {
  return {
    id: new Date().getTime(),
    displayName: file.name,
    fileType: 'local',
    fileObject: file,
    url: URL.createObjectURL(file),
  };
}

/**
 * MIME 타입 매핑
 */
export const mimeLists = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/gif', 'gif'],
  ['image/webp', 'webp'],
]);
