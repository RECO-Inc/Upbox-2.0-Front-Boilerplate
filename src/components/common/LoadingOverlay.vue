<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-base-10/80 backdrop-blur-sm">
    <div class="flex flex-col items-center gap-4">
      <Spinner class="h-16 w-16 text-primary" />
      <p class="text-size-14 text-base-60">Loading...</p>
    </div>
  </div>
</template>
