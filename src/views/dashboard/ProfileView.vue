<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import { AuthService } from '@/api/auth.service'
import { hashedPassword } from '@/utils/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { usePasswordChangeSchema } from '@/schemas/auth.schema'

const { t } = useI18n()
const userStore = useUserStore()
const notiStore = useNotificationStore()

// Setup VeeValidate form
const form = useForm({
  validationSchema: usePasswordChangeSchema()
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    // 비밀번호를 해시화해서 API로 전송
    // userId와 새 비밀번호만 전송 (원본 프로젝트 방식)
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
      <main class="min-h-screen px-4 py-8 container mx-auto">
        <div class="mx-auto max-w-2xl space-y-6">
          <!-- User Information Card -->
          <div class="rounded-lg border p-6 shadow-sm">
            <h2 class="text-size-18 font-semibold">{{ t('user.userInformation') }}</h2>
            <div class="mt-6 space-y-4">
              <div class="space-y-2">
                <label class="text-size-14 font-medium">{{ t('auth.userId') }}</label>
                <Input :model-value="userStore.userId" readonly />
              </div>
              <div class="space-y-2">
                <label class="text-size-14 font-medium">{{ t('user.name') }}</label>
                <Input :model-value="userStore.userName" readonly />
              </div>
              <div class="space-y-2">
                <label class="text-size-14 font-medium">UUID</label>
                <Input :model-value="userStore.uuid" readonly class="font-mono text-size-12" />
              </div>
              <div class="space-y-2">
                <label class="text-size-14 font-medium">{{ t('user.email') }}</label>
                <Input :model-value="userStore.user?.email || 'N/A'" readonly />
              </div>
            </div>
          </div>

          <!-- Authority Card -->
          <div class="rounded-lg border p-6 shadow-sm">
            <h2 class="text-size-18 font-semibold">{{ t('user.authority') }}</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="auth in userStore.user?.authorityList"
                :key="auth"
                class="rounded-full bg-primary-20 px-4 py-2 text-size-14 font-medium text-primary-80"
              >
                {{ auth }}
              </span>
            </div>
          </div>

          <!-- Change Password Card -->
          <div class="rounded-lg border p-6 shadow-sm">
            <h2 class="text-size-18 font-semibold">{{ t('user.changePassword') }}</h2>
            <form class="mt-6 space-y-4" @submit="onSubmit">
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
