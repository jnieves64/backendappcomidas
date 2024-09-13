const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurante = sequelize.define('Restaurante', {
  id_restaurante: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_restaurante: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  id_presupuesto: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Presupuesto',
      key: 'id_presupuesto'
    }
  }
}, {
  tableName: 'Restaurante',
  timestamps: false
});

module.exports = Restaurante;
