const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comida_TipoDeComida = sequelize.define('Comida_TipoDeComida', {
  id_comida: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Comida',
      key: 'id_comida'
    }
  },
  id_tipo_comida: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'TipoDeComida',
      key: 'id_tipo_comida'
    }
  }
}, {
  tableName: 'Comida_TipoDeComida',
  timestamps: false
});

module.exports = Comida_TipoDeComida;
