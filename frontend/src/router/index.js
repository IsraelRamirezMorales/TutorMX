import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: () => import('@/views/auth/AuthView.vue')
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/search/SearchView.vue'),
        meta: { requiresAuth: true, role: 'STUDENT' }
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/views/chat/ChatView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { requiresAuth: true }
      },
      // Ejemplos de rutas para Tutor y Admin (Sprint 2)
      {
        path: 'advisories-management',
        name: 'advisories-management',
        component: () => import('@/views/home/HomeView.vue'), // Componente Placeholder
        meta: { requiresAuth: true, role: 'TUTOR' }
      },
      {
        path: 'admin/dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/home/HomeView.vue'), // Componente Placeholder
        meta: { requiresAuth: true, role: 'ADMIN' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'auth' })
  } else if (to.meta.role) {
    // Validar el rol específico
    if (to.meta.role === 'STUDENT' && !authStore.isStudent) {
      next({ name: 'home' })
    } else if (to.meta.role === 'TUTOR' && !authStore.isTutor) {
      next({ name: 'home' })
    } else if (to.meta.role === 'ADMIN' && !authStore.isAdmin) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
