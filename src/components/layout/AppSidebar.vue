<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useMediaQuery } from "@vueuse/core"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LayoutGrid } from "lucide-vue-next"
import Version from "@/components/common/Version.vue"

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// 모바일에서는 오른쪽, 데스크톱에서는 왼쪽
const isMobile = useMediaQuery('(max-width: 768px)')
const sidebarSide = computed(() => isMobile.value ? 'right' : 'left')

const navigateTo = (path: string) => {
  router.push(path)
}

const isCurrentRoute = (path: string) => {
  return route.path === path
}
</script>

<template>
  <div>
    <!-- Mobile Header -->
    <header class="fixed top-0 left-0 right-0 z-40 border-b md:hidden bg-base-10">
      <div class="flex h-16 items-center justify-between px-4">
        <h1 class="text-size-20 font-bold">Upbox</h1>
        <SidebarTrigger />
      </div>
    </header>

    <!-- Sidebar -->
    <Sidebar :side="sidebarSide" collapsible="icon">
      <!-- Logo & Toggle Header -->
      <SidebarHeader class="py-8 px-4">
        <div class="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <img
            src="/images/logo.svg"
            alt="Logo"
            class="h-6 cursor-pointer group-data-[collapsible=icon]:hidden"
            @click="navigateTo('/')"
          />
          <SidebarTrigger class="text-base-100 shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarContent>

        <!-- Navigation Group -->
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  :data-active="isCurrentRoute('/')"
                  @click="navigateTo('/')"
                  tooltip="Dashboard">
                  <LayoutGrid />
                  <span>{{ t('menu.dashboard') }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div class="flex justify-end group-data-[collapsible=icon]:justify-center">
          <Version />
        </div>
      </SidebarFooter>
    </Sidebar>

    <!-- Spacer for mobile header -->
    <div class="h-16 md:hidden" />
  </div>
</template>

