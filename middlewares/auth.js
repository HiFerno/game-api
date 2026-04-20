const jwt = require('jsonwebtoken');  //importamos el modulo jsonwebtoken para manejar la autenticación con tokens JWT
 

// Middleware para verificar el token JWT en rutas protegidas
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Inyectamos el ID del usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
module.exports = verifyToken;