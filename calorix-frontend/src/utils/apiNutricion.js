import axios from 'axios'

// Tus credenciales de Nutritionix
const APP_ID = 'c3e0d29b'
const APP_KEY = '03bfae3a3b59bf3eb20d9aa221c7cb6f'

export const obtenerCaloriasDesdeAPI = async (nombreComida) => {
  try {
    const res = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      { query: nombreComida }, // 👈 cuerpo de la request
      {
        headers: {
          'x-app-id': APP_ID,
          'x-app-key': APP_KEY,
          'Content-Type': 'application/json'
        }
      }
    )

    return res.data.foods[0].nf_calories
  } catch (err) {
    console.error('❌ Error consultando Nutritionix:', err.response?.data || err.message)
    return null
  }
}
