<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        
        <!-- Cabecera degradada -->
        <div class="h-32 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
          <h1 class="text-3xl font-bold text-white">Mi Perfil</h1>
        </div>

        <!-- Avatar -->
        <div class="flex justify-center mt-4">
          <img
            :src="perfil.avatar && perfil.avatar.trim() !== '' 
              ? perfil.avatar 
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil.nombre || 'User')}`"
            alt="Avatar"
            class="w-32 h-32 rounded-full border-4 border-white object-cover"
            @error="handleImgError"
          />
        </div>  

        <!-- Contenido -->
        <div class="px-6 py-8">
          <!-- Nombre -->
          <h2 class="text-center text-2xl font-bold text-gray-800 mb-4">
            {{ perfil.nombre || '—' }}
          </h2>

          <!-- Grid de datos -->
          <div class="grid grid-cols-2 gap-4 text-gray-600">
            <div class="flex items-center">
              <span class="mr-2 text-purple-500">Edad</span>
              <span>{{ perfil.edad }} años</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2 text-purple-500">Peso</span>
              <span>{{ perfil.peso }} kg</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2 text-purple-500">Altura</span>
              <span>{{ perfil.altura }} cm</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2 text-purple-500">Género</span>
              <span class="capitalize">{{ perfil.genero }}</span>
            </div>
          </div>

          <!-- Botones -->
          <div class="mt-8 flex flex-col items-center gap-4">
            <!-- Botón editar perfil -->
            <router-link
              to="/editar-perfil"
              class="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
            >
              Editar Perfil
            </router-link>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MiPerfil',
  data() {
    return {
      perfil: {
        nombre: '',
        edad: '',
        peso: '',
        altura: '',
        genero: '',
        avatar: '',
        apellido: '',
        email: '',
        telefono: ''
      }
    }
  },
  computed: {
    // Verifica si el perfil tiene todos los datos personales completados
    perfilCompleto() {
      const camposRequeridos = ['nombre', 'apellido', 'email', 'telefono']
      return camposRequeridos.every(campo => this.perfil[campo] && this.perfil[campo].trim() !== '')
    }
  },
  methods: {
    handleImgError(event) {
      event.target.src = 'https://via.placeholder.com/150?text=No+Image'
    }
  },
  async created() {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      this.perfil = data
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      this.$router.push('/perfil')
    }
  }
}
</script>

<style scoped>
/* Estilos opcionales */
</style>
