const mongoose = require('mongoose');
require('dotenv').config();
const Comida = require('../models/Comida');
const Entrenamiento = require('../models/entrenamientos'); 
const Usuario = require('../models/User'); // importa el modelo de usuario

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // 🔹 Elimina comidas sin usuario
    const resComidas = await Comida.deleteMany({ usuario: { $exists: false } });
    console.log(`Comidas eliminadas: ${resComidas.deletedCount}`);

    // 🔹 Elimina entrenamientos sin usuario
    const resEntrenamientos = await Entrenamiento.deleteMany({ usuario: { $exists: false } });
    console.log(`Entrenamientos eliminados: ${resEntrenamientos.deletedCount}`);

    // 🔹 Mostrar todos los usuarios
    const usuarios = await Usuario.find({});
    console.log("\nUsuarios actuales en la base:");
    usuarios.forEach(u => {
      console.log(`- ID: ${u._id} | Nombre: ${u.nombre} | Email: ${u.email}`);
    });

    // 🔹 Mostrar todos los entrenamientos
    const entrenamientos = await Entrenamiento.find({});
    console.log("\nEntrenamientos actuales en la base:");
    entrenamientos.forEach(e => {
      console.log(`- ID: ${e._id} | Actividad: ${e.actividad} | Calorías: ${e.calorias} | Usuario: ${e.usuario || "Sin usuario"}`);
    });

    // 🔹 Mostrar todas las comidas
    const comidas = await Comida.find({});
    console.log("\nComidas actuales en la base:");
    comidas.forEach(c => {
      console.log(`- ID: ${c._id} | Nombre: ${c.nombre} | Calorías: ${c.calorias} | Usuario: ${c.usuario || "Sin usuario"}`);
    });

   

  } catch (err) {
    console.error("Error en la limpieza:", err);
  } finally {
    mongoose.disconnect();
  }
});
