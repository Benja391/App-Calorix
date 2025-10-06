<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed top-5 right-5 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')

export function showToast(msg) {
  message.value = msg
  visible.value = true
  setTimeout(() => (visible.value = false), 3000)
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
