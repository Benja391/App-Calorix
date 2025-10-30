<template v-cloak>
  <div class="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Cabecera -->
      <div class="h-32 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
        <h1 class="text-3xl font-bold text-white">Registrar Comida</h1>
      </div>

      <div class="px-8 py-6 space-y-8">
        <!-- 🔹 Resumen Nutricional -->
        <div class="mb-4 p-4 bg-gray-50 border border-lime-400 rounded-lg shadow-sm text-center">
          <div v-if="perfilUsuario">
            <div class="mb-2 font-semibold text-gray-800">
              Hoy consumiste <span class="text-purple-600">{{ totalCalorias }}</span> kcal
              de <span class="text-lime-600">{{ requerimientoDiario }}</span> kcal recomendadas.
            </div>
            <div v-if="requerimientoDiario && requerimientoDiario > 0" class="text-sm text-gray-600">
              Eso es un
              <span :class="porcentajeConsumido > 100 ? 'text-red-600 font-bold' : 'text-teal-700'">
                {{ porcentajeConsumido }}
              </span>% de tu requerimiento diario.
            </div>
            <div v-if="porcentajeConsumido > 100" class="mt-2 text-xs text-red-500 font-semibold">
              ⚠️ Has superado tu requerimiento calórico recomendado.
            </div>
          </div>
          <div v-else class="text-gray-500">
            Completa tu perfil para ver tu requerimiento calórico personalizado.
          </div>
        </div>

        <!-- 🔹 Formulario -->
        <form @submit.prevent="agregarComida" class="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              v-model="nombre"
              type="text"
              required
              placeholder="Ej: arroz, empanadas, pollo"
              class="w-full border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <!-- Cantidad -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Cantidad (en gramos o unidades)</label>
            <input
              v-model.number="cantidad"
              type="number"
              required
              placeholder="Ej: 200"
              class="w-full border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <!-- Mensaje -->
          <div v-if="mensajeError" class="p-3 rounded-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm shadow-sm">
            {{ mensajeError }}
          </div>

          <!-- Botón -->
          <button type="submit" class="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition-shadow shadow-md">
            Guardar
          </button>
        </form>

        <hr class="border-gray-200" />

        <!-- 🔹 Lista de comidas -->
        <div>
          <h2 class="text-2xl font-semibold text-purple-700 text-center mb-4">Comidas registradas</h2>
          <ul v-if="comidas.length" class="space-y-4">
            <li
              v-for="comida in comidas"
              :key="comida._id"
              class="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm"
            >
              <span class="text-gray-800 font-medium">
                {{ comida.nombre }} – 
                <span v-if="comida.cantidad" class="text-gray-600">
                  {{ comida.cantidad }}g 
                </span>
                <span v-if="comida.calorias !== null" class="text-gray-500 ml-1">
                  ({{ comida.calorias }} kcal)
                </span>
              </span>
              <button @click="eliminarComida(comida._id)" class="text-red-500 hover:text-red-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </li>
          </ul>
          <p v-else class="text-gray-500 italic text-center">No hay comidas registradas.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { obtenerCaloriasDesdeAPI } from "../utils/apiNutricion";

// ==============================
// ESTADOS REACTIVOS
// ==============================
const nombre = ref("");
const cantidad = ref(null);
const comidas = ref([]);
const mensajeError = ref("");
const perfilUsuario = ref(null);

const token = localStorage.getItem("token");

// ==============================
// BASES DE DATOS LOCALES
// ==============================
const alimentosBase = { arroz: 130, pollo: 239, huevo: 155, pan: 265, leche: 60 };
const frutasVerduras = { manzana: 52, banana: 89, pera: 57, naranja: 47, papa: 77 };
const traducciones = { osobuco: "beef shank", vacío: "flank steak", fideos: "pasta" };

// ==============================
// FUNCIÓN INTELIGENTE PARA CALORÍAS
// ==============================
async function obtenerCaloriasInteligente(nombre) {
  const comida = nombre.toLowerCase();

  // 🔹 1. Buscar en bases locales
  if (alimentosBase[comida]) return alimentosBase[comida];
  if (frutasVerduras[comida]) return frutasVerduras[comida];

  // 🔹 2. Traducción
  const traducida = traducciones[comida] || comida;

  // 🔹 3. API externa
  try {
    const caloriasAPI = await obtenerCaloriasDesdeAPI(`100g ${traducida}`);
    if (caloriasAPI && caloriasAPI > 0 && caloriasAPI < 1000) return caloriasAPI;
  } catch {
    console.warn("⚠️ API no encontró información para:", comida);
  }

  // 🔹 4. Estimaciones heurísticas
  if (comida.includes("empanada")) return 300;
  if (comida.includes("tarta") || comida.includes("pizza")) return 270;
  if (comida.includes("fideo") || comida.includes("pasta")) return 140;
  if (comida.includes("carne") || comida.includes("pollo")) return 230;
  if (comida.includes("pan") || comida.includes("masa")) return 260;
  if (comida.includes("ensalada") || comida.includes("verdura")) return 60;
  if (comida.includes("postre") || comida.includes("dulce")) return 350;

  // 🔹 5. Valor por defecto
  return 200;
}

// ==============================
// CARGAR COMIDAS
// ==============================
const cargarComidas = async () => {
  try {
    const res = await axios.get("${import.meta.env.VITE_API_URL}/comidas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    comidas.value = res.data;
  } catch (err) {
    console.error("❌ Error al obtener comidas:", err);
  }
};

// ==============================
// AGREGAR COMIDA
// ==============================
const agregarComida = async () => {
  try {
    if (!nombre.value.trim()) {
      mensajeError.value = "⚠️ El nombre es obligatorio";
      return;
    }
    if (!cantidad.value || cantidad.value <= 0) {
      mensajeError.value = "⚠️ Ingresá una cantidad válida";
      return;
    }

    const caloriasBase = await obtenerCaloriasInteligente(nombre.value);
    const caloriasTotales = Math.round((cantidad.value / 100) * caloriasBase);

    const nueva = {
      nombre: nombre.value.trim(),
      cantidad: cantidad.value,
      calorias: caloriasTotales,
    };

    const { data } = await axios.post("${import.meta.env.VITE_API_URL}/comidas", nueva, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Actualizamos lista sin duplicar
    const index = comidas.value.findIndex(
      (c) => c.nombre.toLowerCase() === data.nombre.toLowerCase()
    );
    if (index !== -1) comidas.value[index] = data;
    else comidas.value.push(data);

    // Limpiar
    nombre.value = "";
    cantidad.value = null;
    mensajeError.value = "";

  } catch (err) {
    console.error("❌ Error al guardar comida:", err);
    mensajeError.value = "No se pudo guardar la comida. Verificá tu sesión.";
  }
};

// ==============================
// ELIMINAR COMIDA
// ==============================
const eliminarComida = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/comidas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    comidas.value = comidas.value.filter((c) => c._id !== id);
  } catch (err) {
    console.error("❌ Error al eliminar comida:", err);
  }
};

// ==============================
// CÁLCULOS NUTRICIONALES
// ==============================
const totalCalorias = computed(() =>
  comidas.value.reduce((acc, c) => acc + (c.calorias || 0), 0)
);

function calcularRequerimientoDiario(perfil) {
  if (!perfil || !perfil.peso || !perfil.altura || !perfil.edad || !perfil.genero) return 0;
  let tmb =
    perfil.genero === "masculino"
      ? 10 * perfil.peso + 6.25 * perfil.altura - 5 * perfil.edad + 5
      : 10 * perfil.peso + 6.25 * perfil.altura - 5 * perfil.edad - 161;
  return Math.round(tmb * 1.4);
}

const requerimientoDiario = computed(() =>
  perfilUsuario.value ? calcularRequerimientoDiario(perfilUsuario.value) : 0
);

const porcentajeConsumido = computed(() => {
  if (!requerimientoDiario.value) return 0;
  return Math.round((totalCalorias.value / requerimientoDiario.value) * 100);
});

// ==============================
// PERFIL DEL USUARIO
// ==============================
function cargarPerfil() {
  const perfil = localStorage.getItem("perfil");
  perfilUsuario.value = perfil ? JSON.parse(perfil) : null;
}

// ==============================
// CICLO DE VIDA
// ==============================
onMounted(() => {
  cargarPerfil();
  cargarComidas();
});
</script>
