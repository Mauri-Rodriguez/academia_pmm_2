/**
 * Política única de contraseñas (registro y restablecimiento).
 * Mínimo 6 caracteres; máximo 72 bytes UTF-8 (límite real de bcrypt).
 */
const PASSWORD_MIN_CHARS = 6;
const PASSWORD_MAX_BYTES = 72;

/**
 * @param {unknown} password
 * @returns {{ ok: true } | { ok: false, mensaje: string }}
 */
function validarPassword(password) {
    if (typeof password !== 'string' || !password) {
        return {
            ok: false,
            mensaje: 'La contraseña es obligatoria.'
        };
    }

    if (password.length < PASSWORD_MIN_CHARS) {
        return {
            ok: false,
            mensaje: 'La contraseña debe tener mínimo 6 caracteres.'
        };
    }

    if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
        return {
            ok: false,
            mensaje:
                'La contraseña no puede superar 72 bytes en UTF-8 (bcrypt).'
        };
    }

    return { ok: true };
}

module.exports = {
    PASSWORD_MIN_CHARS,
    PASSWORD_MAX_BYTES,
    /** @deprecated usar PASSWORD_MIN_CHARS */
    PASSWORD_MIN: PASSWORD_MIN_CHARS,
    /** @deprecated usar PASSWORD_MAX_BYTES */
    PASSWORD_MAX: PASSWORD_MAX_BYTES,
    validarPassword
};
