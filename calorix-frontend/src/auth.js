// src/auth.js
import { reactive } from 'vue';

export const auth = reactive({
  token:  localStorage.getItem('token')  || null,
  userId: localStorage.getItem('userId') || null
});