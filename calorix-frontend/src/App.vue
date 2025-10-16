<template>
  <div
    class="flex flex-col min-h-screen
           bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500
           text-gray-900"
  >
    <!-- Fondo semitransparente con blur -->
    <div class="flex flex-col flex-grow bg-white/70 backdrop-blur-sm">
      
      <!-- NAVBAR CONTRASTE -->
      <nav
        class="sticky top-0 z-50
               bg-white/90 backdrop-blur-md border-b-4 border-purple-600
               px-6 py-4 flex items-center justify-between shadow-lg"
      >
        <!-- Logo -->
        <router-link
          to="/home"
          class="text-3xl font-extrabold tracking-wide text-purple-700"
        >
          Calorix
        </router-link>

        <!-- Menú desktop -->
        <ul class="hidden md:flex gap-8 items-center  text-gray-700">
          <li v-for="item in navItems" :key="item.to">
            <router-link
              :to="item.to"
              class="transition
                hover:text-[#d400db]
                hover:underline
                hover:decoration-2
                hover:decoration-[#f704ff]
                hover:underline-offset-4"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>

        <!-- Acciones usuario y botón móvil -->
        <div class="flex items-center gap-4">
          <!-- Si no está logueado -->
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="transition hover:text-[#d400db] hover:underline hover:decoration-2 hover:decoration-[#f704ff] hover:underline-offset-4"
          >
            Iniciar Sesión
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            to="/register"
            class="transition hover:text-[#d400db] hover:underline hover:decoration-2 hover:decoration-[#f704ff] hover:underline-offset-4"
          >
            Registrarse
          </router-link>

          <!-- Si está logueado -->
          <div v-if="isLoggedIn" class="relative group">
 <img
  :src="auth.perfil && auth.perfil.avatar && auth.perfil.avatar.trim() !== '' 
   ? auth.perfil.avatar 
   : `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.perfil?.nombre || 'User')}&background=random`"
  alt="avatar"
  class="w-8 h-8 rounded-full border-2 border-purple-600 cursor-pointer"
/>
            <div
              class="absolute right-0 mt-2 w-40 bg-white text-gray-900
                     rounded-lg shadow-md opacity-0 group-hover:opacity-100
                     transform scale-95 group-hover:scale-100 transition-all"
            >
              <router-link
                to="/miperfil"
                class="block px-4 py-2 hover:bg-gray-100"
              >
                Mi Perfil
              </router-link>
              <button
                @click="logout"
                class="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <!-- botón hamburguesa -->
          <button
            @click="toggleMenu"
            class="md:hidden text-gray-700 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>

      

 

      <!-- Menú móvil -->
      <transition name="slide-down">
        <div
          v-if="mobileMenu"
          class="md:hidden bg-white/90 backdrop-blur-md border-b border-gray-200"
        >
          <ul class="flex flex-col w-full">
            <li
              v-for="item in navItems"
              :key="item.to"
              class="border-t border-gray-200"
            >
              <router-link
                @click="toggleMenu"
                :to="item.to"
                class="block w-full text-center py-4 text-gray-700 hover:bg-gray-100 transition"
              >
                {{ item.label }}
              </router-link>
            </li>
            <li v-if="!isLoggedIn" class="border-t border-gray-200">
              <router-link
                @click="toggleMenu"
                to="/login"
                class="block w-full text-center py-4 text-gray-700 hover:bg-gray-100 transition"
              >
                Iniciar Sesión
              </router-link>
            </li>
            <li v-if="!isLoggedIn" class="border-t border-gray-200">
              <router-link
                @click="toggleMenu"
                to="/register"
                class="block w-full text-center py-4 bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Registrarse
              </router-link>
            </li>
            <li v-if="isLoggedIn" class="border-t border-gray-200">
              <router-link
                @click="toggleMenu"
                to="/miperfil"
                class="block w-full text-center py-4 text-gray-700 hover:bg-gray-100 transition"
              >
                Mi Perfil
              </router-link>
            </li>
            <li v-if="isLoggedIn" class="border-t border-gray-200">
              <button
                @click="() => { logout(); toggleMenu(); }"
                class="w-full text-center py-4 text-gray-700 hover:bg-gray-100 transition"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </transition>

      <!-- Contenido dinámico -->
      <main class="flex-grow overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>

  <!-- ✅ Botón flotante siempre visible -->
<a
  href="https://docs.google.com/forms/d/e/1FAIpQLScnTn6wI4otgvHUWV2YOvwNK-nQ-I2rc0dRi1Dh1f7wo6o-sQ/viewform"
  target="_blank"
  rel="noopener noreferrer"
  class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all text-lg font-semibold z-[9999]"
>
  📩 Contáctanos
</a>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { auth } from './auth';
import { useRouter } from 'vue-router';

const router = useRouter(); // 👈 esto te da acceso al router
const mobileMenu = ref(false); // 👈 lo que te falta





const navItems = [
  { to: '/home',           label: 'Home' },
  { to: '/comidas',        label: 'Comidas' },
  { to: '/entrenamientos', label: 'Entrenamientos' }
];

const isLoggedIn = computed(() => {
  console.log("🔎 auth.token actual:", auth.token);
  console.log("🔎 auth.perfil actual:", auth.perfil);
  return !!auth.token;
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('perfil');
  auth.token  = null;
  auth.userId = null;
  auth.perfil = {};
  router.push('/login');
}

function toggleMenu() {
  mobileMenu.value = !mobileMenu.value;
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
