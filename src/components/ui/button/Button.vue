<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-bold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-base-10',
  {
    variants: {
      variant: {
        primary: 'bg-primary-80 !text-base-10 border border-primary-80 hover:bg-primary-90 hover:border-primary-90 active:bg-primary-100 active:border-primary-100',
        error: 'bg-error-80 !text-base-10 border border-error-80 hover:bg-error-70 hover:border-error-70 active:bg-error-100 active:border-error-100',
        positive: 'bg-positive-80 !text-base-10 border border-positive-80 hover:bg-positive-70 hover:border-positive-70',
        usually: 'bg-base-60 !text-base-10 border border-base-60 hover:bg-base-70 hover:border-base-70',
        assistant: 'bg-base-30 !text-base-70 border border-base-30 hover:bg-base-40 hover:border-base-40 active:bg-base-50 active:border-base-50 active:!text-base-80',
        info: 'bg-info-80 !text-base-10 border border-info-80 hover:bg-info-70 hover:border-info-70',
      },
      style: {
        filled: '',
        outlined: 'bg-base-10',
        text: 'border-none bg-transparent shadow-none p-0',
      },
      size: {
        xsmall: 'h-6 px-[6px] py-1 text-size-12 rounded-[2.4px]',
        small: 'h-8 px-2 py-[6px] text-size-13 rounded-[3.2px]',
        regular: 'h-10 px-4 py-[10px] text-size-14 rounded-[4px]',
        medium: 'h-12 px-4 py-3 text-size-16 rounded-[4.8px]',
        large: 'h-14 px-4 py-4 text-size-16 rounded-[5.6px]',
      },
      block: {
        true: 'w-full',
        false: '',
      },
      round: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Primary outlined
      {
        variant: 'primary',
        style: 'outlined',
        class: 'border-primary-100 text-primary-100 hover:bg-primary-20 hover:border-primary-90 hover:text-primary-90 active:bg-primary-30 active:border-primary-80 active:text-primary-90',
      },
      // Primary text
      {
        variant: 'primary',
        style: 'text',
        class: 'text-info-80',
      },
      // Error outlined
      {
        variant: 'error',
        style: 'outlined',
        class: 'border-error-80 text-error-80 hover:bg-error-20 hover:border-error-70 hover:text-error-70 active:bg-error-40 active:border-error-80 active:text-error-80',
      },
      // Error text
      {
        variant: 'error',
        style: 'text',
        class: 'text-error-80',
      },
      // Positive outlined
      {
        variant: 'positive',
        style: 'outlined',
        class: 'border-positive-80 text-positive-80 hover:bg-positive-20 hover:border-positive-70 hover:text-positive-70 active:bg-positive-30 active:border-positive-80 active:text-positive-80',
      },
      // Positive text
      {
        variant: 'positive',
        style: 'text',
        class: 'text-positive-80',
      },
      // Usually outlined
      {
        variant: 'usually',
        style: 'outlined',
        class: 'border-base-70 text-base-70 hover:bg-base-20 hover:border-base-60 hover:text-base-60 active:bg-base-30 active:border-base-70 active:text-base-70',
      },
      // Usually text
      {
        variant: 'usually',
        style: 'text',
        class: 'text-base-70',
      },
      // Assistant outlined
      {
        variant: 'assistant',
        style: 'outlined',
        class: 'border-base-40 text-base-70 hover:bg-base-20 hover:border-base-50 hover:text-base-60 active:bg-base-30 active:border-base-60 active:text-base-70',
      },
      // Assistant text
      {
        variant: 'assistant',
        style: 'text',
        class: 'text-base-60',
      },
      // Info outlined
      {
        variant: 'info',
        style: 'outlined',
        class: 'border-info-80 text-info-80 hover:bg-info-20 hover:border-info-70 hover:text-info-70 active:bg-info-30 active:border-info-80 active:text-info-80',
      },
      // Info text
      {
        variant: 'info',
        style: 'text',
        class: 'text-info-80',
      },
      // Round variants by size
      {
        size: 'xsmall',
        round: true,
        class: 'rounded-full',
      },
      {
        size: 'small',
        round: true,
        class: 'rounded-full',
      },
      {
        size: 'regular',
        round: true,
        class: 'rounded-full',
      },
      {
        size: 'medium',
        round: true,
        class: 'rounded-full',
      },
      {
        size: 'large',
        round: true,
        class: 'rounded-full',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      style: 'filled',
      size: 'regular',
      block: false,
      round: false,
    },
  }
)

export interface EnhancedButtonProps {
  variant?: 'primary' | 'error' | 'positive' | 'usually' | 'assistant' | 'info'
  style?: 'filled' | 'outlined' | 'text'
  size?: 'xsmall' | 'small' | 'regular' | 'medium' | 'large'
  block?: boolean
  round?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  class?: string
  iconLeft?: any
  iconRight?: any
  iconOnly?: any
}

const props = withDefaults(defineProps<EnhancedButtonProps>(), {
  variant: 'primary',
  style: 'filled',
  size: 'regular',
  block: false,
  round: false,
  disabled: false,
  loading: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const iconSize = computed(() => {
  switch (props.size) {
    case 'xsmall':
      return 'w-4 h-4'
    case 'small':
      return 'w-5 h-5'
    case 'regular':
      return 'w-5 h-5'
    case 'medium':
      return 'w-6 h-6'
    case 'large':
      return 'w-6 h-6'
    default:
      return 'w-5 h-5'
  }
})

const handleClick = (event: MouseEvent) => {
  if (props.loading || props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="cn(
      buttonVariants({
        variant: props.variant,
        style: props.style,
        size: props.size,
        block: props.block,
        round: props.round,
      }),
      props.class
    )"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <Spinner v-if="loading" :class="cn('mr-2', iconSize)" />

    <!-- Icon Only -->
    <component
      v-else-if="iconOnly"
      :is="iconOnly"
      :class="iconSize"
    />

    <!-- Icon Left -->
    <component
      v-else-if="iconLeft && !loading"
      :is="iconLeft"
      :class="cn('mr-2', iconSize)"
    />

    <!-- Label/Slot -->
    <span v-if="!iconOnly">
      <slot />
    </span>

    <!-- Icon Right -->
    <component
      v-if="iconRight && !loading && !iconOnly"
      :is="iconRight"
      :class="cn('ml-2', iconSize)"
    />
  </button>
</template>
