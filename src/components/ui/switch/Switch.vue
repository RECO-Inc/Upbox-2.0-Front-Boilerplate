<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  SwitchRoot,

  SwitchThumb,
  useForwardPropsEmits,
} from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes["class"] }>()

const emits = defineEmits<SwitchRootEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="cn(
      'peer inline-flex h-[18px] w-[30px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base-10 disabled:cursor-not-allowed',
      'data-[state=checked]:bg-primary-80',
      'data-[state=unchecked]:bg-base-50',
      'disabled:bg-base-40',
      'focus-visible:ring-primary-80',
      props.class,
    )"
  >
    <SwitchThumb
      :class="cn('pointer-events-none block h-[14px] w-[14px] rounded-full ring-0 transition-transform',
                 'bg-base-10',
                 'data-[state=checked]:translate-x-[13.5px] data-[state=unchecked]:translate-x-[2px]')"
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
