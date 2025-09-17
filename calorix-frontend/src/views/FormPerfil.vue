<template  v-cloak>
  <div class="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-center">Completar perfil</h2>

    <form @submit.prevent="submitPerfil">
      <div class="mb-4">
        <label class="block mb-1">Nombre</label>
        <input v-model="nombre" type="text"  placeholder="Ingrese su nombre" class="w-full px-4 py-2 border rounded" required />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Edad</label>
        <input v-model.number="edad" type="number"  placeholder="Ingrese su edad"  class="w-full px-4 py-2 border rounded" min="1" required />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Peso (kg)</label>
        <input 
            v-model.number="peso" 
            type="number" 
            placeholder="Ingrese su peso" 
            step="any" 
            min="1"
            class="w-full px-4 py-2 border rounded"
          />
        </div>

      <div class="mb-4">
        <label class="block mb-1">Altura (cm)</label>
      <input 
          v-model.number="altura" 
          type="number" 
          placeholder="Ingrese su altura"
          step="any"   
          min="1"
          class="w-full px-4 py-2 border rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Género</label>
        <select v-model="genero" class="w-full px-4 py-2 border rounded" required>
          <option value="">Seleccionar</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <p v-if="error" class="text-red-600 mb-3 text-sm">{{ error }}</p>

      <button class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
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
      nombre: '',
      edad: null,
      peso: null,
      altura: null,
      genero: '',
      error: '' // ✅ Manejo de errores
    };
  },
  methods: {
   async submitPerfil() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  console.log('👉 Enviando request al backend');
  console.log('URL:', `http://localhost:3000/api/users/${userId}/profile`);
  console.log('Token:', token);
  console.log('Body:', {
    nombre: this.nombre,
    edad: this.edad,
    peso: this.peso,
    altura: this.altura,
    genero: this.genero
  });

  try {
    const res = await axios.post(
      `http://localhost:3000/api/users/${userId}/profile`,
      {
        nombre: this.nombre,
        edad: this.edad,
        peso: this.peso,
        altura: this.altura,
        genero: this.genero
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('✅ Respuesta del backend:', res.data);
    this.$router.push('/comidas');
  } catch (err) {
    console.error('❌ Error al guardar perfil:', err.response ? err.response.data : err.message);
    alert('Error al guardar perfil');
  }
}
  }
};
</script>
<style scoped></style>