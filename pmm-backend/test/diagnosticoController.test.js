const PreguntaDiagnostico = require('../src/models/PreguntaDiagnostico');
const Diagnostico = require('../src/models/Diagnostico');

jest.mock('../src/models/PreguntaDiagnostico', () => ({
  findAll: jest.fn(),
}));

jest.mock('../src/models/Diagnostico', () => ({
  create: jest.fn(),
  sequelize: {
    transaction: jest.fn(),
    query: jest.fn(),
  },
}));

const {
  evaluarDiagnostico,
} = require('../src/controllers/diagnosticoController');

describe('diagnosticoController - evaluarDiagnostico', () => {
  let req;
  let res;
  let transaction;

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    Diagnostico.sequelize.transaction.mockResolvedValue(transaction);
    Diagnostico.sequelize.query.mockResolvedValue([]);
    Diagnostico.create.mockResolvedValue({
      id_diagnostico: 1,
    });

    global.fetch = jest.fn();

    req = {
      usuario: {
        id_usuario: 1,
      },
      body: {
        respuestas: [],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();

    Diagnostico.sequelize.transaction.mockResolvedValue(transaction);
    Diagnostico.sequelize.query.mockResolvedValue([]);
    Diagnostico.create.mockResolvedValue({
      id_diagnostico: 1,
    });
  });

  test('debe retornar 400 cuando las respuestas no tienen un formato válido', async () => {
    req.body = {
      respuestas: 'no-es-un-array',
    };

    await evaluarDiagnostico(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Formato de respuestas inválido.',
    });
  });

  test('debe asignar Genin cuando Flask devuelve nivel_id 0', async () => {
    const preguntas = Array.from({ length: 13 }, (_, i) => ({
      id_pregunta: i + 1,
      pregunta: `Pregunta ${i + 1}`,
      opcion_a: 'A',
      opcion_b: 'B',
      opcion_c: 'C',
      opcion_d: 'D',
      respuesta_correcta: 'A',
    }));

    PreguntaDiagnostico.findAll.mockResolvedValue(preguntas);

    req.body.respuestas = preguntas.map((pregunta) => ({
      id_pregunta: pregunta.id_pregunta,
      respuesta: 'B',
    }));

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        nivel_id: 0,
      }),
    });

    await evaluarDiagnostico(req, res);

    expect(Diagnostico.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id_usuario: 1,
        puntaje_obtenido: 0,
        nivel_asignado: 'Genin (Iniciado)',
      }),
      expect.objectContaining({
        transaction,
      })
    );

    expect(transaction.commit).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        resultados: expect.objectContaining({
          correctas: 0,
          total: 13,
          rango_asignado: 'Genin (Iniciado)',
        }),
      })
    );
  });

  test('debe asignar Chunin cuando Flask devuelve nivel_id 1', async () => {
    const preguntas = Array.from({ length: 13 }, (_, i) => ({
      id_pregunta: i + 1,
      pregunta: `Pregunta ${i + 1}`,
      opcion_a: 'A',
      opcion_b: 'B',
      opcion_c: 'C',
      opcion_d: 'D',
      respuesta_correcta: 'A',
    }));

    PreguntaDiagnostico.findAll.mockResolvedValue(preguntas);

    req.body.respuestas = preguntas.map((pregunta, index) => ({
      id_pregunta: pregunta.id_pregunta,
      respuesta: index < 7 ? 'A' : 'B',
    }));

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        nivel_id: 1,
      }),
    });

    await evaluarDiagnostico(req, res);

    expect(Diagnostico.create).toHaveBeenCalledWith(
      expect.objectContaining({
        puntaje_obtenido: 7,
        nivel_asignado: 'Chunin (Guerrero)',
      }),
      expect.objectContaining({
        transaction,
      })
    );

    expect(transaction.commit).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        resultados: expect.objectContaining({
          correctas: 7,
          total: 13,
          rango_asignado: 'Chunin (Guerrero)',
        }),
      })
    );
  });

  test('debe asignar Jonin cuando Flask devuelve nivel_id 2', async () => {
    const preguntas = Array.from({ length: 13 }, (_, i) => ({
      id_pregunta: i + 1,
      pregunta: `Pregunta ${i + 1}`,
      opcion_a: 'A',
      opcion_b: 'B',
      opcion_c: 'C',
      opcion_d: 'D',
      respuesta_correcta: 'A',
    }));

    PreguntaDiagnostico.findAll.mockResolvedValue(preguntas);

    req.body.respuestas = preguntas.map((pregunta, index) => ({
      id_pregunta: pregunta.id_pregunta,
      respuesta: index < 11 ? 'A' : 'B',
    }));

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        nivel_id: 2,
      }),
    });

    await evaluarDiagnostico(req, res);

    expect(Diagnostico.create).toHaveBeenCalledWith(
      expect.objectContaining({
        puntaje_obtenido: 11,
        nivel_asignado: 'Jonin (Maestro)',
      }),
      expect.objectContaining({
        transaction,
      })
    );

    expect(transaction.commit).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        resultados: expect.objectContaining({
          correctas: 11,
          total: 13,
          rango_asignado: 'Jonin (Maestro)',
        }),
      })
    );
  });
});