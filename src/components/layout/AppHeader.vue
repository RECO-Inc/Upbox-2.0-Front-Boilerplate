<script setup lang="ts">
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {ChevronDown} from "lucide-vue-next";
import {useUserStore} from "@/stores/user";
import {useNotificationStore} from "@/stores/notification";
import {saveLocale} from "@/plugins/i18n";
import {useSidebar} from "@/components/ui/sidebar/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()
const notiStore = useNotificationStore()
const { state } = useSidebar()

// Breadcrumb 데이터 생성
const breadcrumbItems = computed(() => {
  const items: { label: string; path?: string }[] = []

  // 홈은 항상 포함
  items.push({ label: t('menu.dashboard'), path: '/' })

  // 현재 라우트의 메타 데이터에서 breadcrumb 정보 가져오기
  if (route.meta?.breadcrumb) {
    const breadcrumb = route.meta.breadcrumb as { label: string; path?: string }[]
    items.push(...breadcrumb)
  } else if (route.name && route.name !== 'Dashboard') {
    // 라우트 이름으로 자동 생성
    const routeName = String(route.name)
    items.push({ label: t(`menu.${routeName.toLowerCase()}`) || routeName })
  }

  return items
})

// 사이드바 상태에 따른 left 위치 계산
const headerLeft = computed(() => {
  return state.value === 'collapsed' ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)'
})

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
</script>

<template>
  <header
    class="header-wrapper"
    :style="{ left: headerLeft }"
  >
    <div class="flex w-full items-center justify-between gap-4">
      <!-- Breadcrumb -->
      <Breadcrumb>
        <BreadcrumbList>
          <template v-for="(item, index) in breadcrumbItems" :key="index">
            <BreadcrumbItem>
              <BreadcrumbLink
                v-if="item.path && index < breadcrumbItems.length - 1"
                class="cursor-pointer hover:text-primary-80"
                @click="navigateTo(item.path)"
              >
                {{ item.label }}
              </BreadcrumbLink>
              <BreadcrumbPage v-else>
                {{ item.label }}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>

      <!-- User Menu -->
      <div class="flex items-center gap-4">
        <!-- Authority Badge -->
        <div class="hidden items-center gap-2 md:flex">
          <Badge variant="info" class="rounded-full">
            {{ userStore.headerAuthorityName || t('ui.component.header.noAuth') }}
          </Badge>
          <span v-if="userStore.selectedAuthority?.companyName" class="text-size-12 font-bold text-base-90">
            {{ userStore.selectedAuthority.companyName }}
          </span>
        </div>

        <!-- User Dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger class="flex items-center gap-2 outline-none cursor-pointer">
            <Avatar class="size-4">
              <AvatarImage v-if="userStore.userImage" :src="userStore.userImage" :alt="userStore.userName" />
              <AvatarFallback class="bg-primary-20 text-primary-80 text-size-14 font-semibold">
                {{ userStore.userName?.charAt(0) }}
              </AvatarFallback>
            </Avatar>
            <span class="hidden text-size-12 font-bold md:block">{{ userStore.userName }}</span>
            <ChevronDown class="size-4 text-base-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-48 p-2 bg-base-10">
            <DropdownMenuItem @click="navigateTo('/profile')" class="cursor-pointer">
              <span>{{ t('user.profile') }}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="toggleLanguage" class="cursor-pointer">
              {{ t('ui.component.header.language') }}: {{ locale === 'ko' ? 'Korean' : 'English' }}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              @click="handleLogout"
              class="cursor-pointer text-error-80 focus:text-error-80"
            >
              {{ t('auth.logout') }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  height: 64px;
  background-color: var(--color-base-20);
  padding: 0 24px;
  display: flex;
  align-items: center;
  z-index: 10;
  transition: left 0.2s ease-in-out;
}
</style>
