<template>
  <div class="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>

    <form @submit.prevent="submitLogin" novalidate>
      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="block text-gray-700 mb-1">Correo electrónico</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <!-- Contraseña -->
      <div class="mb-4">
        <label for="password" class="block text-gray-700 mb-1">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          minlength="6"
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <!-- Error -->
      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

      <!-- Botón -->
      <button
        :disabled="loading"
        type="submit"
        class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
      >
        <span v-if="!loading">Entrar</span>
        <span v-else>Cargando…</span>
      </button>
    </form>

    <!-- Enlace a registro -->
    <p class="mt-6 text-center text-gray-600">
      ¿No tienes cuenta?
      <router-link to="/register" class="text-purple-600 hover:underline">
        Regístrate aquí
      </router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null
    };
  },
  methods: {
    async submitLogin() {
      this.error = null;
      this.loading = true;

      try {
        const { data } = await axios.post('http://localhost:3000/api/users/login', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);

        // Redirige al formulario de perfil si es la primera vez,
        // o a Comidas si ya completó perfil
        this.$router.push('/perfil');
      } catch (err) {
        this.error =
          err.response?.data?.error ||
          'Ocurrió un error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>


