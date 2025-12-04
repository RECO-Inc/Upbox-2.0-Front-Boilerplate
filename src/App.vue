<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user'
import { useWasteType } from '@/composables/useWasteType'
import { Toaster } from '@/components/ui/sonner'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import 'vue-sonner/style.css'

const loadingStore = useLoadingStore()
const userStore = useUserStore()
const { initWasteTypeEnums } = useWasteType()

// Watch for authentication state changes
watch(
  () => userStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await initWasteTypeEnums()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (import.meta.env.DEV) {
    console.log('[App] Application mounted')
  }
  try {
    await userStore.validateToken()
  } catch (error) {
    console.error('Failed to validate token', error)
  }
})
</script>

<template>
  <div id="app" class="min-h-screen bg-base-10 text-base-100">
    <RouterView />
    <Toaster position="top-right" richColors />
    <LoadingOverlay v-if="loadingStore.isLoading" />
  </div>
</template>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
