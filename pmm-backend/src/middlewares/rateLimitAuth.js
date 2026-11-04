/**
 * Limitación de frecuencia (auth + operaciones costosas).
 * Clave: IP (+ correo en auth; + id_usuario en rutas autenticadas).
 */
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const WINDOW_MS = Number(process.env.AUTH_RATE_WINDOW_MS) || 15 * 60 * 1000;
const LOGIN_MAX = Number(process.env.AUTH_RATE_LOGIN_MAX) || 10;
const REGISTER_MAX = Number(process.env.AUTH_RATE_REGISTER_MAX) || 5;
const RECOVERY_MAX = Number(process.env.AUTH_RATE_RECOVERY_MAX) || 5;
const TUTOR_MAX = Number(process.env.RATE_TUTOR_MAX) || 20;
const UPLOAD_MAX = Number(process.env.RATE_UPLOAD_MAX) || 10;
const REPORTE_WINDOW_MS =
    Number(process.env.RATE_REPORTE_WINDOW_MS) || 10 * 60 * 1000;
const REPORTE_MAX = Number(process.env.RATE_REPORTE_MAX) || 5;

const mensajeLimite = {
    mensaje:
        'Demasiados intentos desde esta dirección. Espera unos minutos e inténtalo de nuevo.'
};

/**
 * @param {import('express').Request} req
 * @returns {string}
 */
function claveIpCorreo(req) {
    const ipClave = ipKeyGenerator(req.ip);
    const correo = String(req.body?.correo || '')
        .trim()
        .toLowerCase();
    return correo ? `${ipClave}:${correo}` : ipClave;
}

/**
 * @param {import('express').Request} req
 * @returns {string}
 */
function claveIpUsuario(req) {
    const ipClave = ipKeyGenerator(req.ip);
    const id = req.usuario?.id_usuario || req.user?.id_usuario || 'anon';
    return `${ipClave}:u${id}`;
}

function crearLimitador({
    windowMs,
    max,
    keyGenerator,
    skipSuccessfulRequests = false
}) {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        message: mensajeLimite,
        statusCode: 429,
        keyGenerator,
        handler: (req, res) => {
            const retryAfter = res.getHeader('Retry-After');
            res.status(429).json({
                ...mensajeLimite,
                ...(retryAfter != null
                    ? { reintentar_en_segundos: Number(retryAfter) }
                    : {})
            });
        }
    });
}

const limitarLogin = crearLimitador({
    windowMs: WINDOW_MS,
    max: LOGIN_MAX,
    keyGenerator: claveIpCorreo,
    skipSuccessfulRequests: true
});

const limitarRegistro = crearLimitador({
    windowMs: WINDOW_MS,
    max: REGISTER_MAX,
    keyGenerator: claveIpCorreo
});

const limitarRecuperacion = crearLimitador({
    windowMs: WINDOW_MS,
    max: RECOVERY_MAX,
    keyGenerator: claveIpCorreo
});

/** Tutor IA: 20 / 15 min por usuario e IP. */
const limitarTutorIA = crearLimitador({
    windowMs: WINDOW_MS,
    max: TUTOR_MAX,
    keyGenerator: claveIpUsuario
});

/** Uploads: 10 / 15 min por usuario e IP. */
const limitarUploads = crearLimitador({
    windowMs: WINDOW_MS,
    max: UPLOAD_MAX,
    keyGenerator: claveIpUsuario
});

/** Reportes docente/Excel: 5 / 10 min por docente e IP. */
const limitarReportesDocente = crearLimitador({
    windowMs: REPORTE_WINDOW_MS,
    max: REPORTE_MAX,
    keyGenerator: claveIpUsuario
});

module.exports = {
    limitarLogin,
    limitarRegistro,
    limitarRecuperacion,
    limitarTutorIA,
    limitarUploads,
    limitarReportesDocente,
    WINDOW_MS,
    LOGIN_MAX,
    REGISTER_MAX,
    RECOVERY_MAX,
    TUTOR_MAX,
    UPLOAD_MAX,
    REPORTE_MAX
};
