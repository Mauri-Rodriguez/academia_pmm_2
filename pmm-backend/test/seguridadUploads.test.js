const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('supertest');
const sharp = require('sharp');

const DIRECTORIO_TEMPORAL = fs.mkdtempSync(
  path.join(os.tmpdir(), 'pmm-upload-seguridad-')
);
process.env.UPLOADS_DIR = DIRECTORIO_TEMPORAL;

const upload = require('../src/middlewares/subidaMiddleware');

function crearApp() {
  const app = express();
  app.post(
    '/upload',
    (req, res, next) => {
      upload.single('imagen')(req, res, (error) => {
        if (error) {
          return res.status(400).json({ error: error.message });
        }
        return next();
      });
    },
    upload.validarFirmaImagen,
    (req, res) => {
      res.status(200).json({
        filename: req.file.filename,
        mimetype: req.file.mimetype,
      });
    }
  );
  return app;
}

describe('Regresión de seguridad - uploads', () => {
  const app = crearApp();

  afterEach(() => {
    for (const nombre of fs.readdirSync(DIRECTORIO_TEMPORAL)) {
      fs.rmSync(path.join(DIRECTORIO_TEMPORAL, nombre), { force: true });
    }
  });

  afterAll(() => {
    fs.rmSync(DIRECTORIO_TEMPORAL, { recursive: true, force: true });
  });

  test('SEC-UPLOAD-01 rechaza nombres con doble extensión', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('imagen', Buffer.from('contenido'), {
        filename: 'avatar.php.png',
        contentType: 'image/png',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/doble extensión/i);
    expect(fs.readdirSync(DIRECTORIO_TEMPORAL)).toHaveLength(0);
  });

  test('SEC-UPLOAD-02 rechaza contenido cuya firma no corresponde a la imagen', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('imagen', Buffer.from('no-es-una-imagen'), {
        filename: 'avatar.png',
        contentType: 'image/png',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/contenido del archivo/i);
    expect(fs.readdirSync(DIRECTORIO_TEMPORAL)).toHaveLength(0);
  });

  test('SEC-UPLOAD-03 recodifica una imagen válida con nombre del servidor', async () => {
    const imagen = await sharp({
      create: {
        width: 4,
        height: 4,
        channels: 4,
        background: { r: 12, g: 34, b: 56, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const response = await request(app)
      .post('/upload')
      .attach('imagen', imagen, {
        filename: 'avatar.png',
        contentType: 'image/png',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.filename).toMatch(/^ninja_media_.*\.png$/);
    expect(response.body.mimetype).toBe('image/png');

    const archivos = fs.readdirSync(DIRECTORIO_TEMPORAL);
    expect(archivos).toEqual([response.body.filename]);
    const metadata = await sharp(
      path.join(DIRECTORIO_TEMPORAL, response.body.filename)
    ).metadata();
    expect(metadata.format).toBe('png');
    expect(metadata.width).toBe(4);
    expect(metadata.height).toBe(4);
  });
});
