/**
 * Suite del flujo de módulos y ejercicios.
 *
 * Las responsabilidades de este flujo fueron redistribuidas durante la
 * evolución del backend: la carga y evaluación de ejercicios reside en
 * ejercicioController, la consulta del avance en progresoController y los
 * resultados agregados en docenteController.
 *
 * Este archivo mantiene centralizada la cobertura del flujo funcional sin
 * duplicar implementación ni conservar controladores sin uso.
 */

jest.mock('../src/config/database', () => ({
    transaction: jest.fn(),
    query: jest.fn(),
    QueryTypes: { SELECT: 'SELECT' },
}));

jest.mock('../src/models/Ejercicio', () => ({
    findAll: jest.fn(),
    findByPk: jest.fn(),
}));

jest.mock('../src/models/ProgresoEstudiante', () => ({
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
}));

jest.mock('../src/models/HistorialError', () => ({
    create: jest.fn(),
}));

jest.mock('../src/models/Usuario', () => ({
    findAll: jest.fn(),
}));

jest.mock('../src/models/Diagnostico', () => ({
    findOne: jest.fn(),
}));

jest.mock('../src/models/Modulo', () => ({}));

jest.mock('../src/services/finalizacionModuloService', () => ({
    finalizarModulo: jest.fn(),
}));

const Ejercicio = require('../src/models/Ejercicio');
const ProgresoEstudiante = require('../src/models/ProgresoEstudiante');
const Usuario = require('../src/models/Usuario');
const Diagnostico = require('../src/models/Diagnostico');

const {
    obtenerEjerciciosPorModulo,
    evaluarEjercicio,
} = require('../src/controllers/ejercicioController');

const {
    obtenerResumenEstudiantes,
} = require('../src/controllers/docenteController');

describe('Módulos y ejercicios', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            user: { id_usuario: 1 },
            params: {},
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('debe retornar los ejercicios de un módulo', async () => {
        req.params.id_modulo = '2';
        const ejercicios = [
            { id_ejercicio: 1, id_modulo: 2 },
            { id_ejercicio: 2, id_modulo: 2 },
        ];
        Ejercicio.findAll.mockResolvedValue(ejercicios);

        await obtenerEjerciciosPorModulo(req, res);

        expect(Ejercicio.findAll).toHaveBeenCalledWith({
            where: { id_modulo: '2' },
            attributes: { exclude: ['respuesta_correcta'] },
            order: [['id_ejercicio', 'ASC']],
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Ejercicios cargados con éxito.',
            total: 2,
            data: ejercicios,
        });
    });

    test('debe retornar 404 cuando el módulo no tiene ejercicios', async () => {
        req.params.id_modulo = '2';
        Ejercicio.findAll.mockResolvedValue([]);

        await obtenerEjerciciosPorModulo(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Aún no hay pergaminos de entrenamiento para este módulo.',
        });
    });

    test('debe retornar 500 cuando falla la consulta de ejercicios', async () => {
        req.params.id_modulo = '2';
        Ejercicio.findAll.mockRejectedValue(new Error('Error de prueba'));

        await obtenerEjerciciosPorModulo(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Error interno del servidor al consultar la biblioteca.',
        });
    });

    test('debe retornar 401 cuando el usuario no está identificado', async () => {
        req.user = {};
        req.body = {
            id_ejercicio: 1,
            respuesta_estudiante: 'opcion_a',
        };

        await evaluarEjercicio(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(ProgresoEstudiante.findOne).not.toHaveBeenCalled();
    });

    test('debe retornar 400 cuando los datos de evaluación son inválidos', async () => {
        req.body = {
            id_ejercicio: 'invalido',
            respuesta_estudiante: 'opcion_z',
        };

        await evaluarEjercicio(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(Ejercicio.findByPk).not.toHaveBeenCalled();
    });

    test('debe calcular el avance promedio de los módulos', async () => {
        Usuario.findAll.mockResolvedValue([{
            id_usuario: 1,
            nombre_completo: 'Estudiante de Prueba',
            correo: 'estudiante@example.com',
            ultima_conexion: null,
        }]);
        Diagnostico.findOne.mockResolvedValue({
            nivel_asignado: 'Genin (Iniciado)',
            puntaje_obtenido: 4,
        });
        ProgresoEstudiante.findAll.mockResolvedValue([
            { porcentaje_avance: 50 },
            { porcentaje_avance: 100 },
        ]);

        await obtenerResumenEstudiantes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                reporte: [
                    expect.objectContaining({
                        avance_promedio: '75%',
                    }),
                ],
            })
        );
    });
});
