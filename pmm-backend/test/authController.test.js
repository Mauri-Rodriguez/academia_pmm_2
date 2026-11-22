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

jest.mock('../src/services/correoService', () => ({
  enviarCorreo: jest.fn().mockResolvedValue({ ok: true }),
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { parse } = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../src/models/Usuario');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const {
  consultarRolRegistro,
  googleLogin,
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

describe('authController - dominios del registro', () => {
  const datosRegistro = {
    nombre_completo: 'Cuenta ficticia',
    password: 'Prueba2026',
    acepta_politica_privacidad: true,
    acepta_terminos: true,
  };
  const entornoEjemplo = parse(readFileSync(join(__dirname, '../.env.example')));
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.replaceProperty(process, 'env', {
      ...process.env,
      DOMINIOS_DOCENTES: entornoEjemplo.DOMINIOS_DOCENTES,
    });
    Usuario.findOne.mockResolvedValue(null);
    Usuario.create.mockResolvedValue({ id_usuario: 1, save: jest.fn() });
    jwt.sign.mockReturnValue('token-ficticio');
    res = {
      status: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => jest.restoreAllMocks());

  test.each([
    ['Profesores.UNIAJC.edu.co', 'docente'],
    ['admon.uniajc.edu.co', 'docente'],
    ['personal.example.org', 'estudiante'],
  ])('consulta y registro asignan el mismo rol a %s', async (dominio, rol) => {
    consultarRolRegistro({ query: { dominio } }, res);
    expect(res.json).toHaveBeenCalledWith({ rol });

    await register({ body: { ...datosRegistro, correo: `cuenta@${dominio}` } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(Usuario.create).toHaveBeenCalledWith(expect.objectContaining({ rol }));
  });

  test('rechaza una solicitud manual de rol docente con dominio no autorizado', async () => {
    await register({ body: {
      ...datosRegistro,
      correo: 'cuenta@personal.example.org',
      rol: ' Docente ',
    } }, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(Usuario.findOne).not.toHaveBeenCalled();
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  test('Google usa el correo de la credencial para rechazar el rol docente no autorizado', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue({
      getPayload: () => ({ email: 'cuenta@personal.example.org' }),
    });

    await googleLogin({ body: {
      token: 'credencial-ficticia',
      correo: 'cuenta@profesores.uniajc.edu.co',
      rol: 'docente',
    } }, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(Usuario.findOne).not.toHaveBeenCalled();
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  test('la consulta acepta únicamente el dominio, sin la dirección de correo', () => {
    consultarRolRegistro({ query: { dominio: 'cuenta@profesores.uniajc.edu.co' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
