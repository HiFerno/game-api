require('dotenv').config(); //variable de entorno .env
const express = require('express'); //framework web para Node.js
const cors = require('cors'); //middleware para habilitar CORS (Cross-Origin Resource Sharing) y permitir que el frontend  pueda hacer solicitudes al backend sin problemas de seguridad relacionados con el mismo origen.
const { sequelize } = require('./models'); //importacion de la instancia de Sequelize para conectar con la base de datos Postgres
const apiRoutes = require('./routes/api'); //importacion de las rutas definidas en el archivo routes/api.js

const app = express(); 
const PORT = process.env.PORT || 3001; //puerto de ejecucion del servidor

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); //


// Rutas
app.use('/api', apiRoutes);

// Iniciar servidor y sincronizar con postgres
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true }); //sincronizar el modelo con la base de datos
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
};

startServer();