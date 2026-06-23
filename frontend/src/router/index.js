import { createRouter, createWebHistory } from 'vue-router'

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
        component: () => import('@/views/home/HomeView.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/search/SearchView.vue')
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/views/chat/ChatView.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/profile/ProfileView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
