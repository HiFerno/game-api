//MODELO DE USUARIOS Y JUEGOS FAVORITOS

const { DataTypes } = require('sequelize'); //modulo DataTypes de sequelize para definir los tipos de datos de los modelos
const sequelize = require('../config/database'); //importamos la instancia de sequelize configurada en config/database.js para usarla en la definición de los modelos
const bcrypt = require('bcrypt'); //hasheo de contraseñas de forma segura. La usaremos para proteger las contraseñas de los usuarios antes de almacenarlas en la base de datos.

//DENFINICIÓN DE MODELOS

//-------USUARIOS---------
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
});


//-------JUEGOS FAVORITOS DE USUARIOS---------
const UserGame = sequelize.define('UserGame', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  externalGameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});


User.hasMany(UserGame, { foreignKey: 'userId', as: 'games' });
UserGame.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, UserGame, sequelize };