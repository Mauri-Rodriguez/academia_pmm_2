// ============================================================================
// Archivo: src/models/Modulo.js
// Propósito: Representación de la tabla 'Modulos' en MySQL.
// ============================================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Modulo = sequelize.define('Modulo', {
    id_modulo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_modulo: {
        type: DataTypes.STRING,
        allowLength: { args: [3, 100], msg: "El nombre debe ser descriptivo." },
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    nivel: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [[
                    'Genin (Iniciado)',
                    'Chunin (Guerrero)',
                    'Jonin (Maestro)'
                ]],
                msg: 'El nivel debe ser un rango válido de la plataforma.'
            }
        }
    }
}, {
    tableName: 'modulos',
    timestamps: false
});

module.exports = Modulo;