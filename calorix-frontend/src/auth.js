// src/auth.js
import { reactive } from 'vue';

export const auth = reactive({
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
  perfil: JSON.parse(localStorage.getItem('perfil') || '{}')   // 🔹 acá guardamos el perfil
});

// 🔹 Función para verificar expiración del token
export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // exp viene en segundos
    return Date.now() > exp;
  } catch (err) {
    console.warn("⚠️ No se pudo decodificar el token:", err);
    return true; // si falla, consideramos token inválido
  }
}
