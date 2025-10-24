<script lang="ts" setup>
import type { CalendarCellTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { CalendarCellTrigger, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<CalendarCellTriggerProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarCellTrigger
    :class="cn(
      'inline-flex items-center justify-center h-8 w-8 p-0 font-normal rounded-md text-base-80 hover:bg-base-20 transition-colors',
      // Today
      '[&[data-today]:not([data-selected])]:bg-base-20 [&[data-today]:not([data-selected])]:text-primary-80 [&[data-today]:not([data-selected])]:font-semibold',
      // Selected
      'data-[selected]:bg-primary-80 data-[selected]:text-base-10 data-[selected]:opacity-100 data-[selected]:hover:bg-primary-90 data-[selected]:hover:text-base-10',
      // Disabled
      'data-[disabled]:text-base-50 data-[disabled]:opacity-50',
      // Unavailable
      'data-[unavailable]:text-error-70 data-[unavailable]:line-through',
      // Outside months
      'data-[outside-view]:text-base-50 data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-primary-80/50 [&[data-outside-view][data-selected]]:text-base-10 [&[data-outside-view][data-selected]]:opacity-30',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
