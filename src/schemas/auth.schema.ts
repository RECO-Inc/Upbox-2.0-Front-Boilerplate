import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'

export const useLoginSchema = () => {
  const { t } = useI18n()

  return toTypedSchema(
    z.object({
      userId: z.string().min(1, t('validation.required')),
      password: z
        .string()
        .min(1, t('validation.required'))
        .min(8, t('validation.invalidPassword'))
    })
  )
}

export const usePasswordChangeSchema = () => {
  const { t } = useI18n()

  return toTypedSchema(
    z
      .object({
        currentPassword: z.string().min(1, t('validation.required')),
        newPassword: z
          .string()
          .min(1, t('validation.required'))
          .min(8, t('validation.invalidPassword')),
        confirmPassword: z.string().min(1, t('validation.required'))
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: t('validation.passwordsDoNotMatch'),
        path: ['confirmPassword']
      })
  )
}
