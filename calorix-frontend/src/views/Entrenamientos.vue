<template>
  <div class="p-6 max-w-2xl mx-auto">
    <!-- Formulario -->
    <form @submit.prevent="agregarEntrenamiento" 
          class="space-y-4 bg-white/80 shadow-lg rounded-xl p-6 border border-gray-200">
      
      <h1 class="text-3xl font-bold mb-6 text-purple-800">Registrar Entrenamiento</h1>

      <!-- Nombre -->
      <div>
        <label class="block font-medium text-gray-700 mb-1">Nombre del entrenamiento:</label>
        <input 
          v-model="nombre"
          type="text"
          class="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Ej: correr, natación, ciclismo"
          required 
        />
      </div>

        <!-- Duración flexible -->
<div>
  <label class="block font-medium text-gray-700 mb-2">Duración:</label>
  <div class="flex space-x-4">
    <!-- Horas -->
    <div class="flex-1">
      <label class="block text-sm text-gray-600 mb-1">Horas</label>
      <input 
        v-model.number="horas"
        type="number"
        min="0"
        class="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        placeholder="Ej: 1"
      />
    </div>

    <!-- Minutos -->
    <div class="flex-1">
      <label class="block text-sm text-gray-600 mb-1">Minutos</label>
      <input 
        v-model.number="minutos"
        type="number"
        min="0"
        max="59"
        class="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        placeholder="Ej: 30"
      />
    </div>
  </div>
</div>

      <!-- Descripción -->
      <div>
        <label class="block font-medium text-gray-700 mb-1">Descripción / Intensidad:</label>
        <textarea 
          v-model="descripcion"
          rows="2"
          class="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Ej: entrenamiento suave, natación intensa, correr rápido..."
        ></textarea>
      </div>

      <!-- Botón -->
      <button 
        type="submit" 
        class="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition font-medium shadow-md w-full"
      >
        Agregar
      </button>
    </form>

    <hr class="my-8 border-black" />

    <!-- Lista de entrenamientos -->
<h2 class="text-2xl font-semibold mb-4 text-purple-700">📋 Entrenamientos registrados</h2>
<ul v-if="entrenamientos.length" class="space-y-3">
  <li 
    v-for="entrenamiento in entrenamientos" 
    :key="entrenamiento._id" 
    class="bg-white/80 shadow p-4 rounded-lg border border-gray-200 flex justify-between items-center"
  >
    <span class="font-medium">
      🏋️ {{ entrenamiento.nombre }}  
      <span class="text-gray-500">
        ({{ entrenamiento.duracion }} min - {{ entrenamiento.calorias }} cal)
      </span>
    </span>

    <!-- Botón eliminar -->
    <button 
      @click="eliminarEntrenamiento(entrenamiento._id)" 
      class="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition"
    >
      Eliminar
    </button>
  </li>
</ul>
<p v-else class="text-gray-600 italic">No hay entrenamientos registrados.</p>
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

// Factores por intensidad detectada en la descripción
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

// Calcular calorías
const calcularCalorias = (nombre, descripcion, duracionMin) => {
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

  const calorias = Math.round(base * duracionMin * factor)

  // 🔎 DEBUG: mostramos cómo se calculó
  console.log("🔎 Calculo de calorías:", {
    actividad: nombre,
    claveDetectada: key || "default",
    base,
    descripcion,
    factor,
    duracionMin,
    calorias
  })

  return calorias
}

// Cargar entrenamientos desde backend
const cargarEntrenamientos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/entrenamientos')
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

    const calorias = calcularCalorias(nombre.value, descripcion.value, duracionMin)

    const nuevo = {
      nombre: nombre.value,
      duracion: duracionMin,
      calorias,
      descripcion: descripcion.value
    }

    await axios.post('http://localhost:3000/api/entrenamientos', nuevo)
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
    await axios.delete(`http://localhost:3000/api/entrenamientos/${id}`);
    entrenamientos.value = entrenamientos.value.filter(e => e._id !== id);
  } catch (err) {
    console.error('❌ Error al eliminar entrenamiento:', err);
  }
};

onMounted(() => {
  cargarEntrenamientos()
})
</script>
