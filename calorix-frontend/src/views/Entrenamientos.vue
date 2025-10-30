<template v-cloak>
 <div class="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Cabecera degradada -->
      <div class="h-32 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
        <h1 class="text-3xl font-bold text-white">Registrar entrenamientos</h1>
      </div>
      <div class="px-8 py-6 space-y-8">
        <!-- Formulario -->
        <form
          @submit.prevent="agregarEntrenamiento"
          class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6"
        >
          <!-- Nombre -->
          <div>
            <label class="block text-gray-700 mb-1 font-medium">
              Nombre del entrenamiento
            </label>
            <input
              v-model="nombre"
              type="text"
              required
              placeholder="Ej: correr, natación, ciclismo"
              class="w-full border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <!-- Duración flexible -->
          <div>
            <label class="block text-gray-700 mb-2 font-medium">
              Duración
            </label>
            <div class="grid grid-cols-2 gap-4">
              <!-- Horas -->
              <div>
                <label class="block text-sm text-gray-600 mb-1">Horas</label>
                <input
                  v-model.number="horas"
                  type="number"
                  min="0"
                  placeholder="Ej: 1"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <!-- Minutos -->
              <div>
                <label class="block text-sm text-gray-600 mb-1">Minutos</label>
                <input
                  v-model.number="minutos"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Ej: 30"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
          <!-- Descripción -->
          <div>
            <label class="block text-gray-700 mb-1 font-medium">
              Descripción / Intensidad
            </label>
            <textarea
              v-model="descripcion"
              rows="2"
              placeholder="Ej: entrenamiento suave, natación intensa..."
              class="w-full border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>
          <!-- Botón -->
          <button
            type="submit"
            class="w-full bg-purple-600 text-white py-2 rounded-full
                   hover:bg-purple-700 transition-shadow shadow-md"
          >
            Agregar
          </button>
        </form>
        <hr class="border-gray-200" />
        <!-- Lista de entrenamientos -->
        <div>
          <h2 class="text-2xl font-semibold text-purple-700 text-center mb-4">
            📋 Entrenamientos registrados
          </h2>
          <ul v-if="entrenamientos.length" class="space-y-4">
            <li
              v-for="entrenamiento in entrenamientos"
              :key="entrenamiento._id"
              class="bg-white border border-gray-200 rounded-lg p-4 flex
                     justify-between items-center shadow-sm"
            >
              <span class="flex-1 font-medium text-gray-800">
                🏋️ {{ entrenamiento.nombre }}
                <span class="text-gray-500 ml-2">
                  ({{ entrenamiento.duracion }} min - {{ entrenamiento.calorias }} cal)
                </span>
              </span>
              <button
                @click="eliminarEntrenamiento(entrenamiento._id)"
                class="text-red-500 hover:text-red-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          </ul>
          <p v-else class="text-gray-500 italic text-center">
            No hay entrenamientos registrados.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const nombre = ref('')
const horas = ref(null)
const minutos = ref(null)
const descripcion = ref('')
const entrenamientos = ref([])

// Tasas base (cal/min para persona promedio de 70kg)
const tasasBase = {
  correr: 10,
  'correr rápido': 15,
  caminar: 4,
  'caminar rápido': 6,
  ciclismo: 8,
  'ciclismo intenso': 12,
  pesas: 6,
  yoga: 3,
  boxeo: 12,
  natación: 8,
  'natación intensa': 13,
  baile: 7,
  'baile intenso': 10,
  crossfit: 14
}

const intensidades = {
  suave: 0.7,
  ligera: 0.8,
  moderado: 1.0,
  normal: 1.0,
  fuerte: 1.2,
  intenso: 1.4,
  extremo: 1.7,
  rápido: 1.3,
}

// Calcular calorías ajustadas por perfil
const calcularCalorias = (nombre, descripcion, duracionMin, pesoUsuario = 70) => {
  const key = Object.keys(tasasBase).find(k => nombre.toLowerCase().includes(k))
  const base = key ? tasasBase[key] : 5 // default si no está en la lista

  let factor = 1.0
  const desc = descripcion.toLowerCase()
  for (const palabra in intensidades) {
    if (desc.includes(palabra)) {
      factor = intensidades[palabra]
      break
    }
  }

  // Ajuste por peso: gasto calórico proporcional
  // Fórmula: calorías = base * duracion * factor * (pesoUsuario / 70)
  const calorias = Math.round(base * duracionMin * factor * (pesoUsuario / 70))

  // 🔎 DEBUG
  console.log("🔎 Calculo de calorías:", {
    actividad: nombre,
    claveDetectada: key || "default",
    base,
    descripcion,
    factor,
    duracionMin,
    pesoUsuario,
    calorias
  })

  return calorias
}

// Cargar entrenamientos desde backend
const cargarEntrenamientos = async () => {
  try {
    const response = await axios.get('${import.meta.env.VITE_API_URL}/entrenamientos')
    entrenamientos.value = response.data
  } catch (error) {
    console.error('❌ Error al obtener entrenamientos:', error)
  }
}

// Guardar entrenamiento
const agregarEntrenamiento = async () => {
  try {
    const duracionMin = (horas.value * 60) + minutos.value
    if (!nombre.value || duracionMin <= 0) return

    // Obtener el perfil del usuario desde localStorage
    let pesoUsuario = 70 // default si no hay perfil
    const perfil = localStorage.getItem('perfilUsuario')
    if (perfil) {
      const perfilObj = JSON.parse(perfil)
      if (perfilObj.peso) pesoUsuario = perfilObj.peso
    }

    const calorias = calcularCalorias(nombre.value, descripcion.value, duracionMin, pesoUsuario)

    const nuevo = {
      nombre: nombre.value,
      duracion: duracionMin,
      calorias,
      descripcion: descripcion.value
    }

    await axios.post('${import.meta.env.VITE_API_URL}/entrenamientos', nuevo)
    nombre.value = ''
    horas.value = 0
    minutos.value = 0
    descripcion.value = ''
    await cargarEntrenamientos()
  } catch (error) {
    console.error('❌ Error al agregar entrenamiento:', error)
  }
}

const eliminarEntrenamiento = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/entrenamientos/${id}`);
    entrenamientos.value = entrenamientos.value.filter(e => e._id !== id);
  } catch (err) {
    console.error('❌ Error al eliminar entrenamiento:', err);
  }
};

onMounted(() => {
  cargarEntrenamientos()
})
</script>