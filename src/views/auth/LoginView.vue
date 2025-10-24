<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'
import { useUserStore } from '@/stores/user'
import { useLoginSchema } from '@/schemas/auth.schema'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const notiStore = useNotificationStore()

const isRemember = ref(false)
const isLoading = ref(false)

// Setup VeeValidate form
const form = useForm({
  validationSchema: useLoginSchema()
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true

    // User Store의 login 함수 사용 (평문 비밀번호, 로그인 유지 여부)
    const result = await userStore.login(values.userId, values.password, isRemember.value)

    if (result.code === 200) {
      notiStore.success(t('auth.loginSuccess'))

      // Get redirect path from query or default to dashboard
      const redirect = router.currentRoute.value.query.redirect as string
      router.replace(redirect || '/')
    } else {
      notiStore.error(result.message || t('auth.loginFailed'))
    }
  } catch (error: any) {
    console.error('Login failed:', error)
    notiStore.error(error.response?.data?.errorMessage || error.message || t('auth.loginFailed'))
  } finally {
    isLoading.value = false
  }
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-10 px-4">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-size-28 font-bold">{{ t('auth.login') }}</h1>
      </div>

      <form class="mt-8 space-y-6 rounded-lg border p-8 shadow-sm" @submit="onSubmit">
        <div class="space-y-4">
          <!-- User ID -->
          <FormField v-slot="{ componentField }" name="userId">
            <FormItem>
              <FormLabel>{{ t('auth.userId') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="text"
                  :placeholder="t('auth.userId')" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Password -->
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>{{ t('auth.password') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="password"
                  :placeholder="t('auth.password')" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Remember Me -->
          <div class="flex items-center space-x-2">
            <input
              id="remember"
              v-model="isRemember"
              type="checkbox"
              class="h-4 w-4 rounded border-base-40 ring-offset-base-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            <label
              for="remember"
              class="text-size-14 font-medium leading-none cursor-pointer">
              Remember me
            </label>
          </div>

          <!-- Login Button -->
          <Button
            class="w-full"
            type="submit"
            :disabled="isLoading">
            <Spinner v-if="isLoading" class="mr-2" />
            {{ t('auth.loginButton') }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
