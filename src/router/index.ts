import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useLoadingStore } from '@/stores/loading'
import { useNotificationStore } from '@/stores/notification'
import type { Authority } from '@/types/enums/Authority'
import i18n from "@/plugins/i18n";

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: i18n.global.t('auth.login'),
    },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: i18n.global.t('menu.dashboard'),
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/dashboard/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: i18n.global.t('user.profile'),
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      title: '404',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const loadingStore = useLoadingStore();
  const notiStore = useNotificationStore();

  // Set page title
  document.title = to.meta.title ? `${to.meta.title} | Boilerplate` : 'Boilerplate';

  // Check if route requires authentication
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth) {
    // 로그인 페이지가 아닌데 accessToken이 존재하지 않는 경우
    if (!userStore.token?.accessToken) {
      // 기기에 저장된 토큰을 먼저 체크
      try {
        loadingStore.startLoading('auth-check');
        const result = await userStore.validateToken();

        if (result === 'VALID') {
          // 토큰이 유효함
          // user객체의 id값이 null이면 /api/member/me 로 최신화
          if (!userStore.user || !userStore.user.id) {
            try {
              await userStore.getUserInfo();
            } catch (error) {
              console.error('Failed to fetch user info:', error);
              userStore.resetToken();
              notiStore.error('사용자 정보를 가져올 수 없습니다.');
              next({
                name: 'Login',
                query: { redirect: to.fullPath },
              });
              return;
            }
          }

          // 권한 체크
          if (to.meta.authorities) {
            const authorities = to.meta.authorities as Authority[];
            if (!userStore.hasAnyAuthority(authorities)) {
              notiStore.error('접근 권한이 없습니다.');
              next({ name: 'Dashboard' });
              return;
            }
          }

          next();
          return;
        } else {
          // VALID이 아닌 경우 로그인 페이지로 이동
          userStore.resetToken();
          // 로그인 페이지에서 오는 경우가 아닐 때만 에러 메시지 표시
          if (from.name !== 'Login') {
            notiStore.error('로그인이 필요합니다.');
          }
          next({
            name: 'Login',
            query: { redirect: to.fullPath },
          });
          return;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        userStore.resetToken();
        // 로그인 페이지에서 오는 경우가 아닐 때만 에러 메시지 표시
        if (from.name !== 'Login') {
          notiStore.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
        next({
          name: 'Login',
          query: { redirect: to.fullPath },
        });
        return;
      } finally {
        loadingStore.stopLoading('auth-check');
      }
    }

    // accessToken이 존재하는 경우
    // 토큰 검증
    try {
      loadingStore.startLoading('auth-check');
      const result = await userStore.validateToken();

      if (result !== 'VALID') {
        userStore.resetToken();
        // 로그인 페이지에서 오는 경우가 아닐 때만 에러 메시지 표시
        if (from.name !== 'Login') {
          notiStore.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
        next({
          name: 'Login',
          query: { redirect: to.fullPath },
        });
        return;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      userStore.resetToken();
      // 로그인 페이지에서 오는 경우가 아닐 때만 에러 메시지 표시
      if (from.name !== 'Login') {
        notiStore.error('세션이 만료되었습니다. 다시 로그인해주세요.');
      }
      next({
        name: 'Login',
        query: { redirect: to.fullPath },
      });
      return;
    } finally {
      loadingStore.stopLoading('auth-check');
    }

    // user객체의 id값이 null이면 /api/member/me 로 최신화
    if (!userStore.user || !userStore.user.id) {
      try {
        loadingStore.startLoading('fetch-user');
        await userStore.getUserInfo();
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        userStore.resetToken();
        notiStore.error('사용자 정보를 가져올 수 없습니다.');
        next({
          name: 'Login',
          query: { redirect: to.fullPath },
        });
        return;
      } finally {
        loadingStore.stopLoading('fetch-user');
      }
    }

    // Check authority-based access if specified
    if (to.meta.authorities) {
      const authorities = to.meta.authorities as Authority[];
      if (!userStore.hasAnyAuthority(authorities)) {
        notiStore.error('접근 권한이 없습니다.');
        next({ name: 'Dashboard' });
        return;
      }
    }
  } else {
    // If user is already authenticated and trying to access login page
    if (to.name === 'Login' && userStore.isAuthenticated) {
      next({ name: 'Dashboard' });
      return;
    }
  }

  next();
})

// After navigation hook
router.afterEach((to) => {
  if (import.meta.env.DEV) {
    console.log('[Router] Navigated to:', to.fullPath)
  }
})

// Listen to custom auth events
window.addEventListener('auth:unauthorized', () => {
  router.push('/login')
})

window.addEventListener('auth:token-expired', () => {
  const userStore = useUserStore()
  userStore.logout()
  router.push('/login')
})

export default router
