import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../auth'
import ComidasList from '../views/ComidasList.vue'
import Entrenamientos from '../views/Entrenamientos.vue'
import Login from '../views/Login.vue'
import Register from  '../views/register.vue'
import Perfil from '../views/FormPerfil.vue'
import MiPerfil from '../views/MiPerfil.vue'
import Home from '../views/Home.vue'
import EditarPerfil from '../views/EditarPerfil.vue'




const routes = [
  { path: '/', redirect: '/comidas' },
  { path: '/comidas', component: ComidasList },
  { path: '/entrenamientos', component: Entrenamientos },
  { path: '/login',    component: Login,    meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/perfil', component: Perfil, meta: { auth: true } },
  { path: '/miperfil', component: MiPerfil, meta: { auth: true } },
  { path: '/home', component: Home, meta: { auth: true } },
  { path: '/editar-perfil', component: EditarPerfil, meta: { auth: true } },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
