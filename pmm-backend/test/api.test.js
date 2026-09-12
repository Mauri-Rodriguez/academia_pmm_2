const request = require('supertest');

const app = require('../src/server');

describe('API PMM Interactivo', () => {

    test('GET / debe retornar mensaje de bienvenida', async () => {

        const response = await request(app)
            .get('/');

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            mensaje: 'Bienvenido a la API de PMM INTERACTIVO 🚀',
        });
    });

});