<template>
  <div class=" min-h-screen flex items-center justify-center">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
      <!-- Título -->
      <h1 class="text-3xl font-bold mb-6 text-purple-800">
        Registrar Comida
      </h1>

      <!-- Formulario -->
      <form @submit.prevent="agregarComida" class="space-y-5">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
          <input 
            v-model="nombre"
            @blur="buscarCalorias"
            type="text" 
            class="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej: arroz, empanadas, osobuco"
            required 
          />
        </div>

        <!-- Calorías -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">
            Calorías <span class="text-gray-400">(opcional)</span>
          </label>
          <input 
            v-model.number="calorias" 
            type="number" 
            class="border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej: 250"
          />
          <!-- Mensaje de advertencia -->
          <div v-if="mensajeError" class="mt-2 p-3 rounded-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm shadow-sm">
            {{ mensajeError }}
          </div>
        </div>

        <!-- Botón Guardar -->
        <button 
          type="submit" 
          class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
        >
          Guardar
        </button>
      </form>

      <hr class="my-8 border-black" />

      <!-- Lista de comidas -->
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Comidas registradas</h2>
      <ul v-if="comidas.length" class="space-y-3">
        <li 
          v-for="comida in comidas" 
          :key="comida._id" 
          class="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm"
        >
          <span class="text-gray-700 font-medium">
            {{ comida.nombre }} - 
            <span v-if="comida.calorias !== null">{{ comida.calorias }} cal</span>
            <span v-else class="text-gray-400 italic">(sin calorías)</span>
          </span>

          <!-- Botón eliminar -->
          <button 
            @click="eliminarComida(comida._id)" 
            class="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition"
          >
            Eliminar
          </button>
        </li>
      </ul>
      <p v-else class="text-gray-500 italic">No hay comidas registradas.</p>
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
