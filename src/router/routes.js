export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/game/:mode',
    name: 'Game',
    component: () => import('@/views/Game.vue'),
  },
]
