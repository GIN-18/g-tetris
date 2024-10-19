export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/game/:mode',
    name: 'game',
    component: () => import('@/views/Game.vue'),
  },
]
