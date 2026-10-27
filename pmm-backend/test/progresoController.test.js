jest.mock('../src/models/ProgresoEstudiante', () => ({
    findOne: jest.fn(),
}));

const ProgresoEstudiante = require('../src/models/ProgresoEstudiante');

const {
    obtenerEstadoModulo,
} = require('../src/controllers/progresoController');

describe('progresoController', () => {

    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

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
});
