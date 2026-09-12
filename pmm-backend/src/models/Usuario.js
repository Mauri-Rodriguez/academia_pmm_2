const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    hash_password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    rol: {
        type: DataTypes.ENUM('estudiante', 'docente', 'administrador'),
        allowNull: false
    },

    foto_perfil: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // --- MÉTRICAS DE GAMIFICACIÓN ---
    rango_actual: {
        type: DataTypes.STRING,
        defaultValue: 'Recluta'
    },

    puntaje_total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    racha_dias: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    // --- AUDITORÍA Y CONTROL ---
    fecha_registro: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },

    ultima_conexion: {
        type: DataTypes.DATE,
        allowNull: true
    },

    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo'
    },

    verificado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    verification_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    verification_token_expiry: {
        type: DataTypes.BIGINT,
        allowNull: true
    },

    reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    reset_token_expiry: {
        type: DataTypes.BIGINT,
        allowNull: true
    },

    // --- CONSENTIMIENTO LEGAL ---
    acepta_politica_privacidad: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    fecha_aceptacion_politica: {
        type: DataTypes.DATE,
        allowNull: true
    },

    version_politica_privacidad: {
        type: DataTypes.STRING(20),
        allowNull: true
    },

    acepta_terminos: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    fecha_aceptacion_terminos: {
        type: DataTypes.DATE,
        allowNull: true
    },

    version_terminos: {
        type: DataTypes.STRING(20),
        allowNull: true
    }

}, {
    tableName: 'usuarios',
    timestamps: false
});

module.exports = Usuario;