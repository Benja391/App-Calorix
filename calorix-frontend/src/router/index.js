import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MiPerfil from '../views/MiPerfil.vue'
import Comidas from '../views/ComidasList.vue'
import Entrenamientos from '../views/Entrenamientos.vue'
import EditarPerfil from '../views/EditarPerfil.vue'

const routes = [
  { path: '/home', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/miperfil',
    component: MiPerfil,
    meta: { requiresAuth: true }
  },
  {
    path: '/comidas',
    component: Comidas,
    meta: { requiresAuth: true }
  },
  {
    path: '/entrenamientos',
    component: Entrenamientos,
    meta: { requiresAuth: true }
  },
  {
    path: '/editar-perfil',
    component: EditarPerfil,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Guard global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
