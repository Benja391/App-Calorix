<template v-cloak>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Hero: pantalla completa -->
    <section
      class="relative h-screen bg-gradient-to-r from-purple-600 to-pink-500
             flex flex-col items-center justify-center text-center px-4"
    >
      <h1 class="text-5xl font-extrabold text-white mb-4">
        Bienvenido a Calorix
      </h1>
      <p class="text-xl text-white mb-8 max-w-2xl">
        Registra comidas, mide calorías, planifica entrenamientos
        y lleva tu progreso en un solo lugar. ¡Tu salud en tus manos!
      </p>
      <div class="space-x-4">
        <router-link
          to="/register"
          class="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold
                 shadow-lg hover:bg-gray-100 transition"
        >
          Regístrate
        </router-link>
        <router-link
          to="/login"
          class="bg-transparent border border-white text-white px-6 py-3 rounded-full
                 font-semibold hover:bg-white hover:text-purple-600 transition"
        >
          Iniciar Sesión
        </router-link>
      </div>
      <div class="absolute bottom-6 animate-bounce">
        <span class="material-icons-outlined text-white text-4xl">
          keyboard_arrow_down
        </span>
      </div>
    </section>

    <!-- Funciones principales -->
    <section class="py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-8">
          Funciones principales
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div
            class="flex flex-col items-center text-center p-6 bg-white
                   rounded-lg shadow-sm hover:shadow-md transition"
          >
            <span class="material-icons-outlined text-purple-600 text-5xl">
              fastfood
            </span>
            <h3 class="mt-4 text-lg font-semibold text-gray-800">Comidas</h3>
            <p class="mt-2 text-gray-600 text-sm">
              Controla cada bocado: registra calorías, porciones y notas.
            </p>
          </div>

          <div
            class="flex flex-col items-center text-center p-6 bg-white
                   rounded-lg shadow-sm hover:shadow-md transition"
          >
            <span class="material-icons-outlined text-pink-500 text-5xl">
              fitness_center
            </span>
            <h3 class="mt-4 text-lg font-semibold text-gray-800">
              Entrenamientos
            </h3>
            <p class="mt-2 text-gray-600 text-sm">
              Planifica sesiones, registra duración e intensidad.
            </p>
          </div>

          <div
            class="flex flex-col items-center text-center p-6 bg-white
                   rounded-lg shadow-sm hover:shadow-md transition"
          >
            <span class="material-icons-outlined text-indigo-500 text-5xl">
              person
            </span>
            <h3 class="mt-4 text-lg font-semibold text-gray-800">Perfil</h3>
            <p class="mt-2 text-gray-600 text-sm">
              Completa tu información y personaliza tu experiencia.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section class="bg-white py-16 px-4">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">Cómo funciona</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
            <span class="material-icons-outlined text-purple-600 text-4xl">
              edit
            </span>
            <h3 class="mt-4 font-semibold text-gray-800 text-lg">Registra</h3>
            <p class="text-gray-600 text-sm mt-2">
              Añade tus comidas y entrenamientos en segundos desde cualquier dispositivo.
            </p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
            <span class="material-icons-outlined text-pink-500 text-4xl">
              timer
            </span>
            <h3 class="mt-4 font-semibold text-gray-800 text-lg">Monitorea</h3>
            <p class="text-gray-600 text-sm mt-2">
              Ve tu progreso en tiempo real: calorías consumidas y calorías quemadas.
            </p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
            <span class="material-icons-outlined text-indigo-500 text-4xl">
              bar_chart
            </span>
            <h3 class="mt-4 font-semibold text-gray-800 text-lg">Analiza</h3>
            <p class="text-gray-600 text-sm mt-2">
              Genera reportes y gráficos para entender tu evolución a largo plazo.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="py-16 px-4">
      <div class="max-w-4xl mx-auto text-center space-y-12">
        <h2 class="text-3xl font-bold text-gray-800">Nuestros usuarios opinan</h2>
        <div class="space-y-8">
          <div class="p-6 bg-white rounded-lg shadow-sm">
            <p class="text-gray-700 italic">
              “Calorix me ayudó a controlar mi ingesta diaria y planificar rutinas
              de manera sencilla. ¡Muy recomendable!”
            </p>
            <span class="block mt-4 font-semibold text-gray-800">— Laura G.</span>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-sm">
            <p class="text-gray-700 italic">
              “La interfaz es limpia y todo está al alcance de un clic. Mi
              rendimiento mejoró gracias a la organización de mis entrenos.”
            </p>
            <span class="block mt-4 font-semibold text-gray-800">— Miguel P.</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Llamada a la acción -->
    <section
      class="bg-gradient-to-r from-purple-600 to-pink-500 py-16 px-4
             flex flex-col items-center justify-center text-center"
    >
      <h2 class="text-3xl font-bold text-white mb-4">
        Comienza tu transformación hoy
      </h2>
      <router-link
        to="/register"
        class="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold
               shadow-lg hover:bg-gray-100 transition"
      >
        Regístrate gratis
      </router-link>
    </section>

   <!-- Footer -->
<footer class="bg-gray-800 text-gray-400 py-6 px-4 text-center">
  <p>© 2025 <span class="text-white font-semibold">Calorix</span>. Todos los derechos reservados.</p>
  <p class="mt-2">
    Propiedad de: <span class="text-white font-medium">María José Bosch</span><br>
    CUIT: <span class="text-white font-medium">20-34750944-3</span><br>
    Mail: 
    <a href="mailto:mariabosch1289@gmail.com" class="text-white hover:underline">
      mariabosch1289@gmail.com
    </a>
  </p>
</footer>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
