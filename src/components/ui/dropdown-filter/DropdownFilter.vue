<script setup lang="ts" generic="T">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronDown, Check, RotateCcw } from "lucide-vue-next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface DropdownFilterOption<V = unknown> {
  label: string;
  value: V;
  isActive?: boolean;
}

const modelValue = defineModel<T[]>({ required: true, default: () => [] });
const props = withDefaults(defineProps<{
  options: DropdownFilterOption<T>[];
  disabled?: boolean;
  readonly?: boolean;
  canAll?: boolean;
  single?: boolean;
  search?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  displayStyle?: 'default' | 'filled' | 'highlight';
}>(), {
  disabled: false,
  readonly: false,
  canAll: true,
  single: false,
  search: false,
  placeholder: '',
  size: 'md',
  displayStyle: 'default',
});

const emit = defineEmits<{
  (e: 'change', value: T[]): void;
}>();

const { t } = useI18n();
const isOpen = ref(false);
const searchKeyword = ref('');

const isPickerDisabled = computed(() => props.disabled || props.readonly);

const filteredOptions = computed(() => {
  return props.options.filter((item) => {
    return item.isActive !== false && item.label.toLowerCase().includes(searchKeyword.value.toLowerCase());
  });
});

const isSelectAll = computed(() => {
  return modelValue.value.length >= filteredOptions.value.length && filteredOptions.value.length > 0;
});

const isSelectSome = computed(() => {
  return modelValue.value.length > 0;
});

const shownText = computed(() => {
  if (!modelValue.value || modelValue.value.length === 0) {
    return '';
  }
  if (modelValue.value.length === 1) {
    const found = props.options.find((item) => item.value === modelValue.value[0]);
    return found?.label ?? t('common.noData');
  }
  const found = props.options.find((item) => item.value === modelValue.value[0]);
  return found?.label ?? t('common.noData');
});

const multiCountText = computed(() => {
  if (modelValue.value.length <= 1) {
    return '';
  }
  return t('ui.component.dropdownFilter.countMore', { count: modelValue.value.length - 1 });
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 px-2 text-size-12';
    case 'lg':
      return 'h-12 px-4 text-size-16';
    default:
      return 'h-10 px-3 text-size-14';
  }
});

const displayClasses = computed(() => {
  const classes = [sizeClasses.value];

  if (isSelectSome.value) {
    if (props.displayStyle === 'highlight') {
      classes.push('bg-primary-80 border-primary-80 text-base-10');
    } else {
      classes.push('bg-primary-20 border-primary-20 text-primary-90');
    }
  } else {
    if (props.displayStyle === 'filled') {
      classes.push('bg-base-20 border-base-20 text-base-90');
    } else {
      classes.push('bg-base-10 border-base-40 text-base-60');
    }
  }

  return classes.join(' ');
});

function clickAll() {
  if (modelValue.value.length >= filteredOptions.value.length) {
    emit('change', []);
    modelValue.value = [];
  } else {
    const values = filteredOptions.value.map((item) => item.value);
    emit('change', values);
    modelValue.value = values;
  }
}

function onClickItem(item: DropdownFilterOption<T>) {
  if (props.disabled || props.readonly) return;

  if (props.single) {
    emit('change', [item.value]);
    modelValue.value = [item.value];
    isOpen.value = false;
    return;
  }

  const foundIndex = modelValue.value.findIndex((v) => v === item.value);

  if (foundIndex === -1) {
    const newValue = [...modelValue.value, item.value];
    emit('change', newValue);
    modelValue.value = newValue;
  } else {
    const newValue = modelValue.value.filter((v) => v !== item.value);
    emit('change', newValue);
    modelValue.value = newValue;
  }
}

function isItemSelected(item: DropdownFilterOption<T>): boolean {
  return modelValue.value.includes(item.value);
}

function onReset() {
  emit('change', []);
  modelValue.value = [];
}
</script>

<template>
  <div class="dropdown-filter">
    <slot name="label" />
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child :disabled="isPickerDisabled">
        <button
          type="button"
          :disabled="isPickerDisabled"
          :class="cn(
            'flex w-full items-center justify-between rounded border transition-colors cursor-pointer',
            displayClasses,
            isPickerDisabled && 'opacity-50 cursor-not-allowed'
          )"
        >
          <div class="flex items-center gap-1 overflow-hidden text-size-13">
            <span v-if="shownText" :class="cn('truncate font-bold', props.displayStyle === 'highlight' ? 'text-base-10' : 'text-primary-80')">{{ shownText }}</span>
            <span v-else class="text-base-50">{{ props.placeholder }}</span>
            <span v-if="multiCountText" :class="cn('shrink-0 font-bold', props.displayStyle === 'highlight' ? 'text-base-10' : 'text-primary-80')">{{ multiCountText }}</span>
          </div>
          <ChevronDown
            :class="cn(
              'shrink-0 transition-transform duration-200',
              props.size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
              isOpen && 'rotate-180'
            )"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        class="w-auto min-w-[200px] max-w-[320px] p-2"
        align="start"
      >
        <!-- Search -->
        <div v-if="props.search" class="mb-2">
          <Input
            v-model="searchKeyword"
            :placeholder="t('common.search')"
            size="sm"
            clearable
          />
        </div>

        <!-- Options List -->
        <div class="max-h-[280px] overflow-y-auto">
          <!-- Select All -->
          <div
            v-if="props.canAll && !props.single && searchKeyword === ''"
            class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-primary-10"
            @click="clickAll"
          >
            <Checkbox
              :model-value="isSelectAll"
            />
            <span class="flex-1 text-size-14 font-medium">{{ t('common.selectAll') }}</span>
          </div>

          <!-- Options -->
          <template v-if="filteredOptions.length > 0">
            <div
              v-for="item in filteredOptions"
              :key="String(item.value)"
              class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-primary-10"
              @click="onClickItem(item)"
            >
              <Checkbox
                v-if="!props.single"
                :model-value="isItemSelected(item)"
              />
              <slot name="item" :item="item">
                <span class="flex-1 text-size-14">{{ item.label }}</span>
              </slot>
              <Check
                v-if="props.single && isItemSelected(item)"
                class="h-4 w-4 text-info-80"
              />
            </div>
          </template>
          <template v-else>
            <div class="px-2 py-4 text-center text-size-14 text-base-50">
              {{ t('common.noData') }}
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div
          v-if="!props.single"
          class="flex items-center justify-between mt-2 pt-2 border-t border-base-30"
        >
          <Button
            variant="usually"
            button-style="outlined"
            size="xs"
            @click="onReset"
          >
            <RotateCcw class="mr-1 h-3 w-3" />
            {{ t('common.reset') }}
          </Button>
          <span class="text-size-12 text-base-60">
            <span class="text-info-80 font-bold">{{ modelValue.length }}</span>
            {{ t('ui.component.dropdownFilter.selected') }}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
