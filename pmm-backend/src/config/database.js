const { Sequelize } = require('sequelize');
require('dotenv').config();

// Extraemos tus opciones personalizadas para reutilizarlas
const opcionesSequelize = {
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,

    // CONFIGURACIÓN DE ZONA HORARIA (Colombia UTC-5)
    timezone: '-05:00',
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: '-05:00',
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

let sequelize;

// Si Railway nos da MYSQL_URL, la usamos.
if (process.env.MYSQL_URL) {
    sequelize = new Sequelize(process.env.MYSQL_URL, opcionesSequelize);
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST || 'localhost',
            ...opcionesSequelize
        }
    );
}

// La comprobación de conexión la hace únicamente el arranque en server.js
// (sequelize.authenticate). No ejecutar authenticate aquí para evitar doble check.

module.exports = sequelize;
