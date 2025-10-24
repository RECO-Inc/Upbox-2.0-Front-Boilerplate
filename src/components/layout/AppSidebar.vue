<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import { saveLocale } from '@/plugins/i18n'
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
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Home, User, Languages, LogOut } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const userStore = useUserStore()
const notiStore = useNotificationStore()

const toggleLanguage = () => {
  const newLocale = locale.value === 'ko' ? 'en' : 'ko'
  locale.value = newLocale
  saveLocale(newLocale)
  notiStore.success(`Language changed to ${newLocale.toUpperCase()}`)
}

const handleLogout = async () => {
  await userStore.logout()
  notiStore.success(t('auth.logoutSuccess'))
}

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
        <h1 class="text-size-20 font-bold">Boilerplate</h1>
        <SidebarTrigger />
      </div>
    </header>

    <!-- Sidebar -->
    <Sidebar collapsible="icon">
      <SidebarContent>
        <!-- User Info Group -->
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" disabled>
                  <div class="flex aspect-square size-8 items-center justify-center rounded-full bg-primary-20">
                    <span class="text-size-14 font-semibold text-primary-80">{{ userStore.userName?.charAt(0) }}</span>
                  </div>
                  <div class="grid flex-1 text-left text-size-14 leading-tight">
                    <span class="truncate font-medium">{{ userStore.userName }}</span>
                    <span class="truncate text-size-12 text-base-60">{{ userStore.userId }}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <!-- Navigation Group -->
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  :data-active="isCurrentRoute('/')"
                  @click="navigateTo('/')"
                  tooltip="Dashboard"
                >
                  <Home />
                  <span>{{ t('menu.dashboard') }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  :data-active="isCurrentRoute('/profile')"
                  @click="navigateTo('/profile')"
                  tooltip="Profile"
                >
                  <User />
                  <span>{{ t('user.profile') }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton @click="toggleLanguage" tooltip="Change Language">
              <Languages />
              <span>{{ locale === 'ko' ? 'Korean' : 'English' }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton @click="handleLogout" tooltip="Logout" class="hover:bg-destructive hover:text-error-80">
              <LogOut />
              <span>{{ t('auth.logout') }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>

    <!-- Spacer for mobile header -->
    <div class="h-16 md:hidden" />
  </div>
</template>
