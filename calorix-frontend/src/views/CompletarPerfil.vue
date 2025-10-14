<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative">
    <!-- ✅ Toast flotante visible arriba a la derecha -->
    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed top-6 right-6 bg-[#08a04b] text-white px-6 py-3 rounded-xl shadow-2xl border border-white/10 z-[9999]"
      >
        <p class="font-semibold">Perfil completado correctamente ✅</p>
      </div>
    </transition>

    <div class="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10">
      <h3 class="text-2xl font-bold text-[#08a04b] mb-8 text-center">Completar Perfil</h3>

      <form @submit.prevent="guardarPerfil" class="grid gap-6">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            v-model="perfil.nombre"
            type="text"
            required
            placeholder="Tu nombre"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#08a04b]/50"
          />
        </div>

        <!-- Apellido -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <input
            v-model="perfil.apellido"
            type="text"
            required
            placeholder="Tu apellido"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#08a04b]/50"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="perfil.email"
            type="email"
            required
            placeholder="tucorreo@ejemplo.com"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#08a04b]/50"
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            v-model="perfil.telefono"
            type="tel"
            placeholder="+54 9 11 1234-5678"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#08a04b]/50"
          />
        </div>

        <!-- Botones -->
        <div class="flex flex-col gap-4 mt-4">
          <button
            type="submit"
            class="w-full bg-[#08a04b] text-white font-semibold py-3 rounded-xl hover:bg-[#0aaf57] transition"
          >
            Guardar cambios
          </button>

          <router-link
            to="/miperfil"
            class="text-center text-gray-600 hover:text-[#08a04b] transition"
          >
            ← Volver al perfil
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CompletarPerfil',
  data() {
    return {
      perfil: { nombre: '', apellido: '', email: '', telefono: '' },
      showToast: false
    }
  },
  async mounted() {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    try {
      const { data } = await axios.get(
        `https://app-calorix.onrender.com/api/users/${userId}/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      this.perfil = {
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        email: data.email || '',
        telefono: data.telefono || ''
      }
    } catch (err) {
      console.error('⚠️ Error al cargar perfil:', err)
    }
  },
  methods: {
    async guardarPerfil() {
      const userId = localStorage.getItem('userId')
      const token = localStorage.getItem('token')

      try {
        await axios.put(
          `https://app-calorix.onrender.com/api/users/${userId}/profile`,
          this.perfil,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        // ✅ Mostrar toast y ocultarlo luego de 2 segundos
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
          this.$router.push('/miperfil')
        }, 2000)
      } catch (error) {
        console.error('❌ Error al guardar perfil:', error)
        alert('Ocurrió un error al guardar los cambios')
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
