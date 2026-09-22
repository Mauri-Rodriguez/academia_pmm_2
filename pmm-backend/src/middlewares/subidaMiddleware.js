const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * @module subidaMiddleware
 * @description Middleware de Multer para gestionar la subida de archivos de imagen.
 * Limita el tamaño a 5MB y solo permite formatos jpeg, jpg, png y webp.
 */

// Carpeta del Railway Volume
const uploadDir = '/app/pmm-backend/public/uploads';

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
            `ninja_media_${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;

        const mimetype = filetypes.test(file.mimetype);

        const extname = filetypes.test(
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

module.exports = upload;