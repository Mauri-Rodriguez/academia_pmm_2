// Archivo: src/server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const diagnosticoRoutes = require('./routes/diagnosticoRoutes');

require('dotenv').config();

const path = require('path');
const sequelize = require('./config/database');
const { construirOrigenesPermitidos } = require('./config/origenesCors');
const { validarEntorno } = require('./config/validarEntorno');
const logger = require('./utils/logger');

const authRoutes = require('./routes/authRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const ejercicioRoutes = require('./routes/ejercicioRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
const progresoRoutes = require('./routes/progresoRoutes');

const app = express();

// Railway / proxies: necesario para que express-rate-limit use la IP real del cliente.
// Valor 1 = confiar solo en el primer hop (evita trust proxy permisivo).
app.set('trust proxy', 1);

// === MIDDLEWARES ===

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: false
    })
);

const origenesPermitidos = construirOrigenesPermitidos();

app.use(
    cors({
        origin: function (origin, callback) {
            // Sin Origin (Postman/curl/server-to-server) se permite.
            if (!origin || origenesPermitidos.includes(origin)) {
                callback(null, true);
            } else {
                logger.warn('cors.bloqueado', { origen: origin });
                const error = new Error('Origen no autorizado por CORS');
                error.status = 403;
                error.code = 'CORS_DENIED';
                callback(error);
            }
        },
        // Bearer token: no se usan cookies de sesión.
        credentials: false,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// === ARCHIVOS SUBIDOS ===

// Railway:
// UPLOADS_DIR=/app/pmm-backend/public/uploads
//
// Local/Jest:
// ../public/uploads

const uploadsDir =
    process.env.UPLOADS_DIR ||
    path.join(__dirname, '../public/uploads');

app.use(
    '/uploads',
    express.static(uploadsDir, {
        setHeaders: (res) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
        }
    })
);


// === RUTAS ===

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API de PMM INTERACTIVO 🚀'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/diagnostico', diagnosticoRoutes);
app.use('/api/estudiante', estudianteRoutes);
app.use('/api/docente', docenteRoutes);
app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/progreso', progresoRoutes);

// Errores CORS y demás: respuesta JSON controlada (no 500 genérico).
app.use((err, req, res, next) => {
    if (err.code === 'CORS_DENIED' || err.message === 'Origen no autorizado por CORS') {
        return res.status(403).json({
            mensaje: 'Origen no autorizado por CORS'
        });
    }

    logger.error('http.error', {
        codigo: err.code || err.name,
        detalle: err.message,
        ruta: req.originalUrl
    });

    const status = Number(err.status || err.statusCode) || 500;
    return res.status(status).json({
        mensaje:
            status === 500
                ? 'Error interno del servidor.'
                : err.message || 'Solicitud rechazada.'
    });
});


// === ARRANQUE DEL SERVIDOR ===

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {

    const startServer = async () => {

        try {
            const entorno = validarEntorno();
            if (!entorno.ok) {
                logger.error('arranque.config_incompleta', {
                    faltantes: entorno.faltantes
                });
                process.exitCode = 1;
                process.exit(1);
                return;
            }

            await sequelize.authenticate();
            await sequelize.sync({
                alter: false
            });

            app.listen(PORT, '0.0.0.0', () => {
                logger.info('arranque.ok', {
                    puerto: PORT,
                    uploads: uploadsDir,
                    origenes_cors: origenesPermitidos.length
                });
            });

        } catch (error) {

            logger.error('arranque.fallo', {
                detalle: error.message
            });
            process.exitCode = 1;
            process.exit(1);

        }
    };

    startServer();
}


// === EXPORTACIÓN VITAL PARA JEST ===

module.exports = app;
