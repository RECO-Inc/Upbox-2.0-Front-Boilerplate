<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { Info } from "lucide-vue-next"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import useApplicationVersion from "@/composables/useApplicationVersion"

const { t } = useI18n()
const version = useApplicationVersion()
version.fetchServerVersion()
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button class="version-button text-base-60 text-size-12">
        <Info :size="20" class="text-base-60" />
        <span class="version-text group-data-[collapsible=icon]:hidden">
          {{ t('ui.component.version.view') }}
        </span>
      </button>
    </PopoverTrigger>
    <PopoverContent side="top" class="w-auto p-0 border-0 bg-primary-90 text-base-10 rounded-[8px] shadow-all">
      <div class="flex items-start gap-2 p-2">
        <Info :size="16" class="text-primary-50 mt-0.5 shrink-0" />
        <div class="version-list">
          <div>{{ t('ui.component.version.web') }}: {{ version.webVersion }} ({{ version.webBuildType }})</div>
          <div v-if="version.serverVersion.value">
            {{ t('ui.component.version.server') }}: {{ version.serverVersion.value }} ({{ version.serverBuildType.value }})
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped lang="scss">
.version-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.version-text {
  white-space: nowrap;
}

.version-list {
  font-size: 12px;
  line-height: 1.5;
}
</style>
