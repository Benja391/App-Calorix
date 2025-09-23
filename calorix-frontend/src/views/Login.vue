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
      Iniciar sesión
    </h2>

    <form @submit.prevent="submitLogin" novalidate>
      <!-- Email -->
      <div class="mb-6">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="w-full px-4 py-2 rounded-lg border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-lime-500
                 focus:border-transparent transition"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <!-- Contraseña -->
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="w-full px-4 py-2 rounded-lg border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-lime-500
                 focus:border-transparent transition"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <!-- Error general -->
      <p v-if="error" class="text-red-500 text-sm mb-4 text-center">{{ error }}</p>

      <!-- Botón -->
      <button
        :disabled="loading"
        type="submit"
        class="w-full py-3 rounded-full font-semibold
               bg-gradient-to-r from-lime-500 to-teal-400
               text-white hover:from-lime-600 hover:to-teal-500
               transition disabled:opacity-50"
      >
        <span v-if="!loading">Entrar</span>
        <span v-else>Cargando…</span>
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-gray-600">
      ¿No tienes cuenta?
      <router-link
        to="/register"
        class="text-purple-600 hover:text-purple-800 hover:underline underline-offset-4 transition"
      >
        Regístrate aquí
      </router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';
import { auth } from '../auth';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null,
      errors: {}
    };
  },
  methods: {
    async submitLogin() {
      this.error = null;
      this.errors = {};

      // Validación previa
      if (!this.email) this.errors.email = 'Este campo es obligatorio';
      if (!this.password) this.errors.password = 'Este campo es obligatorio';
      if (Object.keys(this.errors).length) return;

      this.loading = true;

      try {
        const { data } = await axios.post('http://localhost:3000/api/users/login', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        auth.token = data.token;
        auth.userId = data.userId;

        try {
          await axios.get(`http://localhost:3000/api/users/${data.userId}/profile`, {
            headers: { Authorization: `Bearer ${data.token}` }
          });
          this.$router.push('/comidas');
        } catch (errProfile) {
          this.$router.push(errProfile.response?.status === 404 ? '/perfil' : '/comidas');
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Credenciales inválidas';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
