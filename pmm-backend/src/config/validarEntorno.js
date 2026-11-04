/**
 * Validación de variables de entorno antes del arranque productivo.
 */
function validarEntorno() {
    const esProduccion = process.env.NODE_ENV === 'production';
    const faltantes = [];

    if (!process.env.JWT_SECRET) {
        faltantes.push('JWT_SECRET');
    }

    if (esProduccion) {
        const obligatorias = [
            'FRONTEND_URL',
            'IA_SERVICE_URL',
            'GEMINI_API_KEY',
            'RESEND_API_KEY',
            'GOOGLE_CLIENT_ID',
            'DOMINIOS_DOCENTES'
        ];

        for (const clave of obligatorias) {
            if (!process.env[clave]) {
                faltantes.push(clave);
            }
        }

        const tieneMysqlUrl = Boolean(process.env.MYSQL_URL);
        const tieneDbBloque =
            process.env.DB_HOST &&
            process.env.DB_USER &&
            process.env.DB_PASSWORD &&
            process.env.DB_NAME;

        if (!tieneMysqlUrl && !tieneDbBloque) {
            faltantes.push('MYSQL_URL o DB_HOST/DB_USER/DB_PASSWORD/DB_NAME');
        }

        const origenes = String(process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean);

        if (origenes.length === 0) {
            faltantes.push('CORS_ORIGINS o FRONTEND_URL');
        }
    }

    return {
        ok: faltantes.length === 0,
        faltantes
    };
}

module.exports = { validarEntorno };
