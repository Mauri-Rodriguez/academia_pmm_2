/**
 * Logger mínimo con sanitización: no registra tokens, contraseñas,
 * enlaces sensibles ni correos completos.
 */
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const nivelActual = () => {
    const raw = String(process.env.LOG_LEVEL || 'info').toLowerCase();
    return Object.prototype.hasOwnProperty.call(LEVELS, raw) ? LEVELS[raw] : LEVELS.info;
};

const PATRON_SENSIBLE =
    /(Bearer\s+[A-Za-z0-9\-._~+/]+=*|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+|https?:\/\/[^\s]+\/(verificar-correo|reset-password)\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

function sanitizarValor(valor) {
    if (valor == null) return valor;
    if (typeof valor === 'string') {
        return valor.replace(PATRON_SENSIBLE, '[REDACTED]');
    }
    if (typeof valor === 'object') {
        try {
            return JSON.parse(
                JSON.stringify(valor).replace(PATRON_SENSIBLE, '[REDACTED]')
            );
        } catch {
            return '[objeto no serializable]';
        }
    }
    return valor;
}

function enmascararCorreo(correo) {
    const texto = String(correo || '').trim().toLowerCase();
    const at = texto.indexOf('@');
    if (at < 1) return '[correo]';
    const local = texto.slice(0, at);
    const dominio = texto.slice(at + 1);
    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}***@${dominio}`;
}

function escribir(nivel, evento, detalle = {}) {
    if (LEVELS[nivel] > nivelActual()) return;

    const linea = {
        ts: new Date().toISOString(),
        nivel,
        evento,
        ...sanitizarValor(detalle)
    };

    const serializado = JSON.stringify(linea);
    if (nivel === 'error') {
        console.error(serializado);
    } else if (nivel === 'warn') {
        console.warn(serializado);
    } else {
        console.log(serializado);
    }
}

const logger = {
    error: (evento, detalle) => escribir('error', evento, detalle),
    warn: (evento, detalle) => escribir('warn', evento, detalle),
    info: (evento, detalle) => escribir('info', evento, detalle),
    debug: (evento, detalle) => escribir('debug', evento, detalle),
    enmascararCorreo,
    sanitizarValor
};

module.exports = logger;
