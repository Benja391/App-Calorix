const express = require('express');
const router = express.Router();
const Comida = require('../models/Comida');
const authMiddleware = require('../middleware/auth');

// ==============================
// 🔹 CREAR O ACTUALIZAR COMIDA
// ==============================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, cantidad, calorias } = req.body;
    const userId = req.userId;

    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    if (!cantidad || cantidad <= 0)
      return res.status(400).json({ error: 'La cantidad debe ser mayor que cero' });

    // Normalizamos el nombre
    const nombreNormalizado = nombre.toLowerCase().trim();

    // Buscamos si ya existe esa comida para el usuario
    let existente = await Comida.findOne({ nombre: nombreNormalizado, usuario: userId });

    if (existente) {
      // Si ya existe, actualizamos calorías y cantidad
      existente.cantidad = cantidad;
      existente.calorias = calorias ?? existente.calorias ?? null;
      existente.fecha = new Date();
      await existente.save();
      return res.json(existente);
    }

    // Si no existe, la creamos
    const nueva = new Comida({
      nombre: nombreNormalizado,
      cantidad,
      calorias: calorias ?? null,
      usuario: userId,
    });

    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    console.error('❌ Error al guardar comida:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==============================
// 🔹 OBTENER TODAS LAS COMIDAS DEL USUARIO
// ==============================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const comidas = await Comida.find({ usuario: userId }).sort({ fecha: -1 });
    res.json(comidas);
  } catch (err) {
    console.error('❌ Error al obtener comidas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==============================
// 🔹 ACTUALIZAR COMIDA POR NOMBRE
// ==============================
router.put('/:nombre', authMiddleware, async (req, res) => {
  try {
    const { nombre } = req.params;
    const { cantidad, calorias } = req.body;
    const userId = req.userId;

    console.log(`✏️ Actualizando comida "${nombre}" → ${cantidad || '?'}g / ${calorias || '?'} kcal`);

    const comidaActualizada = await Comida.findOneAndUpdate(
      { nombre: new RegExp(`^${nombre}$`, 'i'), usuario: userId },
      { cantidad, calorias, fecha: new Date() },
      { new: true }
    );

    if (!comidaActualizada)
      return res.status(404).json({ error: 'Comida no encontrada' });

    res.json(comidaActualizada);
  } catch (error) {
    console.error('❌ Error al actualizar comida:', error);
    res.status(500).json({ error: 'Error al actualizar comida' });
  }
});

// ==============================
// 🔹 ELIMINAR COMIDA POR ID
// ==============================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comidaEliminada = await Comida.findOneAndDelete({ _id: id, usuario: userId });
    if (!comidaEliminada)
      return res.status(404).json({ error: 'Comida no encontrada' });

    res.json({ message: '✅ Comida eliminada', comida: comidaEliminada });
  } catch (error) {
    console.error('❌ Error al eliminar comida:', error);
    res.status(500).json({ error: 'Error al eliminar comida' });
  }
});

module.exports = router;
