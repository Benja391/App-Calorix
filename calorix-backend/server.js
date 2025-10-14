// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas API
const comidaRoutes = require('./routes/comida.routes');
const userRoutes = require('./routes/users.routes');
const entrenamientoRoutes = require('./routes/entrenamientos.routes');
app.use('/api/comidas', comidaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/entrenamientos', entrenamientoRoutes);

// ✅ Servir el frontend (dist dentro de public)
const __dirnamePath = path.resolve();
app.use(express.static(path.join(__dirnamePath, 'public')));

// Cualquier ruta que no sea API → devuelve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirnamePath, 'public', 'index.html'));
});

// 🚀 Conectar a MongoDB y levantar el server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(3000, () => console.log('🚀 Servidor en http://localhost:3000'));
  })
  .catch((error) => console.error('❌ Error conectando a MongoDB:', error));
