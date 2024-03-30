import './assets/main.css'
import "nes.css/css/nes.min.css";

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { Notify } from '@/components/notification/index.js'

import { routes } from '@/router/routes.js'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(pinia)
app.use(router)
app.use(Notify)
app.mount('#app')
