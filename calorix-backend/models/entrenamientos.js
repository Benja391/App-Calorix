const mongoose = require('mongoose');

const entrenamientoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  duracion: { type: Number, required: true },
  calorias: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true } // NUEVO CAMPO
});

module.exports = mongoose.model('Entrenamiento', entrenamientoSchema);