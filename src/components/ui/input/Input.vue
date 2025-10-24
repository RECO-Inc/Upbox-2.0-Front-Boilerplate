<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { X, Eye, EyeOff } from 'lucide-vue-next'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  'flex w-full rounded-md border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-80 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-base-30 bg-transparent',
        filled: 'border-transparent bg-base-20',
        bottomline: 'border-0 border-b-2 border-base-30 rounded-none bg-transparent',
      },
      size: {
        sm: 'h-8 px-2 py-1 text-size-12',
        md: 'h-9 px-3 py-1 text-size-14',
        lg: 'h-10 px-4 py-2 text-size-16',
      },
      error: {
        true: 'border-error-70 focus-visible:ring-error-70',
        false: '',
      },
      readonly: {
        true: 'cursor-default focus-visible:ring-0 bg-base-10',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      error: false,
      readonly: false,
    },
  }
)

const wrapperVariants = cva(
  'relative w-full',
  {
    variants: {
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)

export interface EnhancedInputProps {
  variant?: 'default' | 'filled' | 'bottomline'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  modelValue?: string | number
  defaultValue?: string | number
  class?: HTMLAttributes['class']
  label?: string
  required?: boolean
  clearable?: boolean
  password?: boolean
  errorMessage?: string
  subfix?: string
  counter?: boolean
  maxLength?: number
  byteMode?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  type?: string
}

const props = withDefaults(defineProps<EnhancedInputProps>(), {
  variant: 'default',
  size: 'md',
  error: false,
  disabled: false,
  readonly: false,
  clearable: false,
  password: false,
  counter: false,
  byteMode: false,
  type: 'text',
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const showPassword = ref(false)
const inputType = computed(() => {
  if (props.password) {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const hasError = computed(() => props.error || !!props.errorMessage)

const getByteLength = (str: string): number => {
  return new Blob([str]).size
}

const currentCount = computed(() => {
  const value = String(modelValue.value || '')
  return props.byteMode ? getByteLength(value) : value.length
})

const maxCount = computed(() => props.maxLength || 0)

const counterText = computed(() => {
  if (!props.counter) return ''
  const unit = props.byteMode ? 'byte' : 'char'
  return props.maxLength
    ? `${currentCount.value}/${maxCount.value} ${unit}`
    : `${currentCount.value} ${unit}`
})

const showClearButton = computed(() => {
  return props.clearable && modelValue.value && !props.disabled && !props.readonly
})

const handleClear = () => {
  modelValue.value = ''
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const hasPaddingRight = computed(() => {
  return showClearButton.value || props.password || !!props.subfix
})

const inputPaddingClass = computed(() => {
  return cn(
    hasPaddingRight.value && 'pr-10'
  )
})
</script>

<template>
  <div :class="wrapperVariants({ disabled: props.disabled })">
    <!-- Label -->
    <label
      v-if="label"
      class="inline-block mb-2 text-size-14 text-base-80 font-medium"
    >
      {{ label }}
      <span v-if="required" class="text-error-70 ml-1">*</span>
    </label>

    <!-- Input Wrapper -->
    <div class="relative">
      <!-- Input -->
      <input
        v-model="modelValue"
        :type="inputType"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :class="cn(
          inputVariants({
            variant: props.variant,
            size: props.size,
            error: hasError,
            readonly: props.readonly
          }),
          inputPaddingClass,
          'text-base-80',
          props.class
        )"
      />

      <!-- Right Side Elements Container -->
      <div
        v-if="hasPaddingRight"
        class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2"
      >
        <!-- Subfix Text -->
        <span v-if="subfix" class="text-size-14 text-base-60">
          {{ subfix }}
        </span>

        <!-- Clear Button -->
        <button
          v-if="showClearButton"
          type="button"
          @click="handleClear"
          class="text-base-50 hover:text-base-70 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>

        <!-- Password Toggle -->
        <button
          v-if="password"
          type="button"
          @click="togglePasswordVisibility"
          class="text-base-50 hover:text-base-70 transition-colors"
        >
          <Eye v-if="!showPassword" class="w-4 h-4" />
          <EyeOff v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Bottom Row: Error Message & Counter -->
    <div
      v-if="errorMessage || counter"
      class="flex justify-between items-start mt-1"
    >
      <!-- Error Message -->
      <span
        v-if="errorMessage"
        class="text-size-12 text-error-70"
      >
        {{ errorMessage }}
      </span>
      <span v-else></span>

      <!-- Counter -->
      <span
        v-if="counter"
        class="text-size-12 text-base-50 ml-auto"
      >
        {{ counterText }}
      </span>
    </div>
  </div>
</template>
