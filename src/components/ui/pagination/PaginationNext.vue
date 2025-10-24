<script setup lang="ts">
import type { PaginationNextProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { ChevronRightIcon } from "lucide-vue-next"
import { PaginationNext, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<PaginationNextProps & {
  class?: HTMLAttributes["class"]
}>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <PaginationNext
    data-slot="pagination-next"
    :class="cn(
      'inline-flex items-center justify-center h-9 px-2.5 text-size-14 font-medium text-base-80 bg-transparent border-none hover:bg-base-20 transition-colors gap-1 sm:pr-2.5',
      props.class
    )"
    v-bind="forwarded"
  >
    <slot>
      <span class="hidden sm:block">Next</span>
      <ChevronRightIcon class="h-4 w-4" />
    </slot>
  </PaginationNext>
</template>
