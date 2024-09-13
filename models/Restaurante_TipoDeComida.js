const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurante_TipoDeComida = sequelize.define('Restaurante_TipoDeComida', {
    id_restaurante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'Restaurante',
            key: 'id_restaurante'
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
    tableName: 'Restaurante_TipoDeComida',
    timestamps: false
});

module.exports = Restaurante_TipoDeComida;
