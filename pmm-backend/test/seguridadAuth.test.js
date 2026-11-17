process.env.JWT_SECRET = 'secreto-jwt-pruebas-seguridad';
process.env.FRONTEND_URL = 'http://localhost:5173';

jest.mock('../src/models/Usuario', () => ({
  findOne: jest.fn(),
}));

jest.mock('../src/config/database', () => ({
  query: jest.fn(),
  QueryTypes: { SELECT: 'SELECT' },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../src/services/correoService', () => ({
  enviarCorreo: jest.fn(),
}));

const Usuario = require('../src/models/Usuario');
const db = require('../src/config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { enviarCorreo } = require('../src/services/correoService');
const {
  forgotPassword,
  resetPassword,
  login,
} = require('../src/controllers/authController');

function crearRespuesta() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe('Regresión de seguridad - recuperación, reset y JWT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('SEC-AUTH-01 rechaza recuperación sin correo', async () => {
    const res = crearRespuesta();

    await forgotPassword({ body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test('SEC-AUTH-02 rechaza recuperación con correo de tipo incorrecto', async () => {
    const res = crearRespuesta();

    await forgotPassword({ body: { correo: 12345 } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test('SEC-AUTH-03 evita enumerar un correo inexistente', async () => {
    const res = crearRespuesta();
    Usuario.findOne.mockResolvedValue(null);

    await forgotPassword(
      { body: { correo: 'inexistente@example.com' } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Si el correo es válido, recibirás instrucciones pronto.',
    });
    expect(enviarCorreo).not.toHaveBeenCalled();
  });

  test('SEC-RESET-01 rechaza nueva contraseña ausente', async () => {
    const res = crearRespuesta();

    await resetPassword(
      { params: { token: 'token-prueba' }, body: {} },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test('SEC-RESET-02 rechaza nueva contraseña de tipo incorrecto', async () => {
    const res = crearRespuesta();

    await resetPassword(
      { params: { token: 'token-prueba' }, body: { nuevaPassword: 123456 } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test('SEC-RESET-03 rechaza token inexistente o ya utilizado', async () => {
    const res = crearRespuesta();
    Usuario.findOne.mockResolvedValue(null);

    await resetPassword(
      {
        params: { token: 'token-no-registrado' },
        body: { nuevaPassword: 'Password2026*' },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  test('SEC-RESET-04 rechaza token con vigencia vencida', async () => {
    const res = crearRespuesta();
    Usuario.findOne.mockResolvedValue({
      reset_token_expiry: Date.now() - 1000,
    });

    await resetPassword(
      {
        params: { token: 'token-vencido' },
        body: { nuevaPassword: 'Password2026*' },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  test('SEC-RESET-05 rechaza token con firma JWT inválida', async () => {
    const res = crearRespuesta();
    Usuario.findOne.mockResolvedValue({
      reset_token_expiry: Date.now() + 60000,
    });
    jwt.verify.mockImplementation(() => {
      const error = new Error('firma inválida');
      error.name = 'JsonWebTokenError';
      throw error;
    });

    await resetPassword(
      {
        params: { token: 'token-alterado' },
        body: { nuevaPassword: 'Password2026*' },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('SEC-RESET-06 invalida el token después de un restablecimiento exitoso', async () => {
    const usuario = {
      reset_token: 'token-valido',
      reset_token_expiry: Date.now() + 60000,
      save: jest.fn().mockResolvedValue(undefined),
    };
    Usuario.findOne
      .mockResolvedValueOnce(usuario)
      .mockResolvedValueOnce(null);
    jwt.verify.mockReturnValue({ id_usuario: 7 });
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hash-nuevo');

    const req = {
      params: { token: 'token-valido' },
      body: { nuevaPassword: 'Password2026*' },
    };
    const primeraRespuesta = crearRespuesta();
    const segundaRespuesta = crearRespuesta();

    await resetPassword(req, primeraRespuesta);
    await resetPassword(req, segundaRespuesta);

    expect(primeraRespuesta.status).toHaveBeenCalledWith(200);
    expect(usuario.reset_token).toBe('');
    expect(usuario.reset_token_expiry).toBeNull();
    expect(usuario.save).toHaveBeenCalledTimes(1);
    expect(segundaRespuesta.status).toHaveBeenCalledWith(401);
  });

  test('SEC-JWT-01 genera sesión con payload mínimo y vigencia de dos horas', async () => {
    const res = crearRespuesta();
    Usuario.findOne.mockResolvedValue({
      id_usuario: 17,
      nombre_completo: 'Estudiante Prueba',
      correo: 'estudiante@example.com',
      hash_password: 'hash-vigente',
      rol: 'estudiante',
      rango: 'Genin (Iniciado)',
      verificado: true,
      estado: 'Activo',
    });
    bcrypt.compare.mockResolvedValue(true);
    db.query.mockResolvedValue([null]);
    jwt.sign.mockReturnValue('jwt-sesion-prueba');

    await login(
      {
        body: {
          correo: ' estudiante@example.com ',
          password: 'Password2026*',
        },
      },
      res
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      { id_usuario: 17, rol: 'estudiante' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    expect(jwt.sign.mock.calls[0][0]).not.toHaveProperty('correo');
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
