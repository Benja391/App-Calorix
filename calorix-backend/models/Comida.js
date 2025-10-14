const mongoose = require('mongoose');

const comidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true }, // 👈 NUEVO
  calorias: { type: Number, default: null },
  fecha: { type: Date, default: Date.now },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Comida', comidaSchema);
