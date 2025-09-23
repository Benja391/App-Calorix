const mongoose = require('mongoose');

const comidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  calorias: { type: Number, default: null },
  fecha: { type: Date, default: Date.now },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true } // NUEVO CAMPO
});

module.exports = mongoose.model('Comida', comidaSchema);