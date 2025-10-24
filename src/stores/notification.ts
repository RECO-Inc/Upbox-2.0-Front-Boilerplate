import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'

export const useNotificationStore = defineStore('notification', () => {
  // Convenience methods using vue-sonner
  const success = (message: string, duration?: number) => {
    toast.success(message, {
      duration: duration,
    })
  }

  const error = (message: string, duration?: number) => {
    toast.error(message, {
      duration: duration,
    })
  }

  const warning = (message: string, duration?: number) => {
    toast.warning(message, {
      duration: duration,
    })
  }

  const info = (message: string, duration?: number) => {
    toast.info(message, {
      duration: duration,
    })
  }

  return {
    success,
    error,
    warning,
    info,
  }
})
