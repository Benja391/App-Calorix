<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 text-gray-900">
    <div class="min-h-screen bg-white/70 backdrop-blur-sm">

      <!-- Navbar -->
      <nav class="bg-purple-800/90 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 class="text-2xl font-bold tracking-wide">Calorix</h1>
        <ul class="flex gap-6 items-center">
             <li>
            <router-link to="/home" class="hover:text-yellow-300 transition">
              Home
            </router-link>
          </li>
          <li>
            <router-link to="/comidas" class="hover:text-yellow-300 transition">
              Comidas
            </router-link>
          </li>
         
          <li>
            <router-link to="/entrenamientos" class="hover:text-yellow-300 transition">
              Entrenamientos
            </router-link>
          </li>

          <!-- Cuando NO hay sesión -->
          <li v-if="!isLoggedIn">
            <router-link to="/login" class="hover:text-yellow-300 transition">
              Iniciar Sesión
            </router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/register" class="hover:text-yellow-300 transition">
              Registrarse
            </router-link>
          </li>

          <!-- Cuando SÍ hay sesión -->
          <li v-if="isLoggedIn">
            <router-link to="/miperfil" class="hover:text-yellow-300 transition">
              Mi Perfil
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <button @click="logout" class="hover:text-red-400 transition focus:outline-none">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>

      <!-- Contenido dinámico -->
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from './auth';

const router = useRouter();

// Computed que se actualiza al cambiar auth.token
const isLoggedIn = computed(() => !!auth.token);

function logout() {
  // Limpiar storage
  localStorage.removeItem('token');
  localStorage.removeItem('userId');

  // Limpiar estado global
  auth.token  = null;
  auth.userId = null;

  // Redirigir
  router.push('/login');
}
</script>
