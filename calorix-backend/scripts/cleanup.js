const mongoose = require('mongoose');
require('dotenv').config();

const Comida = require('../models/Comida');
const Entrenamiento = require('../models/entrenamientos');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Elimina comidas sin usuario
  const resComidas = await Comida.deleteMany({ usuario: { $exists: false } });
  console.log(`Comidas eliminadas: ${resComidas.deletedCount}`);

  // Elimina entrenamientos sin usuario
  const resEntrenamientos = await Entrenamiento.deleteMany({ usuario: { $exists: false } });
  console.log(`Entrenamientos eliminados: ${resEntrenamientos.deletedCount}`);

  mongoose.disconnect();
});