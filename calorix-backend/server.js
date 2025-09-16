// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Importar rutas
const comidaRoutes = require('./routes/comida.routes');
const userRoutes = require('./routes/users.routes');
const entrenamientoRoutes = require('./routes/entrenamientos.routes');
app.use('/api/comidas', comidaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/entrenamientos', entrenamientoRoutes);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(3000, () => console.log('🚀 Servidor en http://localhost:3000'));
  })
  .catch((error) => console.error('❌ Error conectando a MongoDB:', error));
