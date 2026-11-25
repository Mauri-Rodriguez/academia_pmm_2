process.env.GEMINI_API_KEY = 'clave-de-prueba';
process.env.JWT_SECRET = 'secreto-de-prueba';

const mockSendMessage = jest.fn();
const mockStartChat = jest.fn();
const mockGetGenerativeModel = jest.fn(() => ({
    startChat: mockStartChat
}));
const mockJwtVerify = jest.fn();

jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn(() => ({
        getGenerativeModel: mockGetGenerativeModel
    }))
}));

jest.mock('jsonwebtoken', () => ({
    verify: mockJwtVerify
}));

jest.mock('../src/config/database', () => ({
    query: jest.fn(),
    QueryTypes: { SELECT: 'SELECT' }
}));

jest.mock('../src/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}));

jest.mock('../src/models/Modulo', () => ({}));
jest.mock('../src/models/Ejercicio', () => ({
    findByPk: jest.fn()
}));
jest.mock('../src/models/ProgresoEstudiante', () => ({}));
jest.mock('../src/models/Usuario', () => ({}));
jest.mock('../src/models/HistorialError', () => ({}));

const db = require('../src/config/database');
const Ejercicio = require('../src/models/Ejercicio');
const { consultarOraculo } = require('../src/controllers/estudianteController');

const crearRespuesta = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

const crearPeticion = (idUsuario, idPregunta, mensaje) => ({
    headers: { authorization: `Bearer ${idUsuario}` },
    body: {
        id_pregunta: idPregunta,
        mensaje_estudiante: mensaje
    }
});

describe('Tutor IA - persistencia contextual y timeout', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockJwtVerify.mockImplementation((token) => ({
            id_usuario: Number(token)
        }));
        Ejercicio.findByPk.mockResolvedValue({
            id_ejercicio: 501,
            pregunta: '¿Cómo se factoriza x cuadrado menos nueve?'
        });
        db.query.mockResolvedValue([{
            rango_actual: 'Genin (Iniciado)',
            rango: 'Genin (Iniciado)'
        }]);
        mockStartChat.mockImplementation(() => ({
            sendMessage: mockSendMessage
        }));
    });

    test('reutiliza el contexto por estudiante y ejercicio sin mezclar usuarios', async () => {
        const historialesIniciales = [];
        mockStartChat.mockImplementation(({ history }) => {
            historialesIniciales.push(structuredClone(history));
            return { sendMessage: mockSendMessage };
        });
        mockSendMessage
            .mockResolvedValueOnce({
                response: { text: () => 'Primera pista' }
            })
            .mockResolvedValueOnce({
                response: { text: () => 'Segunda pista contextual' }
            })
            .mockResolvedValueOnce({
                response: { text: () => 'Pista para otro estudiante' }
            });

        await consultarOraculo(
            crearPeticion(701, 501, '¿Por dónde comienzo?'),
            crearRespuesta()
        );
        await consultarOraculo(
            crearPeticion(701, 501, '¿Y cuál sería el siguiente paso?'),
            crearRespuesta()
        );
        await consultarOraculo(
            crearPeticion(702, 501, '¿Por dónde comienzo?'),
            crearRespuesta()
        );

        expect(historialesIniciales[0]).toEqual([]);
        expect(historialesIniciales[1]).toHaveLength(2);
        expect(historialesIniciales[1][1]).toEqual({
            role: 'model',
            parts: [{ text: 'Primera pista' }]
        });
        expect(historialesIniciales[2]).toEqual([]);
        expect(mockStartChat).toHaveBeenCalledTimes(3);
    });

    test('envía el límite de diez segundos y responde 504 ante timeout', async () => {
        mockSendMessage.mockRejectedValueOnce(
            new Error('Request timed out after 10000ms')
        );
        const res = crearRespuesta();

        await consultarOraculo(
            crearPeticion(703, 502, 'Necesito una pista'),
            res
        );

        expect(mockSendMessage).toHaveBeenCalledWith(
            expect.any(String),
            { timeout: 10000 }
        );
        expect(res.status).toHaveBeenCalledWith(504);
        expect(res.json).toHaveBeenCalledWith({
            respuesta: 'El Tutor tardó demasiado en responder. Intenta nuevamente en unos segundos.'
        });
    });
});
