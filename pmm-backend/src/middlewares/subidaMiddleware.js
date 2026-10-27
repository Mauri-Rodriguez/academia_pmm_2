const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * @module subidaMiddleware
 * @description Middleware de Multer para gestionar la subida de archivos de imagen.
 * Limita el tamaño a 5MB y solo permite formatos jpeg, jpg, png y webp.
 */

// Carpeta de almacenamiento de imágenes
const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, '../../public/uploads');
const extensionesPermitidas = new Set(['.jpeg', '.jpg', '.png', '.webp']);
const mimePermitidos = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

// Asegurar que la carpeta exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        cb(
            null,
            `ninja_media_${Date.now()}${path.extname(file.originalname).toLowerCase()}`
        );
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const mimetype = mimePermitidos.has(file.mimetype.toLowerCase());
        const extname = extensionesPermitidas.has(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(
            new Error(
                'Solo se permiten imágenes (jpeg, jpg, png, webp)'
            )
        );
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

upload.validarFirmaImagen = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const archivo = await fs.promises.open(req.file.path, 'r');
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

        if (!coincide) {
            await fs.promises.unlink(req.file.path).catch(() => {});
            req.file = undefined;
            return res.status(400).json({
                error: 'El contenido del archivo no corresponde a una imagen permitida.'
            });
        }

        next();
    } catch (error) {
        await fs.promises.unlink(req.file.path).catch(() => {});
        req.file = undefined;
        console.error('Error validando la firma de imagen:', error);
        return res.status(400).json({
            error: 'No fue posible validar la imagen enviada.'
        });
    }
};

module.exports = upload;
