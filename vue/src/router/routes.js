export const routes = [
  {
    path: "/",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: '/game',
    component: () => import("@/views/Game.vue"),
  }
];
