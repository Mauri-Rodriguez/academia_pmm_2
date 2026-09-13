jest.mock('../src/config/database', () => ({
    transaction: jest.fn(),
}));

jest.mock('../src/models/ProgresoEstudiante', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

jest.mock('../src/models/ResultadoModulo', () => ({
    create: jest.fn(),
    count: jest.fn(),
}));

jest.mock('../src/models/Modulo', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
}));

jest.mock('../src/models/Diagnostico', () => ({
    update: jest.fn(),
}));

const sequelize = require('../src/config/database');
const ProgresoEstudiante = require('../src/models/ProgresoEstudiante');

const {
    actualizarProgreso,
    obtenerEstadoModulo,
} = require('../src/controllers/progresoController');

describe('progresoController', () => {

    let req;
    let res;
    let transaction;

    beforeEach(() => {
        jest.clearAllMocks();

        transaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
        };

        sequelize.transaction.mockResolvedValue(transaction);

        req = {
            user: {
                id_usuario: 1,
            },
            body: {},
            params: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('actualizarProgreso', () => {

        test('debe crear un nuevo registro de progreso cuando no existe', async () => {
            req.body = {
                id_modulo: 2,
                porcentaje: 50,
            };

            ProgresoEstudiante.findOne.mockResolvedValue(null);

            const nuevoProgreso = {
                id_usuario: 1,
                id_modulo: 2,
                porcentaje_avance: 50,
                intentos_realizados: 1,
            };

            ProgresoEstudiante.create.mockResolvedValue(nuevoProgreso);

            await actualizarProgreso(req, res);

            expect(ProgresoEstudiante.findOne).toHaveBeenCalledWith({
                where: {
                    id_usuario: 1,
                    id_modulo: 2,
                },
                transaction,
            });

            expect(ProgresoEstudiante.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    id_usuario: 1,
                    id_modulo: 2,
                    porcentaje_avance: 50,
                    intentos_realizados: 1,
                }),
                {
                    transaction,
                }
            );

            expect(transaction.commit).toHaveBeenCalled();

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: nuevoProgreso,
            });
        });

        test('debe actualizar el porcentaje solo cuando el nuevo valor es mayor', async () => {
            req.body = {
                id_modulo: 2,
                porcentaje: 80,
            };

            const progresoExistente = {
                porcentaje_avance: 60,
                intentos_realizados: 2,
                ultima_actualizacion: null,
                save: jest.fn().mockResolvedValue(),
            };

            ProgresoEstudiante.findOne.mockResolvedValue(progresoExistente);

            await actualizarProgreso(req, res);

            expect(progresoExistente.porcentaje_avance).toBe(80);
            expect(progresoExistente.intentos_realizados).toBe(3);
            expect(progresoExistente.save).toHaveBeenCalledWith({
                transaction,
            });

            expect(transaction.commit).toHaveBeenCalled();

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: progresoExistente,
            });
        });

        test('no debe reducir el porcentaje de progreso existente', async () => {
            req.body = {
                id_modulo: 2,
                porcentaje: 40,
            };

            const progresoExistente = {
                porcentaje_avance: 80,
                intentos_realizados: 3,
                ultima_actualizacion: null,
                save: jest.fn().mockResolvedValue(),
            };

            ProgresoEstudiante.findOne.mockResolvedValue(progresoExistente);

            await actualizarProgreso(req, res);

            expect(progresoExistente.porcentaje_avance).toBe(80);
            expect(progresoExistente.intentos_realizados).toBe(4);
            expect(progresoExistente.save).toHaveBeenCalledWith({
                transaction,
            });

            expect(transaction.commit).toHaveBeenCalled();
        });

        test('debe retornar 500 y hacer rollback cuando ocurre un error', async () => {
            req.body = {
                id_modulo: 2,
                porcentaje: 50,
            };

            ProgresoEstudiante.findOne.mockRejectedValue(
                new Error('Error de prueba')
            );

            await actualizarProgreso(req, res);

            expect(transaction.rollback).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                error: 'Falla en actualización',
            });
        });
    });

    describe('obtenerEstadoModulo', () => {

        test('debe retornar el progreso registrado', async () => {
            req.params = {
                id_modulo: '2',
            };

            const progreso = {
                id_usuario: 1,
                id_modulo: 2,
                porcentaje_avance: 75,
            };

            ProgresoEstudiante.findOne.mockResolvedValue(progreso);

            await obtenerEstadoModulo(req, res);

            expect(ProgresoEstudiante.findOne).toHaveBeenCalledWith({
                where: {
                    id_usuario: 1,
                    id_modulo: '2',
                },
            });

            expect(res.json).toHaveBeenCalledWith(progreso);
        });

        test('debe retornar porcentaje 0 cuando no existe progreso', async () => {
            req.params = {
                id_modulo: '2',
            };

            ProgresoEstudiante.findOne.mockResolvedValue(null);

            await obtenerEstadoModulo(req, res);

            expect(res.json).toHaveBeenCalledWith({
                porcentaje_avance: 0,
            });
        });

        test('debe retornar 500 cuando falla la consulta del progreso', async () => {
            req.params = {
                id_modulo: '2',
            };

            ProgresoEstudiante.findOne.mockRejectedValue(
                new Error('Error de prueba')
            );

            await obtenerEstadoModulo(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                error: 'Error al consultar estado',
            });
        });
    });
});