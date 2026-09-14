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

// 🚩 EL CAMBIO VITAL: Si Railway nos da MYSQL_URL, la usamos.
if (process.env.MYSQL_URL) {
    sequelize = new Sequelize(process.env.MYSQL_URL, opcionesSequelize);
} else {
    // Si no estamos en Railway, usa las variables locales de tu .env
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

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos MySQL establecida con éxito.');
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
    }
};

// 🚩 FIX: Solo probar la conexión cuando NO estamos en Jest
//    (evita que el proceso quede colgado en el CI)
if (process.env.NODE_ENV !== 'test') {
    testConnection();
}

module.exports = sequelize;
module.exports.testConnection = testConnection;