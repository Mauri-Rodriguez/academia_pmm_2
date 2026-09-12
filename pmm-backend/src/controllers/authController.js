const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const Usuario = require('../models/Usuario');
const { OAuth2Client } = require('google-auth-library');
const db = require('../config/database');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

if (!resend) {
    console.warn(
        '⚠️ [CONFIG] RESEND_API_KEY no detectada. Modo simulacro activo.'
    );
}

// Versiones actuales de documentos legales
const VERSION_POLITICA = '1.0';
const VERSION_TERMINOS = '1.0';

// ============================================================================
// 1. REGISTRO MANUAL
// ============================================================================

exports.register = async (req, res) => {
    try {
        const {
            nombre_completo,
            correo,
            password,
            acepta_politica_privacidad,
            acepta_terminos,
            version_politica_privacidad,
            version_terminos
        } = req.body;

        // Validaciones básicas
        if (!nombre_completo || !correo || !password) {
            return res.status(400).json({
                mensaje:
                    'Todos los campos obligatorios deben estar completos.'
            });
        }

        if (!correo.includes('@')) {
            return res.status(400).json({
                mensaje: 'Formato de correo inválido.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                mensaje:
                    'La contraseña debe tener mínimo 6 caracteres.'
            });
        }

        // Consentimiento obligatorio
        if (!acepta_politica_privacidad || !acepta_terminos) {
            return res.status(400).json({
                mensaje:
                    'Debes aceptar los Términos y la Política de Privacidad para registrarte.'
            });
        }

        const usuarioExistente = await Usuario.findOne({
            where: { correo }
        });

        if (usuarioExistente) {
            return res.status(400).json({
                mensaje:
                    'El correo ya está registrado en la aldea.'
            });
        }

        // Asignación de rol por dominio
        const dominioUsuario = correo
            .split('@')[1]
            .toLowerCase();

        const dominiosDocente = process.env.DOMINIOS_DOCENTES
            ? process.env.DOMINIOS_DOCENTES
                .split(',')
                .map(d => d.trim().toLowerCase())
            : [];

        const rolAsignado = dominiosDocente.includes(dominioUsuario)
            ? 'docente'
            : 'estudiante';

        // Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);

        const ahora = new Date();

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre_completo,
            correo,
            hash_password,
            rol: rolAsignado,
            verificado: false,
            estado: 'Inactivo',
            fecha_registro: ahora,

            // CONSENTIMIENTO
            acepta_politica_privacidad: true,
            fecha_aceptacion_politica: ahora,
            version_politica_privacidad:
                version_politica_privacidad || VERSION_POLITICA,

            acepta_terminos: true,
            fecha_aceptacion_terminos: ahora,
            version_terminos:
                version_terminos || VERSION_TERMINOS
        });

        // Token de verificación
        const tokenVerificacion = jwt.sign(
            {
                id_usuario: nuevoUsuario.id_usuario
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '48h'
            }
        );

        nuevoUsuario.verification_token = tokenVerificacion;

        nuevoUsuario.verification_token_expiry =
            Date.now() + 172800000;

        await nuevoUsuario.save();

        const urlConfirmacion =
            `${process.env.FRONTEND_URL}/verificar-correo/${tokenVerificacion}`;

        // Correo
        if (resend) {
            try {
                await resend.emails.send({
                    from:
                        'PMM Interactivo <admin@academiapmm.online>',
                    to: correo,
                    subject:
                        'Activa tu cuenta en PMM Interactivo',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <meta
                                name="viewport"
                                content="width=device-width, initial-scale=1.0"
                            >
                        </head>

                        <body style="
                            margin:0;
                            padding:0;
                            background-color:#F1F5F9;
                            font-family:Inter,system-ui,-apple-system,sans-serif;
                        ">

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                style="
                                    background-color:#F1F5F9;
                                    padding:40px 20px;
                                "
                            >
                                <tr>
                                    <td align="center">

                                        <table
                                            width="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            style="
                                                max-width:560px;
                                                background-color:#FFFFFF;
                                                border-radius:24px;
                                                overflow:hidden;
                                                border-top:6px solid #FBE000;
                                            "
                                        >

                                            <tr>
                                                <td
                                                    align="center"
                                                    style="padding:40px 40px 20px 40px;"
                                                >
                                                    <h1 style="
                                                        color:#0A3D62;
                                                        font-size:24px;
                                                        font-weight:800;
                                                        margin:0;
                                                        text-transform:uppercase;
                                                    ">
                                                        PMM
                                                        <span style="color:#FBE000;">
                                                            Interactivo
                                                        </span>
                                                    </h1>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    align="center"
                                                    style="padding:0 40px 30px 40px;"
                                                >

                                                    <h2 style="
                                                        color:#0F172A;
                                                        font-size:20px;
                                                        margin:0 0 16px 0;
                                                    ">
                                                        ¡Bienvenido,
                                                        ${nombre_completo || 'Estudiante'}!
                                                    </h2>

                                                    <p style="
                                                        color:#475569;
                                                        font-size:15px;
                                                        line-height:1.6;
                                                        margin:0 0 24px 0;
                                                        text-align:left;
                                                    ">
                                                        Tu cuenta ha sido creada exitosamente.
                                                        Para comenzar tu ruta de aprendizaje
                                                        y acceder a los recursos de la plataforma,
                                                        es necesario activar tu cuenta.
                                                    </p>

                                                    <a
                                                        href="${urlConfirmacion}"
                                                        style="
                                                            display:inline-block;
                                                            padding:14px 32px;
                                                            color:#FFFFFF;
                                                            background-color:#0A3D62;
                                                            text-decoration:none;
                                                            font-weight:700;
                                                            border-radius:12px;
                                                        "
                                                    >
                                                        Activar mi cuenta
                                                    </a>

                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    align="center"
                                                    style="
                                                        padding:20px 40px 40px 40px;
                                                        border-top:1px solid #E2E8F0;
                                                    "
                                                >
                                                    <p style="
                                                        color:#94A3B8;
                                                        font-size:12px;
                                                        line-height:1.5;
                                                    ">
                                                        Este enlace de activación
                                                        expirará en 48 horas.<br>
                                                        Si no solicitaste esta cuenta,
                                                        puedes ignorar este mensaje.
                                                    </p>
                                                </td>
                                            </tr>

                                        </table>

                                    </td>
                                </tr>
                            </table>

                        </body>
                        </html>
                    `
                });
            } catch (err) {
                console.error(
                    '📧 Fallo envío Resend:',
                    err.message
                );
            }
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `[DEV LOG] Link de verificación para ${correo}: ${urlConfirmacion}`
            );
        }

        return res.status(201).json({
            mensaje:
                'Registro exitoso. Revisa tu correo para activar tu cuenta.',
            rol: rolAsignado
        });

    } catch (error) {
        console.error(
            '🚨 Error en registro:',
            error
        );

        return res.status(500).json({
            mensaje:
                'Error interno al forjar el registro.'
        });
    }
};

// ============================================================================
// 2. VERIFICAR CORREO
// ============================================================================

exports.verificarCorreo = async (req, res) => {
    try {
        const { token } = req.params;

        const usuario = await Usuario.findOne({
            where: {
                verification_token: token
            }
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje:
                    'Token de verificación inválido o ya utilizado.'
            });
        }

        if (
            Date.now() >
            usuario.verification_token_expiry
        ) {
            return res.status(401).json({
                mensaje:
                    'El enlace de activación ha caducado. Solicita uno nuevo.'
            });
        }

        jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        usuario.verificado = true;
        usuario.estado = 'Activo';
        usuario.verification_token = '';
        usuario.verification_token_expiry = null;

        await usuario.save();

        return res.status(200).json({
            mensaje:
                '¡Tu cuenta ha sido activada exitosamente! Ya puedes iniciar sesión.'
        });

    } catch (error) {
        console.error(
            '--- FALLO CRÍTICO DE TOKEN ---'
        );

        console.error(
            error.message
        );

        return res.status(401).json({
            mensaje:
                'Token corrupto o expirado.'
        });
    }
};

// ============================================================================
// 3. LOGIN NORMAL
// ============================================================================

exports.login = async (req, res) => {
    try {
        const {
            correo,
            password
        } = req.body;

        const usuario = await Usuario.findOne({
            where: { correo }
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje:
                    'Credenciales inválidas.'
            });
        }

        if (!usuario.verificado) {
            return res.status(403).json({
                mensaje:
                    'Cuenta no activa. Por favor, verifica tu correo.'
            });
        }

        const esPasswordValido =
            await bcrypt.compare(
                password,
                usuario.hash_password
            );

        if (!esPasswordValido) {
            return res.status(401).json({
                mensaje:
                    'Credenciales inválidas.'
            });
        }

        // ========================================================
        // VERIFICAR SI REALMENTE EXISTE UN DIAGNÓSTICO
        // ========================================================

        const [hasDiag] = await db.query(
            `SELECT id_diagnostico
             FROM diagnostico
             WHERE id_usuario = ?
             LIMIT 1`,
            {
                replacements: [
                    usuario.id_usuario
                ],
                type: db.QueryTypes.SELECT
            }
        );

        const requiereDiagnostico = !hasDiag;

        console.log(
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        );

        console.log(
            '🔐 LOGIN NORMAL'
        );

        console.log(
            '👤 ID USUARIO:',
            usuario.id_usuario
        );

        console.log(
            '📚 TIENE DIAGNÓSTICO:',
            !!hasDiag
        );

        console.log(
            '🎯 REQUIERE DIAGNÓSTICO:',
            requiereDiagnostico
        );

        // ========================================================
        // JWT DE PMM
        // ========================================================

        const token = jwt.sign(
            {
                id_usuario:
                    usuario.id_usuario,
                rol:
                    usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '8h'
            }
        );

        return res.status(200).json({
            mensaje:
                'Inicio de sesión exitoso.',
            token,
            requiereDiagnostico,

            usuario: {
                id_usuario:
                    usuario.id_usuario,

                nombre_completo:
                    usuario.nombre_completo,

                correo:
                    usuario.correo,

                rol:
                    usuario.rol,

                rango:
                    usuario.rango ||
                    usuario.rango_actual
            }
        });

    } catch (error) {
        console.error(
            'Error en Login:',
            error
        );

        return res.status(500).json({
            mensaje:
                'Error interno del servidor.'
        });
    }
};

// ============================================================================
// 4. GOOGLE OAUTH
// ============================================================================

exports.googleLogin = async (req, res) => {
    try {
        const {
            token,
            acepta_politica_privacidad,
            acepta_terminos,
            version_politica_privacidad,
            version_terminos
        } = req.body;

        // ========================================================
        // VALIDAR TOKEN GOOGLE
        // ========================================================

        if (!token) {
            return res.status(400).json({
                mensaje:
                    'Token de Google requerido.'
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience:
                process.env.GOOGLE_CLIENT_ID
        });

        const {
            email,
            name,
            picture
        } = ticket.getPayload();

        if (!email) {
            return res.status(400).json({
                mensaje:
                    'Google no proporcionó un correo válido.'
            });
        }

        const dominioUsuario =
            email
                .split('@')[1]
                ?.toLowerCase();

        const dominiosDocente =
            process.env.DOMINIOS_DOCENTES
                ? process.env.DOMINIOS_DOCENTES
                    .split(',')
                    .map(d =>
                        d.trim().toLowerCase()
                    )
                : [];

        const rolAsignado =
            dominiosDocente.includes(
                dominioUsuario
            )
                ? 'docente'
                : 'estudiante';

        // ========================================================
        // BUSCAR USUARIO
        // ========================================================

        let usuario =
            await Usuario.findOne({
                where: {
                    correo: email
                }
            });

        let esNuevo = false;

        // ========================================================
        // NUEVO USUARIO GOOGLE
        // ========================================================

        if (!usuario) {

            if (
                !acepta_politica_privacidad ||
                !acepta_terminos
            ) {
                return res.status(428).json({
                    codigo:
                        'CONSENTIMIENTO_REQUERIDO',

                    mensaje:
                        'Debes aceptar los Términos y la Política de Privacidad para crear tu cuenta.'
                });
            }

            const ahora =
                new Date();

            usuario =
                await Usuario.create({

                    nombre_completo:
                        name || email,

                    correo:
                        email,

                    rol:
                        rolAsignado,

                    hash_password:
                        'LOGIN_GOOGLE_OAUTH',

                    verificado:
                        true,

                    estado:
                        'Activo',

                    fecha_registro:
                        ahora,

                    ultima_conexion:
                        ahora,

                    foto_perfil:
                        picture || null,

                    // CONSENTIMIENTO

                    acepta_politica_privacidad:
                        true,

                    fecha_aceptacion_politica:
                        ahora,

                    version_politica_privacidad:
                        version_politica_privacidad ||
                        VERSION_POLITICA,

                    acepta_terminos:
                        true,

                    fecha_aceptacion_terminos:
                        ahora,

                    version_terminos:
                        version_terminos ||
                        VERSION_TERMINOS
                });

            esNuevo = true;

            console.log(
                '✅ NUEVO USUARIO GOOGLE CREADO'
            );

            console.log(
                '👤 ID:',
                usuario.id_usuario
            );

            console.log(
                '📧 CORREO:',
                usuario.correo
            );
        }

        // ========================================================
        // ACTUALIZAR ÚLTIMA CONEXIÓN
        // ========================================================

        usuario.ultima_conexion =
            new Date();

        await usuario.save();

        // ========================================================
        // EVALUACIÓN DEL DIAGNÓSTICO
        //
        // IMPORTANTE:
        // NO usamos rango ni rango_actual.
        // Solo importa si existe un registro en diagnostico.
        // ========================================================

        const [hasDiag] =
            await db.query(
                `SELECT id_diagnostico
                 FROM diagnostico
                 WHERE id_usuario = ?
                 LIMIT 1`,
                {
                    replacements: [
                        usuario.id_usuario
                    ],
                    type:
                        db.QueryTypes.SELECT
                }
            );

        const requiereDiagnostico =
            !hasDiag;

        console.log(
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        );

        console.log(
            '🔐 GOOGLE LOGIN'
        );

        console.log(
            '👤 ID USUARIO:',
            usuario.id_usuario
        );

        console.log(
            '📧 CORREO:',
            usuario.correo
        );

        console.log(
            '🆕 USUARIO NUEVO:',
            esNuevo
        );

        console.log(
            '📚 TIENE DIAGNÓSTICO:',
            !!hasDiag
        );

        console.log(
            '🎯 REQUIERE DIAGNÓSTICO:',
            requiereDiagnostico
        );

        // ========================================================
        // CREAR JWT DE PMM
        // ========================================================

        const payloadJWT = {
            id_usuario:
                usuario.id_usuario,

            rol:
                usuario.rol
        };

        const tokenPMM =
            jwt.sign(
                payloadJWT,
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        '8h'
                }
            );

        // ========================================================
        // RESPUESTA
        // ========================================================

        return res.status(200).json({

            mensaje:
                'Sello de Google validado exitosamente.',

            token:
                tokenPMM,

            requiereDiagnostico:

                requiereDiagnostico,

            usuario: {

                id_usuario:
                    usuario.id_usuario,

                nombre_completo:
                    usuario.nombre_completo,

                correo:
                    usuario.correo,

                rol:
                    usuario.rol,

                rango:
                    usuario.rango ||
                    usuario.rango_actual
            }
        });

    } catch (error) {

        console.error(
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        );

        console.error(
            '❌ ERROR GOOGLE LOGIN'
        );

        console.error(
            'TIPO:',
            error.name
        );

        console.error(
            'MENSAJE:',
            error.message
        );

        console.error(
            'STACK:',
            error.stack
        );

        console.error(
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        );

        // Solo errores reales de validación
        // del token de Google reciben 401.

        if (
            error.name ===
                'JsonWebTokenError' ||
            error.name ===
                'TokenExpiredError'
        ) {
            return res.status(401).json({
                mensaje:
                    'El sello de Google no es válido o expiró.'
            });
        }

        return res.status(500).json({
            mensaje:
                'No fue posible iniciar sesión con Google.',
            error:
                process.env.NODE_ENV !==
                'production'
                    ? error.message
                    : undefined
        });
    }
};

// ============================================================================
// 5. RECUPERACIÓN DE CONTRASEÑA
// ============================================================================

exports.forgotPassword = async (req, res) => {
    try {
        const { correo } = req.body;

        const usuario =
            await Usuario.findOne({
                where: { correo }
            });

        // Anti-enumeración
        if (!usuario) {
            return res.status(200).json({
                mensaje:
                    'Si el correo es válido, recibirás instrucciones pronto.'
            });
        }

        const tokenRecuperacion =
            jwt.sign(
                {
                    id_usuario:
                        usuario.id_usuario
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '2h'
                }
            );

        usuario.reset_token =
            tokenRecuperacion;

        usuario.reset_token_expiry =
            Date.now() + 7200000;

        await usuario.save();

        const urlRecuperacion =
            `${process.env.FRONTEND_URL}/reset-password/${tokenRecuperacion}`;

        if (
            process.env.NODE_ENV !==
            'production'
        ) {
            console.log(
                `[DEV LOG] Token de recuperación para ${correo}: ${urlRecuperacion}`
            );
        }

        if (resend) {
            await resend.emails.send({
                from:
                    'Seguridad PMM <admin@academiapmm.online>',

                to:
                    correo,

                subject:
                    'Recuperación de acceso a PMM Interactivo',

                html: `
                    <div style="
                        font-family:sans-serif;
                        text-align:center;
                        padding:20px;
                    ">

                        <h2>
                            Restablecer acceso
                        </h2>

                        <p>
                            Hola ${usuario.nombre_completo},
                            hemos recibido una solicitud
                            para cambiar tu contraseña.
                        </p>

                        <a
                            href="${urlRecuperacion}"
                            style="
                                background:#8B0000;
                                color:white;
                                padding:12px 25px;
                                text-decoration:none;
                                border-radius:5px;
                                display:inline-block;
                                margin-top:15px;
                            "
                        >
                            Restablecer Contraseña
                        </a>

                        <p style="
                            font-size:11px;
                            color:#666;
                            margin-top:20px;
                        ">
                            Este enlace es válido durante 2 horas.
                        </p>

                    </div>
                `
            });
        }

        return res.status(200).json({
            mensaje:
                'Si el correo es válido, recibirás instrucciones pronto.'
        });

    } catch (error) {

        console.error(
            'Error en forgotPassword:',
            error
        );

        return res.status(500).json({
            mensaje:
                'Error interno al procesar recuperación.'
        });
    }
};

// ============================================================================
// 6. RESTABLECER CONTRASEÑA
// ============================================================================

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { nuevaPassword } = req.body;

        const usuario =
            await Usuario.findOne({
                where: {
                    reset_token: token
                }
            });

        if (!usuario) {
            return res.status(401).json({
                mensaje:
                    'Token inválido, ya utilizado o no autorizado.'
            });
        }

        if (
            Date.now() >
            usuario.reset_token_expiry
        ) {
            return res.status(401).json({
                mensaje:
                    'El tiempo del token ha expirado. Solicita uno nuevo.'
            });
        }

        jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const salt =
            await bcrypt.genSalt(10);

        usuario.hash_password =
            await bcrypt.hash(
                nuevaPassword,
                salt
            );

        usuario.reset_token = '';
        usuario.reset_token_expiry = null;

        await usuario.save();

        return res.status(200).json({
            mensaje:
                '¡Contraseña actualizada! Sello restaurado exitosamente.'
        });

    } catch (error) {

        console.error(
            'Error en resetPassword:',
            error.message
        );

        return res.status(401).json({
            mensaje:
                'El enlace de recuperación es inválido o corrupto.'
        });
    }
};