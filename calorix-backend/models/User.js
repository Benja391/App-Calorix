const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile: {
    nombre: String,
    edad: Number,
    peso: Number,
    altura: Number,
    genero: String,
    avatar: String // <--- NUEVO CAMPO
  }
});

module.exports = mongoose.model('Usuario', userSchema);