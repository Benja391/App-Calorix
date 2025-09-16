<template>
  <div class="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-center">Registro</h2>

    <form @submit.prevent="submitRegister" novalidate>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 mb-1">Correo electrónico</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border rounded"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-gray-700 mb-1">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 border rounded"
        />
      </div>

      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

      <button
        type="submit"
        class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
      >
        Registrarse
      </button>
    </form>

    <p class="mt-6 text-center text-gray-600">
      ¿Ya tenés cuenta?
      <router-link to="/login" class="text-purple-600 hover:underline">
        Iniciá sesión
      </router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      error: null
    };
  },
  methods: {
    async submitRegister() {
      this.error = null;
      try {
        const { data } = await axios.post('http://localhost:3000/api/users/register', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        this.$router.push('/perfil');
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al registrarse';
      }
    }
  }
};


</script>
