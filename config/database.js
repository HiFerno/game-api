require('dotenv').config(); //cargamos las variables de entorno del archivo .env
const { Sequelize } = require('sequelize');  //importamos el modulo sequelize

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, 
  }
);

module.exports = sequelize;