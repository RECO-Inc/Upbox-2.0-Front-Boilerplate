<script setup lang="ts">
import type { PaginationPrevProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { ChevronLeftIcon } from "lucide-vue-next"
import { PaginationPrev, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<PaginationPrevProps & {
  class?: HTMLAttributes["class"]
}>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <PaginationPrev
    data-slot="pagination-previous"
    :class="cn(
      'inline-flex items-center justify-center h-9 px-2.5 text-size-14 font-medium text-base-80 bg-transparent border-none hover:bg-base-20 transition-colors gap-1 sm:pr-2.5',
      props.class
    )"
    v-bind="forwarded"
  >
    <slot>
      <ChevronLeftIcon class="h-4 w-4" />
      <span class="hidden sm:block">Previous</span>
    </slot>
  </PaginationPrev>
</template>
