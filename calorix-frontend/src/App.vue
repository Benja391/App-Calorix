<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 text-gray-900">
    <!-- Overlay para dar contraste -->
    <div class="min-h-screen bg-white/70 backdrop-blur-sm">
      
      <!-- Navbar -->
      <nav class="bg-purple-800/90 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 class="text-2xl font-bold tracking-wide">Calorix</h1>
        <ul class="flex gap-6">
          <li>
            <router-link 
              to="/comidas" 
              class="hover:text-yellow-300 transition"
            >
              Comidas
            </router-link>
          </li>
          <li>
            <router-link 
              to="/entrenamientos" 
              class="hover:text-yellow-300 transition"
            >
              Entrenamientos
            </router-link>
          </li>
          <li>
            <router-link 
              to="/Login" 
              class="hover:text-yellow-300 transition"
            >
              Iniciar Sesion
            </router-link>
          </li>
           <li>
            <router-link 
              to="/Register" 
              class="hover:text-yellow-300 transition"
            >
              Registrarse
            </router-link>
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
</script>
