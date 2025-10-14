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

// SERVIR EL FRONTEND (importantísimo en Render)
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🚀 Conectar a MongoDB y levantar el server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch((error) => console.error('❌ Error conectando a MongoDB:', error));
