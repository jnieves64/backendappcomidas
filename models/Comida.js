const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comida = sequelize.define('Comida', {
  id_comida: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_comida: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'Comida',
  timestamps: false
});

module.exports = Comida;
