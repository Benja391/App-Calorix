import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import FormPerfil from '../views/FormPerfil.vue'
import Comidas from '../views/ComidasList.vue'
import Entrenamientos from '../views/Entrenamientos.vue'
import EditarPerfil from '../views/EditarPerfil.vue'
import MiPerfil from '../views/MiPerfil.vue'
import { isTokenExpired } from '../auth'; // 👈 importa la función


const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/perfil',         // 🔹 esta ruta es tu formulario inicial
    component: FormPerfil,
    meta: { requiresAuth: true }
  },
    {
    path: '/miperfil',       // 🔹 ver perfil
    component: MiPerfil,
    meta: { requiresAuth: true }
  },
  {
    path: '/editar-perfil',  // 🔹 editar perfil
    component: EditarPerfil,
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
  },
   {
    path: '/home',
    component: Home,

  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth) {
    if (!token || isTokenExpired(token)) {
      console.warn("⚠️ Token faltante o expirado. Redirigiendo a /login");
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
