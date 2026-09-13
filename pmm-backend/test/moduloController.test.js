jest.mock('../src/config/database', () => ({
    fn: jest.fn(),
    col: jest.fn(),
}));

jest.mock('../src/models/Ejercicio', () => ({
    findAll: jest.fn(),
}));

jest.mock('../src/models/ProgresoEstudiante', () => ({
    upsert: jest.fn(),
    findAll: jest.fn(),
}));

jest.mock('../src/models/Diagnostico', () => ({
    update: jest.fn(),
}));

const sequelize = require('../src/config/database');
const Ejercicio = require('../src/models/Ejercicio');
const ProgresoEstudiante = require('../src/models/ProgresoEstudiante');
const Diagnostico = require('../src/models/Diagnostico');

const {
    obtenerEjerciciosModulo,
    actualizarProgreso,
} = require('../src/controllers/moduloController');

describe('moduloController', () => {

    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            user: {
                id_usuario: 1,
            },
            params: {},
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('obtenerEjerciciosModulo', () => {

        test('debe retornar los ejercicios de un módulo', async () => {

            req.params = {
                id_modulo: '2',
            };

            const ejercicios = [
                { id_ejercicio: 1, id_modulo: 2 },
                { id_ejercicio: 2, id_modulo: 2 },
            ];

            Ejercicio.findAll.mockResolvedValue(ejercicios);

            await obtenerEjerciciosModulo(req, res);

            expect(Ejercicio.findAll).toHaveBeenCalledWith({
                where: {
                    id_modulo: '2',
                },
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(ejercicios);
        });

        test('debe retornar 500 cuando ocurre un error al cargar ejercicios', async () => {

            req.params = {
                id_modulo: '2',
            };

            Ejercicio.findAll.mockRejectedValue(
                new Error('Error de prueba')
            );

            await obtenerEjerciciosModulo(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Error al cargar ejercicios.',
            });
        });
    });

    describe('actualizarProgreso', () => {

        beforeEach(() => {
            sequelize.fn.mockReturnValue('AVG_FUNC');
            sequelize.col.mockReturnValue('PORCENTAJE_COL');

            ProgresoEstudiante.upsert.mockResolvedValue([
                {},
                true,
            ]);

            ProgresoEstudiante.findAll.mockResolvedValue([
                {
                    promedio: 75,
                },
            ]);

            Diagnostico.update.mockResolvedValue([1]);
        });

        test('debe retornar 401 cuando el usuario no está identificado', async () => {

            req.user = {};

            req.body = {
                id_modulo: 2,
                porcentaje: 50,
            };

            await actualizarProgreso(req, res);

            expect(res.status).toHaveBeenCalledWith(401);

            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Usuario no identificado',
            });

            expect(ProgresoEstudiante.upsert).not.toHaveBeenCalled();
        });

        test('debe actualizar el progreso y calcular el Chakra total', async () => {

            req.body = {
                id_modulo: 2,
                porcentaje: 75,
            };

            await actualizarProgreso(req, res);

            expect(ProgresoEstudiante.upsert).toHaveBeenCalledWith({
                id_usuario: 1,
                id_modulo: 2,
                porcentaje_avance: 75,
                ultima_actualizacion: expect.any(Date),
            });

            expect(ProgresoEstudiante.findAll).toHaveBeenCalled();

            expect(Diagnostico.update).toHaveBeenCalledWith(
                {
                    puntaje_promedio: 75,
                },
                {
                    where: {
                        id_usuario: 1,
                    },
                }
            );

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                mensaje: 'Progreso sincronizado y Chakra total actualizado.',
                chakraTotal: 75,
            });
        });

        test('debe redondear el porcentaje antes de guardarlo', async () => {

            req.body = {
                id_modulo: 3,
                porcentaje: 74.6,
            };

            await actualizarProgreso(req, res);

            expect(ProgresoEstudiante.upsert).toHaveBeenCalledWith({
                id_usuario: 1,
                id_modulo: 3,
                porcentaje_avance: 75,
                ultima_actualizacion: expect.any(Date),
            });
        });

        test('debe retornar 500 cuando ocurre un error en la actualización', async () => {

            req.body = {
                id_modulo: 2,
                porcentaje: 50,
            };

            ProgresoEstudiante.upsert.mockRejectedValue(
                new Error('Error de prueba')
            );

            await actualizarProgreso(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Fallo en la sincronización del pergamino de progreso.',
            });
        });
    });
});