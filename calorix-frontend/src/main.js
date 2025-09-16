import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'   // 👈 importa tu router

createApp(App).use(router).mount('#app')  // 👈 activa el router
