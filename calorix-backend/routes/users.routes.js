const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'calorix_secret_key';

// Registro
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email ya registrado' });

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generar token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({ token, userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// En routes/routes.users.js
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


// routes/users.js
router.post('/:id/profile', async (req, res) => {
  console.log('📩 Llego al endpoint POST /:id/profile');
  console.log('Params:', req.params);
  console.log('Body recibido:', req.body);

  try {
    const { id } = req.params;
    const { nombre, edad, peso, altura, genero } = req.body;

    const user = await User.findById(id);
    if (!user) {
      console.warn('⚠️ Usuario no encontrado con id:', id);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.profile = { nombre, edad, peso, altura, genero };
    await user.save();

    console.log('✅ Perfil guardado para el usuario:', id);
    res.status(201).json({ message: 'Datos guardados correctamente', profile: user.profile });
  } catch (err) {
    console.error('❌ Error al guardar datos del perfil:', err);
    res.status(500).json({ error: 'Error al guardar los datos del perfil' });
  }
});


module.exports = router;
