/**
 * Prueba de integración: H-001 rate limit en POST /api/auth/login.
 * Límites bajos vía env; resetModules para no heredar el middleware ya cacheado.
 */
describe('rateLimitAuth — login', () => {
    let request;
    let app;

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        process.env.AUTH_RATE_WINDOW_MS = '60000';
        process.env.AUTH_RATE_LOGIN_MAX = '3';

        jest.resetModules();
        request = require('supertest');
        app = require('../src/server');
    });

    test('tras superar el máximo de fallos responde 429 con mensaje', async () => {
        const payload = {
            correo: 'pmminteractivo+ratelimit@example.com',
            password: 'clave-incorrecta-xyz'
        };

        for (let i = 0; i < 3; i += 1) {
            const res = await request(app)
                .post('/api/auth/login')
                .send(payload);

            expect(res.status).not.toBe(429);
        }

        const bloqueado = await request(app)
            .post('/api/auth/login')
            .send(payload);

        expect(bloqueado.status).toBe(429);
        expect(bloqueado.body.mensaje).toMatch(/Demasiados intentos/i);
    });
});
