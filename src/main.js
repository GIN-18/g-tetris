import './assets/css/main.css'
import 'nes.css/css/nes.min.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router/router'

const app = createApp(App)
const pinia = createPinia()

router.beforeEach((to, from) => {
  if (to.name === 'game') {
    to.params.mode
      ? (document.title = `${to.params.mode.toUpperCase()}`)
      : (document.title = 'VUETRIS')
  } else if (to.name === 'setting') {
    document.title = 'SETTINGS'
  } else {
    document.title = 'VUETRIS'
  }
})

app.use(pinia)
app.use(router)
app.mount('#app')
