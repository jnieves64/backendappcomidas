const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoDeComida = sequelize.define('TipoDeComida', {
    id_tipo_comida: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_tipo_comida: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'TipoDeComida',
    timestamps: false
});

module.exports = TipoDeComida;
