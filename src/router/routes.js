export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/detail/:mode',
    name: 'GameDetail',
    component: () => import('@/views/GameDetail.vue'),
  },
  {
    path: '/game/:mode',
    name: 'game',
    component: () => import('@/views/Game.vue'),
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/Setting.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
  },
]
