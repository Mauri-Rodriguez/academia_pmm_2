process.env.AUTH_RATE_RECOVERY_MAX = '2';
process.env.AUTH_RATE_WINDOW_MS = '60000';

const express = require('express');
const request = require('supertest');
const { limitarRecuperacion } = require('../src/middlewares/rateLimitAuth');

describe('Regresión de seguridad - rate limiting', () => {
  test('SEC-RATE-01 responde 429 al superar el máximo de recuperación', async () => {
    const app = express();
    app.use(express.json());
    app.post('/recuperar', limitarRecuperacion, (req, res) => {
      res.status(200).json({ ok: true });
    });

    const cuerpo = { correo: 'rate-limit@example.com' };
    const primera = await request(app).post('/recuperar').send(cuerpo);
    const segunda = await request(app).post('/recuperar').send(cuerpo);
    const tercera = await request(app).post('/recuperar').send(cuerpo);

    expect(primera.statusCode).toBe(200);
    expect(segunda.statusCode).toBe(200);
    expect(tercera.statusCode).toBe(429);
    expect(tercera.body.mensaje).toMatch(/Demasiados intentos/i);
  });
});
