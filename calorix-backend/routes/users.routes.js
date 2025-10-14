const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'calorix_secret_key';

/* =============================
   Registro de usuario
   ============================= */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si ya existe el email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generar token JWT
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token, userId: newUser._id });
  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

/* =============================
   Login de usuario
   ============================= */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Verificar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error('❌ Error al iniciar sesión:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

/* =============================
   Obtener perfil
   ============================= */
router.get('/:id/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Si el perfil no existe, lo inicializa vacío
    if (!user.profile) {
      user.profile = {};
      await user.save();
    }

    // Generar avatar por defecto si no existe
    if (!user.profile.avatar) {
      user.profile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.profile.nombre || 'User'
      )}`;
    }

    res.json(user.profile);
  } catch (err) {
    console.error('❌ Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

/* =============================
   Crear o actualizar perfil
   ============================= */
router.put('/:id/profile', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, edad, peso, altura, genero, avatar } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user._id.toString() !== req.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Normalizar altura (por si el front la envía en metros)
    let alturaFinal = user.profile?.altura;
    if (altura !== undefined) {
      alturaFinal = altura < 3 ? Math.round(Number(altura) * 100) : Number(altura);
    }

    user.profile = {
      nombre: nombre ?? user.profile?.nombre,
      apellido: apellido ?? user.profile?.apellido,
      email: email ?? user.profile?.email,
      telefono: telefono ?? user.profile?.telefono,
      edad: edad ?? user.profile?.edad,
      peso: peso ?? user.profile?.peso,
      altura: alturaFinal,
      genero: genero ?? user.profile?.genero,
      avatar: avatar ?? user.profile?.avatar,
    };

    await user.save();

    res.json(user.profile);
  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

module.exports = router;
