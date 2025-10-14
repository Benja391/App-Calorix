<template v-cloak>
  <div
    class="max-w-md mx-auto mt-24 px-8 py-10
           bg-gray-50 rounded-2xl shadow-xl border border-lime-300"
  >
    <h2
      class="text-3xl font-extrabold text-center mb-8
             text-transparent bg-clip-text
             bg-gradient-to-r from-purple-600 via-teal-500 to-lime-500"
    >
      Completar perfil
    </h2>

    <form @submit.prevent="submitPerfil">
     

      <!-- Edad -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Edad</label>
        <input
          v-model.number="edad"
          type="number"
          placeholder="Ingrese su edad"
          min="1"
          class="w-full px-4 py-2 rounded-lg border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <p v-if="errors.edad" class="text-red-500 text-sm mt-1">{{ errors.edad }}</p>
      </div>

      <!-- Peso -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
        <input
          v-model.number="peso"
          type="number"
          placeholder="Ingrese su peso"
          step="any"
          min="1"
          class="w-full px-4 py-2 rounded-lg border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <p v-if="errors.peso" class="text-red-500 text-sm mt-1">{{ errors.peso }}</p>
      </div>

      <!-- Altura -->
<div class="mb-6">
  <label class="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
  <input
    v-model.number="altura"
    type="number"
    placeholder="Ej: 174"
    min="100"
    max="250"
    class="w-full px-4 py-2 rounded-lg border border-gray-300
           focus:outline-none focus:ring-2 focus:ring-lime-500"
  />
  <p v-if="errors.altura" class="text-red-500 text-sm mt-1">{{ errors.altura }}</p>
</div>


      <!-- Género -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Género</label>
        <select
          v-model="genero"
          class="w-full px-4 py-2 rounded-lg border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          <option value="">Seleccionar</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
        <p v-if="errors.genero" class="text-red-500 text-sm mt-1">{{ errors.genero }}</p>
      </div>

      <!-- Error general -->
      <p v-if="error" class="text-red-500 text-sm mb-4 text-center">{{ error }}</p>

      <!-- Botón -->
      <button
        type="submit"
        class="w-full py-3 rounded-full font-semibold
               bg-gradient-to-r from-lime-500 to-teal-400
               text-white hover:from-lime-600 hover:to-teal-500
               transition disabled:opacity-50"
      >
        Guardar perfil
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Perfil',
  data() {
    return {
      edad: null,
      peso: null,
      altura: null,
      genero: '',
      error: '',
      errors: {}
    };
  },
  methods: {
   async submitPerfil() {
  this.error = '';
  this.errors = {};

  // Validación previa
  if (!this.edad || this.edad < 1) this.errors.edad = 'Este campo es obligatorio';
  if (!this.peso || this.peso < 1) this.errors.peso = 'Este campo es obligatorio';
  if (!this.altura || this.altura < 100 || this.altura > 250) {
    this.errors.altura = 'La altura debe estar entre 100 y 250 cm';
  }
  if (!this.genero) this.errors.genero = 'Seleccione un género';

  if (Object.keys(this.errors).length) return;

  // 🔹 Normalizar altura (si ponen en metros por error ej: 1.74)
  if (this.altura < 3) {
    this.altura = Math.round(this.altura * 100);
  }

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  try {
   const res = await axios.put(
  `http://localhost:3000/api/users/${userId}/profile`,
  {
    
    edad: this.edad,
    peso: this.peso,
    altura: this.altura,
    genero: this.genero
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

    // Guardar en localStorage
    localStorage.setItem('perfilUsuario', JSON.stringify({
   
      edad: this.edad,
      peso: this.peso,
      altura: this.altura,
      genero: this.genero
    }));

    this.$router.push('/comidas');
  } catch (err) {
    this.error = 'Error al guardar perfil';
    console.error('❌ Error al guardar perfil:', err.response?.data || err.message);
  }
}
  }
};
</script>