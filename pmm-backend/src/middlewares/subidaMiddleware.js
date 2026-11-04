const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const logger = require('../utils/logger');

/**
 * @module subidaMiddleware
 * @description Subida de imágenes con validación de firma, recodificación Sharp
 * y nombres generados en servidor. Límite 5 MiB y 4096×4096.
 */

const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, '../../public/uploads');
const extensionesPermitidas = new Set(['.jpeg', '.jpg', '.png', '.webp']);
const mimePermitidos = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_DIMENSION = 4096;

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nombre temporal; se reemplaza tras recodificar con Sharp.
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `tmp_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const nombre = String(file.originalname || '');
        if (nombre.split('.').length > 2) {
            return cb(new Error('No se permiten nombres con doble extensión'));
        }

        const mimetype = mimePermitidos.has(file.mimetype.toLowerCase());
        const extname = extensionesPermitidas.has(
            path.extname(nombre).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
});

const detectarTipoReal = (buffer) => {
    if (
        buffer.length >= 8 &&
        buffer.subarray(0, 8).equals(
            Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
        )
    ) {
        return 'png';
    }

    if (
        buffer.length >= 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff
    ) {
        return 'jpeg';
    }

    if (
        buffer.length >= 12 &&
        buffer.toString('ascii', 0, 4) === 'RIFF' &&
        buffer.toString('ascii', 8, 12) === 'WEBP'
    ) {
        return 'webp';
    }

    return null;
};

const extensionPorTipo = {
    png: '.png',
    jpeg: '.jpg',
    webp: '.webp'
};

const mimePorTipo = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp'
};

async function eliminarSiExiste(ruta) {
    if (!ruta) return;
    await fs.promises.unlink(ruta).catch(() => {});
}

/**
 * Valida firma, decodifica con Sharp, limita dimensiones y recodifica.
 * El nombre y la extensión finales los define el servidor.
 */
upload.validarFirmaImagen = async (req, res, next) => {
    if (!req.file) return next();

    const rutaTemporal = req.file.path;

    try {
        const archivo = await fs.promises.open(rutaTemporal, 'r');
        const cabecera = Buffer.alloc(12);
        let bytesRead = 0;

        try {
            ({ bytesRead } = await archivo.read(cabecera, 0, 12, 0));
        } finally {
            await archivo.close();
        }

        const tipoReal = detectarTipoReal(cabecera.subarray(0, bytesRead));
        const extension = path.extname(req.file.originalname).toLowerCase();
        const mime = req.file.mimetype.toLowerCase();

        const coincide =
            (tipoReal === 'png' && extension === '.png' && mime === 'image/png') ||
            (tipoReal === 'jpeg' && ['.jpg', '.jpeg'].includes(extension) && ['image/jpeg', 'image/jpg'].includes(mime)) ||
            (tipoReal === 'webp' && extension === '.webp' && mime === 'image/webp');

        if (!coincide || !tipoReal) {
            await eliminarSiExiste(rutaTemporal);
            req.file = undefined;
            return res.status(400).json({
                error: 'El contenido del archivo no corresponde a una imagen permitida.'
            });
        }

        let pipeline = sharp(rutaTemporal, { failOn: 'error' }).rotate();
        const metadata = await pipeline.metadata();

        if (
            !metadata.width ||
            !metadata.height ||
            metadata.width > MAX_DIMENSION ||
            metadata.height > MAX_DIMENSION
        ) {
            await eliminarSiExiste(rutaTemporal);
            req.file = undefined;
            return res.status(400).json({
                error: `La imagen supera el máximo de ${MAX_DIMENSION}×${MAX_DIMENSION} píxeles.`
            });
        }

        const nombreFinal = `ninja_media_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${extensionPorTipo[tipoReal]}`;
        const rutaFinal = path.join(uploadDir, nombreFinal);

        pipeline = sharp(rutaTemporal, { failOn: 'error' }).rotate();

        if (tipoReal === 'png') {
            await pipeline.png({ compressionLevel: 8 }).toFile(rutaFinal);
        } else if (tipoReal === 'webp') {
            await pipeline.webp({ quality: 80 }).toFile(rutaFinal);
        } else {
            await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(rutaFinal);
        }

        await eliminarSiExiste(rutaTemporal);

        req.file.filename = nombreFinal;
        req.file.path = rutaFinal;
        req.file.mimetype = mimePorTipo[tipoReal];
        req.file.originalname = nombreFinal;

        next();
    } catch (error) {
        await eliminarSiExiste(rutaTemporal);
        if (req.file?.path && req.file.path !== rutaTemporal) {
            await eliminarSiExiste(req.file.path);
        }
        req.file = undefined;
        logger.error('upload.validacion_fallo', { detalle: error.message });
        return res.status(400).json({
            error: 'No fue posible validar la imagen enviada.'
        });
    }
};

module.exports = upload;
