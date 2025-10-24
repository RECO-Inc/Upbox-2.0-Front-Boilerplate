<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-bold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary-80 border-primary-80 hover:bg-primary-90 hover:border-primary-90 active:bg-primary-100 active:border-primary-100',
        error: 'bg-error-80 border-error-80 hover:bg-error-70 hover:border-error-70 active:bg-error-100 active:border-error-100',
        positive: 'bg-positive-80 border-positive-80 hover:bg-positive-70 hover:border-positive-70',
        usually: 'bg-base-60 border-base-60 hover:bg-base-70 hover:border-base-70',
        assistant: 'bg-base-30 border-base-30 hover:bg-base-40 hover:border-base-40 active:bg-base-50 active:border-base-50',
        info: 'bg-info-80 border-info-80 hover:bg-info-70 hover:border-info-70',
      },
      style: {
        filled: '!text-base-10',
        outlined: '!bg-base-10',
        text: '!border-none !bg-transparent shadow-none p-0',
      },
      size: {
        xs: 'h-6 px-[6px] py-1 text-size-12 rounded-[2.4px]',
        sm: 'h-8 px-2 py-[6px] text-size-13 rounded-[3.2px]',
        md: 'h-10 px-4 py-[10px] text-size-14 rounded-[4px]',
        lg: 'h-12 px-4 py-3 text-size-16 rounded-[4.8px]',
        xl: 'h-14 px-4 py-4 text-size-16 rounded-[5.6px]',
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
        class: 'border-primary-100 !text-primary-100 hover:bg-primary-20 hover:border-primary-90 hover:!text-primary-90 active:bg-primary-30 active:border-primary-80 active:!text-primary-90',
      },
      // Primary text
      {
        variant: 'primary',
        style: 'text',
        class: '!text-primary-80 hover:!bg-primary-20',
      },
      // Error outlined
      {
        variant: 'error',
        style: 'outlined',
        class: 'border-error-80 !text-error-80 hover:bg-error-20 hover:border-error-70 hover:!text-error-70 active:bg-error-40 active:border-error-80 active:!text-error-80',
      },
      // Error text
      {
        variant: 'error',
        style: 'text',
        class: '!text-error-80 hover:!bg-error-20',
      },
      // Positive outlined
      {
        variant: 'positive',
        style: 'outlined',
        class: 'border-positive-80 !text-positive-80 hover:bg-positive-20 hover:border-positive-70 hover:!text-positive-70 active:bg-positive-30 active:border-positive-80 active:!text-positive-80',
      },
      // Positive text
      {
        variant: 'positive',
        style: 'text',
        class: '!text-positive-80 hover:!bg-positive-20',
      },
      // Usually outlined
      {
        variant: 'usually',
        style: 'outlined',
        class: 'border-base-70 !text-base-70 hover:bg-base-20 hover:border-base-60 hover:!text-base-60 active:bg-base-30 active:border-base-70 active:!text-base-70',
      },
      // Usually text
      {
        variant: 'usually',
        style: 'text',
        class: '!text-base-80 hover:!bg-base-20',
      },
      // Assistant filled (텍스트 색상만 다름)
      {
        variant: 'assistant',
        style: 'filled',
        class: '!text-base-70 active:!text-base-80',
      },
      // Assistant outlined
      {
        variant: 'assistant',
        style: 'outlined',
        class: 'border-base-60 !text-base-80 hover:bg-base-20 hover:border-base-70 hover:!text-base-80 active:bg-base-30 active:border-base-80 active:!text-base-80',
      },
      // Assistant text
      {
        variant: 'assistant',
        style: 'text',
        class: '!text-base-60 hover:!bg-base-20',
      },
      // Info outlined
      {
        variant: 'info',
        style: 'outlined',
        class: 'border-info-80 !text-info-80 hover:bg-info-20 hover:border-info-70 hover:!text-info-70 active:bg-info-30 active:border-info-80 active:!text-info-80',
      },
      // Info text
      {
        variant: 'info',
        style: 'text',
        class: '!text-info-80 hover:!bg-info-20',
      },
      // Round variants by size
      {
        size: 'xs',
        round: true,
        class: 'rounded-full',
      },
      {
        size: 'sm',
        round: true,
        class: 'rounded-full',
      },
      {
        size: 'md',
        round: true,
        class: 'rounded-full',
      },
      {
        size: 'lg',
        round: true,
        class: 'rounded-full',
      },
      {
        size: 'xl',
        round: true,
        class: 'rounded-full',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      style: 'filled',
      size: 'md',
      block: false,
      round: false,
    },
  }
)

export interface EnhancedButtonProps {
  variant?: 'primary' | 'error' | 'positive' | 'usually' | 'assistant' | 'info'
  buttonStyle?: 'filled' | 'outlined' | 'text'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  round?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  class?: string
}

const props = withDefaults(defineProps<EnhancedButtonProps>(), {
  variant: 'primary',
  buttonStyle: 'filled',
  size: 'md',
  block: false,
  round: false,
  disabled: false,
  loading: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

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
        style: props.buttonStyle,
        size: props.size,
        block: props.block,
        round: props.round,
      }),
      props.class
    )"
    @click="handleClick"
  >
    <Spinner v-if="loading" class="mr-2 h-4 w-4" />
    <slot />
  </button>
</template>
