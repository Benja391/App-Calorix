const express = require('express');
const router = express.Router();
const Comida = require('../models/Comida');

// Crear comida
router.post('/', async (req, res) => {
  try {
       console.log('📦 Datos recibidos:', req.body); // <-- Esto
    const nuevaComida = new Comida(req.body);
    const comidaGuardada = await nuevaComida.save();
    res.json(comidaGuardada);
  } catch (error) {
        console.error('❌ Error al guardar comida:', error);
    res.status(500).json({ error: error.message }); 
  }
});

// Obtener todas las comidas
router.get('/', async (req, res) => {
  try {
    const comidas = await Comida.find();
    res.json(comidas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las comidas' });
  }
});

// Actualizar comida por nombre (insensible a mayúsculas)
router.put('/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params
    const { calorias } = req.body

       console.log('✏️ Actualizando comida:', nombre, '→ calorías:', calorias) // 👈 agregado

    const comidaActualizada = await Comida.findOneAndUpdate(
      { nombre: new RegExp(`^${nombre}$`, 'i') }, // 👈 ignora mayúsculas/minúsculas
      { calorias: calorias },
      { new: true }
    )

    if (!comidaActualizada) {
      return res.status(404).json({ error: 'Comida no encontrada' })
    }

    res.json(comidaActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar comida' })
  }
})

// Eliminar comida por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const comidaEliminada = await Comida.findByIdAndDelete(id)

    if (!comidaEliminada) {
      return res.status(404).json({ error: 'Comida no encontrada' })
    }

    res.json({ message: '✅ Comida eliminada', comida: comidaEliminada })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar comida' })
  }
})



module.exports = router;
