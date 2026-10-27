/**
 * Limitación de intentos en rutas de autenticación (H-001).
 * Clave: IP (+ correo cuando el body lo trae) para reducir fuerza bruta y abuso.
 */
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const WINDOW_MS = Number(process.env.AUTH_RATE_WINDOW_MS) || 15 * 60 * 1000;
const LOGIN_MAX = Number(process.env.AUTH_RATE_LOGIN_MAX) || 10;
const REGISTER_MAX = Number(process.env.AUTH_RATE_REGISTER_MAX) || 5;
const RECOVERY_MAX = Number(process.env.AUTH_RATE_RECOVERY_MAX) || 5;

const mensajeLimite = {
    mensaje:
        'Demasiados intentos desde esta dirección. Espera unos minutos e inténtalo de nuevo.'
};

/**
 * Combina IP (normalizada) con correo del body cuando existe.
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

function crearLimitadorAuth({ max, skipSuccessfulRequests = false }) {
    return rateLimit({
        windowMs: WINDOW_MS,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        message: mensajeLimite,
        statusCode: 429,
        keyGenerator: claveIpCorreo,
        handler: (req, res) => {
            const retryAfter = res.getHeader('Retry-After');
            res.status(429).json({
                ...mensajeLimite,
                ...(retryAfter != null ? { reintentar_en_segundos: Number(retryAfter) } : {})
            });
        }
    });
}

/** Login / Google: solo cuentan fallos (éxitos no castigan al usuario legítimo). */
const limitarLogin = crearLimitadorAuth({
    max: LOGIN_MAX,
    skipSuccessfulRequests: true
});

/** Registro: todos los intentos (evitar spam de altas). */
const limitarRegistro = crearLimitadorAuth({
    max: REGISTER_MAX,
    skipSuccessfulRequests: false
});

/** Forgot / reset: todos los intentos (abuso de correo y token guessing). */
const limitarRecuperacion = crearLimitadorAuth({
    max: RECOVERY_MAX,
    skipSuccessfulRequests: false
});

module.exports = {
    limitarLogin,
    limitarRegistro,
    limitarRecuperacion,
    WINDOW_MS,
    LOGIN_MAX,
    REGISTER_MAX,
    RECOVERY_MAX
};
