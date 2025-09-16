// models/Comida.js
const mongoose = require('mongoose');

const comidaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  calorias: {
    type: Number,
    default: null,
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comida', comidaSchema);
