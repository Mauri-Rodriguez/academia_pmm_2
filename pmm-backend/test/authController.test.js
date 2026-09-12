jest.mock('../src/models/Usuario', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../src/config/database', () => ({
  query: jest.fn(),
  QueryTypes: {
    SELECT: 'SELECT',
  },
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const {
  register,
} = require('../src/controllers/authController');

describe('authController - register', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test('debe retornar 400 cuando faltan campos obligatorios', async () => {
    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Todos los campos obligatorios deben estar completos.',
    });
  });

  test('debe retornar 400 cuando el correo no tiene formato válido', async () => {
    req.body = {
      nombre_completo: 'Usuario de Prueba',
      correo: 'correo-invalido',
      password: '123456',
      acepta_politica_privacidad: true,
      acepta_terminos: true,
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Formato de correo inválido.',
    });
  });

  test('debe retornar 400 cuando la contraseña tiene menos de 6 caracteres', async () => {
    req.body = {
      nombre_completo: 'Usuario de Prueba',
      correo: 'usuario@test.com',
      password: '123',
      acepta_politica_privacidad: true,
      acepta_terminos: true,
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'La contraseña debe tener mínimo 6 caracteres.',
    });
  });

  test('debe retornar 400 cuando no se aceptan los términos o la política de privacidad', async () => {
    req.body = {
      nombre_completo: 'Usuario de Prueba',
      correo: 'usuario@test.com',
      password: '123456',
      acepta_politica_privacidad: false,
      acepta_terminos: false,
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      mensaje:
        'Debes aceptar los Términos y la Política de Privacidad para registrarte.',
    });
  });
});