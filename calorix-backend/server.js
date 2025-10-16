// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ===========================
// 📦 Importar rutas del backend
// ===========================
const comidaRoutes = require('./routes/comida.routes');
const userRoutes = require('./routes/users.routes');
const entrenamientoRoutes = require('./routes/entrenamientos.routes');

app.use('/api/comidas', comidaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/entrenamientos', entrenamientoRoutes);

// ===========================
// 🧱 Servir el frontend (Vue build)
// ===========================

// 🟢 Ruta al build generado por Vite
const frontendPath = path.join(__dirname, '../calorix-frontend/dist');

// 🟢 Servir archivos estáticos del frontend
app.use(express.static(frontendPath));

// 🟢 Redirigir cualquier ruta desconocida (Vue Router)
app.get('/*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ===========================
// 🚀 Conectar a MongoDB y levantar el servidor
// ===========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch((error) => console.error('❌ Error conectando a MongoDB:', error));
