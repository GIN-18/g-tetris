import './assets/css/main.css'
import 'nes.css/css/nes.min.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router/router'
import { inject } from '@vercel/analytics'

const app = createApp(App)
const pinia = createPinia()

inject()

app.use(pinia)
app.use(router)
app.mount('#app')
