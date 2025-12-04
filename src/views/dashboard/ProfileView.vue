<script setup lang="ts">
import {ref, onMounted, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useForm} from "vee-validate";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notification";
import {AuthService} from "@/api/auth.service";
import {MemberService} from "@/api/member.service";
import {hashedPassword} from "@/utils/auth";
import type {FileDTO} from "@/api/dto/FileDTO";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import ProfileImage from "@/components/common/ProfileImage.vue";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {usePasswordChangeSchema} from "@/schemas/auth.schema";

const { t } = useI18n()
const userStore = useUserStore()
const notiStore = useNotificationStore()

// 프로필 이미지
const profileFileDTO = ref<FileDTO | undefined>(undefined)

// 수정 가능 필드
const editableName = ref('')
const editablePhoneNumber = ref('')
const editableEmail = ref('')
const editableMemo = ref('')

// 수정 중 상태
const isSaving = ref(false)

// 유저 정보에서 초기값 가져오기
onMounted(() => {
  if (userStore.user) {
    profileFileDTO.value = userStore.user.fileDTO
    editableName.value = userStore.user.name || ''
    editablePhoneNumber.value = userStore.user.phoneNumber || ''
    editableEmail.value = userStore.user.email || ''
    editableMemo.value = userStore.user.memo || ''
  }
})

// 프로필 이미지 변경 시 자동 저장
watch(profileFileDTO, async (newVal, oldVal) => {
  // 초기 로드 시에는 저장하지 않음
  if (!oldVal && newVal) return
  if (newVal && oldVal && newVal.id !== oldVal.id) {
    await saveProfileInfo()
  }
})

// 프로필 정보 저장
async function saveProfileInfo() {
  isSaving.value = true
  try {
    const updateData = {
      id: userStore.id,
      uuid: userStore.uuid,
      userId: userStore.userId,
      memberRole: userStore.user?.memberRole,
      name: editableName.value,
      phoneNumber: editablePhoneNumber.value,
      email: editableEmail.value,
      memo: editableMemo.value,
      fileId: profileFileDTO.value?.id,
    }

    await MemberService.updateMyInfo(updateData)

    // 최신 유저 정보 다시 가져오기 (fileDTO 포함)
    await userStore.getUserInfo()

    // 프로필 이미지 로컬 상태도 업데이트
    if (userStore.user?.fileDTO) {
      profileFileDTO.value = userStore.user.fileDTO
    }

    notiStore.success(t('user.profileUpdateSuccess'))
  } catch (error: any) {
    console.error('Profile update failed:', error)
    notiStore.error(error.response?.data?.errorMessage || t('user.profileUpdateFailed'))
  } finally {
    isSaving.value = false
  }
}

// Setup VeeValidate form for password change
const form = useForm({
  validationSchema: usePasswordChangeSchema()
})

const onSubmitPassword = form.handleSubmit(async (values) => {
  try {
    // 비밀번호를 해시화해서 API로 전송
    await AuthService.changeMyPassword(
      userStore.userId,
      hashedPassword(values.newPassword)
    )

    notiStore.success(t('user.passwordChangeSuccess'))
    form.resetForm()
  } catch (error: any) {
    console.error('Password change failed:', error)
    notiStore.error(error.response?.data?.errorMessage || t('user.passwordChangeFailed'))
  }
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader />
      <main class="min-h-screen px-4 py-8 pt-20 container mx-auto">
        <div class="mx-auto max-w-2xl space-y-6">
          <!-- User Information Card -->
          <div class="rounded-lg border p-6 shadow-sm">
            <h2 class="text-size-18 font-semibold">{{ t('user.userInformation') }}</h2>
            <div class="mt-6 space-y-4">
              <!-- Profile Image -->
              <div class="flex justify-center">
                <ProfileImage v-model="profileFileDTO" editable />
              </div>

              <!-- 읽기 전용 필드 -->
              <div class="space-y-2">
                <label class="text-size-14 font-medium">{{ t('auth.userId') }}</label>
                <Input :model-value="userStore.userId" readonly />
              </div>
              <div class="space-y-2">
                <label class="text-size-14 font-medium">UUID</label>
                <Input :model-value="userStore.uuid" readonly class="font-mono text-size-12" />
              </div>

              <!-- 수정 가능 필드 -->
              <div class="space-y-2">
                <label class="text-size-14 font-medium">{{ t('user.name') }}</label>
                <Input v-model="editableName" :placeholder="t('user.enterName')" />
              </div>
              <div class="space-y-2">
                <label class="text-size-14 font-medium">{{ t('user.phoneNumber') }}</label>
                <Input v-model="editablePhoneNumber" :placeholder="t('user.enterPhoneNumber')" />
              </div>
              <div class="space-y-2">
                <label class="text-size-14 font-medium">{{ t('user.email') }}</label>
                <Input v-model="editableEmail" type="email" :placeholder="t('user.enterEmail')" />
              </div>
              <div class="space-y-2">
                <label class="text-size-14 font-medium">{{ t('user.memo') }}</label>
                <Textarea v-model="editableMemo" :placeholder="t('user.enterMemo')" :rows="3" />
              </div>

              <Button class="w-full" @click="saveProfileInfo" :disabled="isSaving">
                {{ isSaving ? t('common.saving') : t('user.saveProfile') }}
              </Button>
            </div>
          </div>

          <!-- Change Password Card -->
          <div class="rounded-lg border p-6 shadow-sm">
            <h2 class="text-size-18 font-semibold">{{ t('user.changePassword') }}</h2>
            <form class="mt-6 space-y-4" @submit="onSubmitPassword">
              <FormField v-slot="{ componentField }" name="currentPassword">
                <FormItem>
                  <FormLabel>{{ t('user.currentPassword') }}</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="password"
                      :placeholder="t('user.enterCurrentPassword')"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="newPassword">
                <FormItem>
                  <FormLabel>{{ t('user.newPassword') }}</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="password"
                      :placeholder="t('user.enterNewPassword')"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="confirmPassword">
                <FormItem>
                  <FormLabel>{{ t('user.confirmPassword') }}</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="password"
                      :placeholder="t('user.confirmNewPassword')"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <Button class="w-full" type="submit">
                {{ t('user.changePassword') }}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
