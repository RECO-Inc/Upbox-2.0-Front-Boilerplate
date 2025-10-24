<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { Check } from "lucide-vue-next"
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes["class"] }>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn('grid place-content-center peer h-4 w-4 shrink-0 rounded border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed border-base-50 bg-base-10 data-[state=checked]:border-primary-80 data-[state=checked]:bg-primary-80 data-[state=checked]:text-base-10 disabled:bg-base-30 disabled:border-base-40 focus-visible:ring-primary-80',
         props.class)"
  >
    <CheckboxIndicator class="grid place-content-center text-current">
      <slot>
        <Check class="h-4 w-4" stroke-width="3" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
