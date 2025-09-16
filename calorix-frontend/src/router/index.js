import { createRouter, createWebHistory } from 'vue-router'
import ComidasList from '../views/ComidasList.vue'
import Entrenamientos from '../views/Entrenamientos.vue'
import Login from '../views/Login.vue'
import Register from  '../views/Register.vue'
import Perfil from '../views/Perfil.vue'


const routes = [
  { path: '/', redirect: '/comidas' },
  { path: '/comidas', component: ComidasList },
  { path: '/entrenamientos', component: Entrenamientos },
  { path: '/login',    component: Login,    meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/perfil', component: Perfil, meta: { auth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
