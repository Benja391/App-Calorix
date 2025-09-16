// models/Entrenamiento.js
const mongoose = require('mongoose');

const entrenamientoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },  // Ej: "Cardio"
  duracion: { type: Number, required: true }, // en minutos
  calorias: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entrenamiento', entrenamientoSchema);
