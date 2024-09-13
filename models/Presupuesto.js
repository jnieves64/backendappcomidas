const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Presupuesto = sequelize.define('Presupuesto', {
  id_presupuesto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nivel_presupuesto: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'Presupuesto',
  timestamps: false
});

module.exports = Presupuesto;
