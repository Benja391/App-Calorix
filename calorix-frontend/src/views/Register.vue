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
      Registro
    </h2>

    <form @submit.prevent="submitRegister" novalidate>
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
        type="submit"
        class="w-full py-3 rounded-full font-semibold
               bg-gradient-to-r from-lime-500 to-teal-400
               text-white hover:from-lime-600 hover:to-teal-500
               transition disabled:opacity-50"
      >
        Registrarse
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-gray-600">
      ¿Ya tenés cuenta?
      <router-link
        to="/login"
        class="text-purple-600 hover:text-purple-800 hover:underline underline-offset-4 transition"
      >
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
      error: null,
      errors: {}
    };
  },
  methods: {
    async submitRegister() {
      this.error = null;
      this.errors = {};

      // Validación previa
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) this.errors.email = 'Este campo es obligatorio';
      else if (!emailRegex.test(this.email)) this.errors.email = 'Correo inválido';

      if (!this.password) this.errors.password = 'Este campo es obligatorio';
      else if (this.password.length < 8) this.errors.password = 'Mínimo 8 caracteres';

      if (Object.keys(this.errors).length) return;

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
