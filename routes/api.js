const express = require('express'); //modulo express
const bcrypt = require('bcrypt'); //bcrypt para comparar contraseñas en el login
const jwt = require('jsonwebtoken'); //jsonwebtoken para generar tokens JWT en el login y verificar en rutas protegidas

const { User, UserGame } = require('../models');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

// ----------------------------------------------------------- AUTENTICACIÓN -------------------------------
router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body; //recibimos el username y password del cuerpo de la solicitud
    const user = await User.create({ username, password }); //creamos un nuevo usuario en la base de datos usando el modelo User.
    res.status(201).json({ message: 'Usuario creado exitosamente', userId: user.id });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar usuario', causa: error.message });
  }
});
/*
router.post('/auth/register', async (req, res) => {
  rest.send('llamdo a la ruta de login');
});*/

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } }); //buscamos el usuario por su nombre de usuario en la base de datos usando el modelo User.

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' }); //si el usuario no existe o la contraseña no coincide, respondemos con un error 401 (no autorizado)
    } 

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login correcto', token });
  } catch (error) {
  }
});

/*
router.post('/auth/register', async (req, res) => {
  rest.send('llamdo a la ruta de login');
});*/
//------------------------------------------------------------------------------------------------------------




// --- GESTIÓN DE JUEGOS PROTEGIDA ---
router.post('/my-games', verifyToken, async (req, res) => {
  const { externalGameId } = req.body; //se recibe el id del juego externo desde el frontend
  //guardamos el juego
  const savedGame = await UserGame.create({ userId: req.userId, externalGameId }); //se lamacena en la base de datos el juego asociado al usuario usando el modelo UserGame-- el userId se obtiene del token JWT verificado por el middleware verifyToken.
  res.status(201).json(savedGame); 
});

// GET: Obtener los juegos guardados (con datos completos de la API externa)
router.get('/my-games', verifyToken, async (req, res) => {
  try {
    //se buscan los juegos guardados del usuario en la base de datos usando el modelo UserGame
    const savedGames = await UserGame.findAll({
      where: { userId: req.userId },
      attributes: ['externalGameId']
    });

    const externalIds = savedGames.map(g => g.externalGameId); //se extraen los ids de los juegos externos para luego hacer las peticiones a la API externa y obtener los datos completos de cada juego

    if (externalIds.length === 0) {
      return res.json([]); 
    }

    // 2. Express (Node.js) hace las peticiones a FreeToGame sin bloqueos de CORS
    const gamePromises = externalIds.map(id => 
      fetch(`https://www.freetogame.com/api/game?id=${id}`).then(res => res.json())
    );

    const fullGamesData = await Promise.all(gamePromises); //se espera a que todas las promesas de las peticiones a la API externa se resuelvan y se obtiene un array con los datos completos de cada juego guardado por el usuario.
    // 3. Devolvemos la lista completa al frontend
    res.json(fullGamesData);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los detalles de los juegos' });
  }
});

// DELETE: Eliminar un juego guardado
router.delete('/my-games/:externalGameId', verifyToken, async (req, res) => {
  try {
    const deletedRows = await UserGame.destroy({ 
      where: { 
        userId: req.userId,  //se elimina el juego guardado que coincide con el userId del token verificado y el externalGameId recibido como parámetro en la ruta
        externalGameId: req.params.externalGameId //se elimina el juego guardado que coincide con el userId del token verificado y el externalGameId recibido como parámetro en la ruta
      }
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Juego no encontrado en tu perfil' });
    }
    res.json({ message: 'Juego eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar el juego' });
  }
});

/*
router.delete('/my-games/:externalGameId', async (req, res) => {
  rest.send('llamdo a la ruta delete');
});*/

module.exports = router;