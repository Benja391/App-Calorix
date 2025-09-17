<template v-cloak>
  <div class="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
      
      <!-- Cabecera degradada -->
      <div class="h-32 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
        <h1 class="text-3xl font-bold text-white">Registrar Comida</h1>
      </div>
      
      <div class="px-8 py-6 space-y-8">
        <!-- Formulario -->
        <form
          @submit.prevent="agregarComida"
          class="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm space-y-6"
        >
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              v-model="nombre"
              @blur="buscarCalorias"
              type="text"
              required
              placeholder="Ej: arroz, empanadas, osobuco"
              class="w-full border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Calorías <span class="text-gray-400">(opcional)</span>
            </label>
            <input
              v-model.number="calorias"
              type="number"
              placeholder="Ej: 250"
              class="w-full border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div
              v-if="mensajeError"
              class="mt-2 p-3 rounded-lg bg-yellow-100 border-l-4 border-yellow-500
                     text-yellow-700 text-sm shadow-sm"
            >
              {{ mensajeError }}
            </div>
          </div>
  
          <button
            type="submit"
            class="w-full bg-purple-600 text-white py-3 rounded-full
                   hover:bg-purple-700 transition-shadow shadow-md"
          >
            Guardar
          </button>
        </form>
  
        <hr class="border-gray-200" />
  
        <!-- Lista de comidas -->
        <div>
          <h2 class="text-2xl font-semibold text-purple-700 text-center mb-4">
            Comidas registradas
          </h2>
  
          <ul v-if="comidas.length" class="space-y-4">
            <li
              v-for="comida in comidas"
              :key="comida._id"
              class="bg-white border border-gray-200 rounded-lg p-4 flex
                     justify-between items-center shadow-sm"
            >
              <span class="text-gray-800 font-medium">
                {{ comida.nombre }} –
                <span v-if="comida.calorias !== null" class="text-gray-600">
                  {{ comida.calorias }} cal
                </span>
                <span v-else class="text-gray-400 italic">(sin calorías)</span>
              </span>
  
              <button
                @click="eliminarComida(comida._id)"
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
            No hay comidas registradas.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { obtenerCaloriasDesdeAPI } from '../utils/apiNutricion'

// estados reactivos
const nombre = ref('')
const calorias = ref(null)
const comidas = ref([])
const mensajeError = ref('')

// listas locales
const alimentosBase = { 'arroz': 130, 'pollo': 239, 'huevo': 155, 'pan': 265, 'leche': 60 }
const frutasVerduras = { 'manzana': 52, 'banana': 89, 'pera': 57, 'naranja': 47, 'papa': 77 }
const traducciones = { 'osobuco': 'beef shank', 'vacío': 'flank steak', 'fideos': 'pasta' }

// cargar comidas desde backend
const cargarComidas = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/comidas')
    comidas.value = res.data
  } catch (err) {
    console.error('❌ Error al obtener comidas:', err)
  }
}

// buscar calorías
const buscarCalorias = async () => {
  mensajeError.value = '' // limpiar mensaje

  if (!nombre.value || nombre.value.trim() === "") return

  let comida = nombre.value.toLowerCase()

  // listas locales
  if (alimentosBase[comida]) {
    calorias.value = alimentosBase[comida]
    return
  }
  if (frutasVerduras[comida]) {
    calorias.value = frutasVerduras[comida]
    return
  }

  // traducción
  if (traducciones[comida]) {
    comida = traducciones[comida]
  }

  // API
  try {
    const caloriasAPI = await obtenerCaloriasDesdeAPI(`100g ${comida}`)

    if (caloriasAPI && caloriasAPI > 0 && caloriasAPI < 1000) {
      calorias.value = Math.round(caloriasAPI)
    } else {
      throw new Error("Calorías fuera de rango o inválidas")
    }
  } catch (err) {
    calorias.value = null
    mensajeError.value = 'Esto no se puede calcular automáticamente. Intentalo manualmente.'
  }
}

// guardar comida (create/update)
const agregarComida = async () => {
  try {
    if (!nombre.value || nombre.value.trim() === "") {
      mensajeError.value = '⚠️ El nombre es obligatorio'
      return
    }

    // si existe ya sin calorías → actualizar
    const existe = comidas.value.find(c => c.nombre.toLowerCase() === nombre.value.toLowerCase())
    if (existe && existe.calorias === null && calorias.value) {
      await axios.put(`http://localhost:3000/api/comidas/${nombre.value}`, { calorias: calorias.value })
    } else {
      const nueva = { nombre: nombre.value, calorias: calorias.value || null }
      await axios.post('http://localhost:3000/api/comidas', nueva)
    }

    await cargarComidas()

    // limpiar solo si la comida está completa
    if (calorias.value !== null) {
      nombre.value = ''
      calorias.value = null
      mensajeError.value = ''
    }
  } catch (err) {
    console.error('Error al guardar comida:', err)
  }
}

const eliminarComida = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/comidas/${id}`)
    comidas.value = comidas.value.filter(c => c._id !== id)
  } catch (err) {
    console.error('❌ Error al eliminar comida:', err)
  }
}


onMounted(() => {
  cargarComidas()
})
</script>
