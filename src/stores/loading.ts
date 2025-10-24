import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  // State
  const loadingCount = ref(0)
  const loadingTasks = ref<Set<string>>(new Set())

  // Getters
  const isLoading = computed(() => loadingCount.value > 0)

  // Actions
  const startLoading = (taskId?: string) => {
    loadingCount.value++
    if (taskId) {
      loadingTasks.value.add(taskId)
    }
  }

  const stopLoading = (taskId?: string) => {
    if (loadingCount.value > 0) {
      loadingCount.value--
    }
    if (taskId) {
      loadingTasks.value.delete(taskId)
    }
  }

  const setLoading = (loading: boolean, taskId?: string) => {
    if (loading) {
      startLoading(taskId)
    } else {
      stopLoading(taskId)
    }
  }

  const isTaskLoading = (taskId: string): boolean => {
    return loadingTasks.value.has(taskId)
  }

  const reset = () => {
    loadingCount.value = 0
    loadingTasks.value.clear()
  }

  return {
    // State
    loadingCount,
    isLoading,

    // Actions
    startLoading,
    stopLoading,
    setLoading,
    isTaskLoading,
    reset,
  }
})
