<script setup lang="ts">
import type { InputGroupButtonProps } from "."
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { inputGroupButtonVariants } from "."

const props = withDefaults(defineProps<InputGroupButtonProps>(), {
  size: "xs",
  variant: "assistant",
})
</script>

<template>
  <Button
    :data-size="props.size"
    :variant="props.variant || undefined"
    :class="cn(inputGroupButtonVariants({ size: props.size }), props.class)"
  >
    <slot />
  </Button>
</template>
