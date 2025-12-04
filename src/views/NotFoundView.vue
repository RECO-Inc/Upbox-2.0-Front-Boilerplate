<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import TruckSimulator from '@/components/common/TruckSimulator.vue'

const router = useRouter()
const { t } = useI18n()

const goToMain = () => {
  router.replace({ path: '/' })
}
</script>

<template>
  <div class="fixed w-full flex items-center justify-center h-screen">
    <TruckSimulator class="z-0" />
    <div class="flex flex-col text-center z-10 text-white">
      <div class="text-size-28 font-bold">Whoops, 404</div>
      <p class="text-size-18 font-bold mb-24">{{ t('ui.lifeCycle.404') }}</p>
      <Button size="lg" @click="goToMain">
        {{ t('ui.lifeCycle.toMain') }}
      </Button>
    </div>
  </div>
</template>
