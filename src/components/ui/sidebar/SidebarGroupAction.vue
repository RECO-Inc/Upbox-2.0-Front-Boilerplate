<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<PrimitiveProps & {
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <Primitive
    data-sidebar="group-action"
    :as="as"
    :as-child="asChild"
    :class="cn(
      'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-base-100 outline-none ring-primary-80 transition-transform hover:bg-base-30 hover:text-base-100 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      'after:absolute after:-inset-2 after:md:hidden',
      'group-data-[collapsible=icon]:hidden',
      props.class,
    )"
  >
    <slot />
  </Primitive>
</template>
