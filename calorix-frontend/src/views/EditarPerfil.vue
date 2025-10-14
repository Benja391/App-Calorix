<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        
        <!-- Cabecera degradada -->
        <div class="h-32 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
          <h1 class="text-3xl font-bold text-white">Editar Perfil</h1>
        </div>

        <!-- Formulario -->
        <div class="px-6 py-8">
          <form @submit.prevent="guardarPerfil" class="space-y-6">
            
           

            <!-- Edad -->
            <div>
              <label class="block text-sm font-semibold text-gray-700">Edad</label>
              <input
                v-model.number="perfil.edad"
                type="number"
                min="0"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <!-- Peso -->
            <div>
              <label class="block text-sm font-semibold text-gray-700">Peso (kg)</label>
              <input
                v-model.number="perfil.peso"
                type="number"
                min="0"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <!-- Altura -->
            <div>
              <label class="block text-sm font-semibold text-gray-700">Altura (cm)</label>
               <input
  v-model.number="perfil.altura"
  type="number"
  min="50"
  max="250"
  placeholder="Ej: 174"
  class="w-full border border-gray-300 rounded-lg px-4 py-2
         focus:outline-none focus:ring-2 focus:ring-purple-500"
/>

            </div>

            <!-- Género -->
            <div>
              <label class="block text-sm font-semibold text-gray-700">Género</label>
              <select
                v-model="perfil.genero"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Seleccione...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

         

            <!-- Botón guardar -->
            <button
              type="submit"
              class="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditarPerfil",
  data() {
    return {
      perfil: {
        edad: "",
        peso: "",
        altura: "",
        genero: "",
       
      }
    };
  },
 async created() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/users/${userId}/profile`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("📌 Datos recibidos en EditarPerfil:", data);

    // Si tu backend devuelve el perfil directamente
    this.perfil = data;

    // Si devuelve algo como { user: { ... } }, entonces:
    // this.perfil = data.user;

  } catch (err) {
    console.error("❌ Error al cargar perfil:", err);
  }
},
  methods: {
    async guardarPerfil() {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      try {
        await axios.put(
          `http://localhost:3000/api/users/${userId}/profile`,
          this.perfil,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 🔹 Actualizar en localStorage
        localStorage.setItem("perfilUsuario", JSON.stringify(this.perfil));

        this.$router.push("/miperfil"); // volver a MiPerfil
      } catch (err) {
        console.error("❌ Error al guardar perfil:", err);
      }
    }
  }
};
</script>
