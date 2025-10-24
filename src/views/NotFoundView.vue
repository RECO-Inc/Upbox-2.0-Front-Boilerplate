<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-base-10 px-4">
    <div class="text-center">
      <h1 class="text-size-32 font-bold text-primary-80" style="font-size: 8rem;">404</h1>
      <h2 class="mt-4 text-size-28 font-semibold">Page Not Found</h2>
      <p class="mt-4 text-base-60">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div class="mt-8 flex gap-4 justify-center">
        <Button @click="goBack">
          Go Back
        </Button>
        <Button variant="outline" @click="goHome">
          Go Home
        </Button>
      </div>
    </div>
  </div>
</template>
