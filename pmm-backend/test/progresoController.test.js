jest.mock('../src/models/ProgresoEstudiante', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

jest.mock('../src/config/database', () => ({
    transaction: jest.fn(),
}));

jest.mock('../src/models/Ejercicio', () => ({
    findByPk: jest.fn(),
    findAll: jest.fn(),
}));

jest.mock('../src/models/HistorialError', () => ({
    create: jest.fn(),
}));

jest.mock('../src/services/finalizacionModuloService', () => ({
    finalizarModulo: jest.fn(),
}));

const ProgresoEstudiante = require('../src/models/ProgresoEstudiante');
const db = require('../src/config/database');
const Ejercicio = require('../src/models/Ejercicio');
const HistorialError = require('../src/models/HistorialError');
const {
    finalizarModulo,
} = require('../src/services/finalizacionModuloService');

const {
    obtenerEstadoModulo,
} = require('../src/controllers/progresoController');

const {
    evaluarEjercicio,
} = require('../src/controllers/ejercicioController');

describe('progresoController', () => {

    let req;
    let res;
    let transaction;

    beforeEach(() => {
        jest.clearAllMocks();

        transaction = {
            LOCK: { UPDATE: 'UPDATE' },
            commit: jest.fn(),
            rollback: jest.fn(),
            finished: false,
        };
        db.transaction.mockResolvedValue(transaction);

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

    describe('actualización del progreso al evaluar ejercicios', () => {
        const prepararEjercicios = () => {
            Ejercicio.findByPk.mockResolvedValue({
                id_ejercicio: 1,
                id_modulo: 2,
                respuesta_correcta: 'opcion_a',
            });
            Ejercicio.findAll.mockResolvedValue([
                { id_ejercicio: 1 },
                { id_ejercicio: 2 },
            ]);
        };

        test('debe crear el progreso cuando todavía no existe', async () => {
            prepararEjercicios();
            const progreso = {
                porcentaje_avance: 0,
                intentos_realizados: 0,
                save: jest.fn(),
            };
            ProgresoEstudiante.findOne.mockResolvedValue(null);
            ProgresoEstudiante.create.mockResolvedValue(progreso);
            req.body = {
                id_ejercicio: 1,
                respuesta_estudiante: 'opcion_a',
            };

            await evaluarEjercicio(req, res);

            expect(ProgresoEstudiante.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    id_usuario: 1,
                    id_modulo: 2,
                    porcentaje_avance: 0,
                }),
                { transaction }
            );
            expect(progreso.porcentaje_avance).toBe(50);
            expect(progreso.save).toHaveBeenCalledWith({ transaction });
            expect(transaction.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('debe completar el módulo cuando la respuesta correcta alcanza el 100 por ciento', async () => {
            prepararEjercicios();
            Ejercicio.findByPk.mockResolvedValue({
                id_ejercicio: 2,
                id_modulo: 2,
                respuesta_correcta: 'opcion_a',
            });
            const progreso = {
                porcentaje_avance: 50,
                intentos_realizados: 1,
                save: jest.fn(),
            };
            ProgresoEstudiante.findOne.mockResolvedValue(progreso);
            finalizarModulo.mockResolvedValue({
                insignia: null,
                ascendio: false,
                detallesAscenso: null,
            });
            req.body = {
                id_ejercicio: 2,
                respuesta_estudiante: 'opcion_a',
            };

            await evaluarEjercicio(req, res);

            expect(progreso.porcentaje_avance).toBe(100);
            expect(finalizarModulo).toHaveBeenCalledWith({
                idUsuario: 1,
                idModulo: 2,
                transaction,
            });
            expect(transaction.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('no debe aumentar el avance cuando la respuesta es incorrecta', async () => {
            prepararEjercicios();
            const progreso = {
                porcentaje_avance: 0,
                intentos_realizados: 0,
                save: jest.fn(),
            };
            ProgresoEstudiante.findOne.mockResolvedValue(progreso);
            HistorialError.create.mockResolvedValue({});
            req.body = {
                id_ejercicio: 1,
                respuesta_estudiante: 'opcion_b',
            };

            await evaluarEjercicio(req, res);

            expect(progreso.porcentaje_avance).toBe(0);
            expect(HistorialError.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    id_usuario: 1,
                    id_pregunta: 1,
                    respuesta_dada: 'opcion_b',
                }),
                { transaction }
            );
            expect(transaction.commit).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('debe hacer rollback cuando falla la actualización del progreso', async () => {
            prepararEjercicios();
            const progreso = {
                porcentaje_avance: 0,
                intentos_realizados: 0,
                save: jest.fn().mockRejectedValue(new Error('Error de prueba')),
            };
            ProgresoEstudiante.findOne.mockResolvedValue(progreso);
            req.body = {
                id_ejercicio: 1,
                respuesta_estudiante: 'opcion_a',
            };

            await evaluarEjercicio(req, res);

            expect(transaction.rollback).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Error interno del servidor al procesar la respuesta.',
            });
        });
    });
});
