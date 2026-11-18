const ENTORNO_ORIGINAL = { ...process.env };

function configurarProduccion() {
  process.env.NODE_ENV = 'production';
  process.env.JWT_SECRET = 'jwt-seguro-pruebas';
  process.env.FRONTEND_URL = 'https://frontend.example';
  process.env.CORS_ORIGINS = 'https://frontend.example';
  process.env.IA_SERVICE_URL = 'https://ia.example';
  process.env.IA_SERVICE_SECRET = 'secreto-interno-pruebas';
  process.env.GEMINI_API_KEY = 'gemini-pruebas';
  process.env.RESEND_API_KEY = 'resend-pruebas';
  process.env.GOOGLE_CLIENT_ID = 'google-pruebas';
  process.env.DOMINIOS_DOCENTES = 'docentes.example.edu';
}

describe('Regresión de seguridad - entorno y sanitización de logs', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENTORNO_ORIGINAL };
  });

  afterAll(() => {
    process.env = ENTORNO_ORIGINAL;
  });

  test('SEC-ENV-01 exige JWT_SECRET en cualquier entorno', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.JWT_SECRET;
    const { validarEntorno } = require('../src/config/validarEntorno');

    const resultado = validarEntorno();

    expect(resultado.ok).toBe(false);
    expect(resultado.faltantes).toContain('JWT_SECRET');
  });

  test('SEC-ENV-02 reporta variables productivas y base de datos faltantes', () => {
    process.env = { NODE_ENV: 'production', JWT_SECRET: 'jwt-pruebas' };
    const { validarEntorno } = require('../src/config/validarEntorno');

    const resultado = validarEntorno();

    expect(resultado.ok).toBe(false);
    expect(resultado.faltantes).toEqual(
      expect.arrayContaining([
        'IA_SERVICE_SECRET',
        'DOMINIOS_DOCENTES',
        'MYSQL_URL o DB_HOST/DB_USER/DB_PASSWORD/DB_NAME',
      ])
    );
  });

  test('SEC-ENV-03 acepta MYSQL_URL como configuración completa de base de datos', () => {
    configurarProduccion();
    process.env.MYSQL_URL = 'mysql://usuario:password@db.example/pmm';
    delete process.env.DB_HOST;
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_NAME;
    const { validarEntorno } = require('../src/config/validarEntorno');

    expect(validarEntorno()).toEqual({ ok: true, faltantes: [] });
  });

  test('SEC-ENV-04 acepta el bloque DB_* cuando MYSQL_URL no existe', () => {
    configurarProduccion();
    delete process.env.MYSQL_URL;
    process.env.DB_HOST = 'db.example';
    process.env.DB_USER = 'usuario';
    process.env.DB_PASSWORD = 'password';
    process.env.DB_NAME = 'pmm';
    const { validarEntorno } = require('../src/config/validarEntorno');

    expect(validarEntorno()).toEqual({ ok: true, faltantes: [] });
  });

  test('SEC-LOG-01 redacta JWT, correo y enlace de recuperación', () => {
    const logger = require('../src/utils/logger');
    const sensible = [
      'Bearer abc.def.ghi',
      'persona@example.com',
      'https://frontend.example/reset-password/token-secreto',
    ].join(' | ');

    const resultado = logger.sanitizarValor({ detalle: sensible });
    const serializado = JSON.stringify(resultado);

    expect(serializado).not.toContain('abc.def.ghi');
    expect(serializado).not.toContain('persona@example.com');
    expect(serializado).not.toContain('token-secreto');
    expect(serializado).toContain('[REDACTED]');
  });

  test('SEC-LOG-02 enmascara el correo usado como dato operativo', () => {
    const logger = require('../src/utils/logger');

    expect(logger.enmascararCorreo('Persona@example.com')).toBe(
      'pe***@example.com'
    );
    expect(logger.enmascararCorreo('invalido')).toBe('[correo]');
  });
});
