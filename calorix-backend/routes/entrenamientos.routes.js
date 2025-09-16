// routes/entrenamientos.js
const express = require('express');
const router = express.Router();
const Entrenamiento = require('../models/entrenamientos');

// Crear
router.post('/', async (req, res) => {
  try {
    const nuevo = new Entrenamiento(req.body);
    const guardado = await nuevo.save();
    res.json(guardado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener
router.get('/', async (req, res) => {
  try {
    const entrenamientos = await Entrenamiento.find();
    res.json(entrenamientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener entrenamientos' });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await Entrenamiento.findByIdAndDelete(req.params.id);
    res.json({ message: "Entrenamiento eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
