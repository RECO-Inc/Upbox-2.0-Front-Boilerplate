<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Pencil } from "lucide-vue-next";
import type { FileDTO } from "@/api/dto/FileDTO";
import { api } from "@/api/request";
import { useNotificationStore } from "@/stores/notification";
import { inputFileToFileObject, mimeLists } from "@/utils/file";

const { t } = useI18n();
const notiStore = useNotificationStore();

/**
 * 프로필이미지 수정 컴포넌트
 *
 * Props:
 * - modelValue: FileDTO 객체
 * - src: view 용도로 사용 시 이미지 src 값 (v-model 보다 우선)
 * - editable: 수정 가능 여부
 * - size: 정사각형 가로세로 사이즈 지정
 * - maxSize: 파일 최대 크기 (MB)
 * - supportExt: 지원 확장자
 * - uploadUrl: 업로드 url
 */
const modelValue = defineModel<FileDTO | undefined>({ required: false });

interface ProfileImageProps {
  src?: string;
  editable?: boolean;
  size?: number;
  maxSize?: number;
  supportExt?: string[];
  uploadUrl?: string;
}

const props = withDefaults(defineProps<ProfileImageProps>(), {
  size: 160,
  src: '',
  maxSize: 2,
  supportExt: () => ['JPG', 'PNG'],
  uploadUrl: 'file/upload',
  editable: false,
});

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));

const displayExts = computed(() => {
  if (props.supportExt && props.supportExt.length > 0) {
    return props.supportExt.join(', .');
  }
  return '';
});

/**
 * 이미지 유효성 검사
 */
function validateImage(file: Blob): boolean {
  const getMime = mimeLists.get(file.type);
  if (!getMime || !props.supportExt.find((val) => val.toUpperCase() === getMime.toUpperCase())) {
    notiStore.error(t('user.profileImage.supportExt', { ext: displayExts.value }));
    return false;
  }
  if (file.size > props.maxSize * 1024 * 1024) {
    notiStore.error(t('user.profileImage.maxSize', { size: props.maxSize }));
    return false;
  }
  return true;
}

/**
 * 파일 선택 핸들러
 */
function onClickChooseFiles(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = async () => {
      await doUpload(input.files![0]);
      input.value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/**
 * 파일 업로드 처리
 */
async function doUpload(file: File) {
  if (!validateImage(file)) {
    return;
  }
  const fileInfo = inputFileToFileObject(file);
  const res = await uploadFile(fileInfo.fileObject!);
  if (res) {
    modelValue.value = res;
  }
}

/**
 * 서버에 파일 업로드
 */
async function uploadFile(file: File): Promise<FileDTO | null> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await api.post<FileDTO>(props.uploadUrl, formData);
    notiStore.success(t('user.profileImage.uploadSuccess'));
    return res.data.content;
  } catch (err: any) {
    notiStore.error(err.message || t('user.profileImage.uploadFailed'));
    return null;
  }
}
</script>

<template>
  <div class="profile-image-edit" :style="style">
    <template v-if="props.src">
      <img :src="props.src" :alt="t('user.profileImage.alt')" />
    </template>
    <template v-else-if="modelValue?.s3URL">
      <img :src="`${modelValue.s3URL}${modelValue.fileName}`" :alt="t('user.profileImage.alt')" />
    </template>
    <div class="logo-overlay" v-if="props.editable">
      <div class="icon-container">
        <label class="cursor-pointer">
          <Pencil :size="16" class="text-base-100" />
          <input
            v-show="false"
            type="file"
            @change="onClickChooseFiles"
            :multiple="false"
            accept="image/*"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-image-edit {
  width: 160px;
  height: 160px;
  background-color: var(--color-base-40);
  border-radius: 8px;
  border: 1px solid var(--color-base-30);
  position: relative;
  overflow: hidden;
  background-image: url(/images/human.jpg);
  background-size: cover;
  background-repeat: no-repeat;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .logo-overlay {
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .icon-container {
      position: absolute;
      bottom: 10px;
      right: 13px;
      background-color: var(--color-base-10);
      border-radius: 50%;
      padding: 8px;
      font-size: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
