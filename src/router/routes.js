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
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
  },
]
