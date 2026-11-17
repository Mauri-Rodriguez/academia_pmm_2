process.env.CORS_ORIGINS = 'https://permitido.example';
process.env.FRONTEND_URL = 'https://permitido.example';

const request = require('supertest');
const app = require('../src/server');

describe('Regresión de seguridad - CORS', () => {
  test('SEC-CORS-01 permite el origen configurado', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'https://permitido.example');

    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(
      'https://permitido.example'
    );
  });

  test('SEC-CORS-02 rechaza con 403 un origen no autorizado', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'https://malicioso.example');

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      mensaje: 'Origen no autorizado por CORS',
    });
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
