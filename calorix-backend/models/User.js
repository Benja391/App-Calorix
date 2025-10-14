const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile: {
    nombre: String,
    apellido: String,     // 👈 NUEVO
    email: String,        // 👈 NUEVO
    telefono: String,     // 👈 NUEVO
    edad: Number,
    peso: Number,
    altura: Number,
    genero: String,
    avatar: String
  }
});

module.exports = mongoose.model('Usuario', userSchema);
