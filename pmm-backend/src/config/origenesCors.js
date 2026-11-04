/**
 * Orígenes CORS exactos.
 * Producción: solo CORS_ORIGINS / FRONTEND_URL configurados (oficial: academia-pmm-2.vercel.app).
 * Desarrollo: añade localhost:5173.
 */
function construirOrigenesPermitidos() {
    const desdeEnv = String(process.env.CORS_ORIGINS || '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

    const frontend = String(process.env.FRONTEND_URL || '').trim();
    const origenes = new Set(desdeEnv);

    if (frontend) {
        origenes.add(frontend);
    }

    if (process.env.NODE_ENV !== 'production') {
        origenes.add('http://localhost:5173');
    }

    return [...origenes];
}

module.exports = { construirOrigenesPermitidos };
