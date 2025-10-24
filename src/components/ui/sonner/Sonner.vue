<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { Toaster as Sonner } from "vue-sonner"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :toast-options="{
      classes: {
        toast: 'group toast group-[.toaster]:bg-base-10 group-[.toaster]:text-base-100 group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-base-60',
        actionButton:
          'group-[.toast]:bg-primary group-[.toast]:text-primary-80',
        cancelButton:
          'group-[.toast]:bg-base-30 group-[.toast]:text-base-60',
      },
    }"
  />
</template>
