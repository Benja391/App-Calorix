const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'calorix_secret_key';

// Middleware para verificar JWT y obtener el ID de usuario
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado: token faltante' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; // adjunta el id del usuario autenticado
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = authMiddleware;