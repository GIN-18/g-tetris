export const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/game/:mode',
    component: () => import('@/views/Game.vue'),
  },
]
