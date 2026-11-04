/**
 * Envío de correos de activación y recuperación.
 * Producción: Resend. Desarrollo sin Resend: buzón local (no HTTP).
 */
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const logger = require('../utils/logger');

const BUZON_DIR = path.join(process.cwd(), '.local', 'dev-mailbox');
const BUZON_FILE = path.join(BUZON_DIR, 'messages.jsonl');

let clienteResend = null;

function obtenerResend() {
    if (!process.env.RESEND_API_KEY) return null;
    if (!clienteResend) {
        clienteResend = new Resend(process.env.RESEND_API_KEY);
    }
    return clienteResend;
}

function asegurarBuzon() {
    if (!fs.existsSync(BUZON_DIR)) {
        fs.mkdirSync(BUZON_DIR, { recursive: true });
    }
}

/**
 * Escribe el mensaje completo solo en el buzón local (ignorado por Git).
 * No expone el enlace por console.
 */
function guardarEnBuzonLocal({ tipo, destinatario, asunto, html, enlace }) {
    asegurarBuzon();
    const registro = {
        ts: new Date().toISOString(),
        tipo,
        destinatario_enmascarado: logger.enmascararCorreo(destinatario),
        asunto,
        enlace,
        html
    };
    fs.appendFileSync(BUZON_FILE, `${JSON.stringify(registro)}\n`, 'utf8');
    logger.info('correo.dev_mailbox', {
        tipo,
        destinatario: logger.enmascararCorreo(destinatario),
        resultado: 'guardado_local'
    });
}

/**
 * @param {{ tipo: string, destinatario: string, asunto: string, html: string, enlace?: string }} opts
 */
async function enviarCorreo({ tipo, destinatario, asunto, html, enlace }) {
    const resend = obtenerResend();
    const esProduccion = process.env.NODE_ENV === 'production';

    if (resend) {
        try {
            await resend.emails.send({
                from: 'Seguridad PMM <admin@academiapmm.online>',
                to: destinatario,
                subject: asunto,
                html
            });
            logger.info('correo.enviado', {
                tipo,
                canal: 'resend',
                destinatario: logger.enmascararCorreo(destinatario),
                resultado: 'ok'
            });
            return { ok: true, canal: 'resend' };
        } catch (error) {
            logger.error('correo.fallo', {
                tipo,
                canal: 'resend',
                destinatario: logger.enmascararCorreo(destinatario),
                resultado: 'error',
                detalle: error.message
            });
            if (esProduccion) {
                throw error;
            }
        }
    }

    if (esProduccion) {
        logger.error('correo.sin_proveedor', {
            tipo,
            resultado: 'error',
            detalle: 'RESEND_API_KEY ausente en producción'
        });
        throw new Error('Proveedor de correo no configurado');
    }

    guardarEnBuzonLocal({ tipo, destinatario, asunto, html, enlace });
    return { ok: true, canal: 'dev-mailbox' };
}

module.exports = {
    enviarCorreo,
    BUZON_FILE,
    BUZON_DIR
};
