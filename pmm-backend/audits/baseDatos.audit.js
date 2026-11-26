const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config({
    path: path.resolve(__dirname, '../../.env.audit'),
    override: true
});

const requeridas = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const faltantes = requeridas.filter((nombre) => !process.env[nombre]);
if (faltantes.length > 0) {
    throw new Error(`Faltan variables en .env.audit: ${faltantes.join(', ')}`);
}

const hostsLocales = new Set(['localhost', '127.0.0.1', '::1']);
if (!hostsLocales.has(process.env.DB_HOST)) {
    throw new Error('La auditoría con escrituras solo se permite contra MySQL local.');
}

const modelos = [
    require('../src/models/Diagnostico'),
    require('../src/models/Ejercicio'),
    require('../src/models/HistorialError'),
    require('../src/models/Insignia'),
    require('../src/models/Modulo'),
    require('../src/models/PreguntaDiagnostico'),
    require('../src/models/ProgresoEstudiante'),
    require('../src/models/ResultadoModulo'),
    require('../src/models/Usuario'),
    require('../src/models/UsuarioInsignia')
];

const familiasTipo = {
    INTEGER: ['int', 'integer'],
    BIGINT: ['bigint'],
    FLOAT: ['float'],
    DOUBLE: ['double'],
    DECIMAL: ['decimal'],
    STRING: ['varchar'],
    TEXT: ['text', 'mediumtext', 'longtext', 'tinytext'],
    BOOLEAN: ['tinyint'],
    DATE: ['datetime', 'timestamp'],
    DATEONLY: ['date'],
    ENUM: ['enum']
};

const normalizarDefaultModelo = (valor) => {
    if (valor === undefined || valor === null) return null;
    if (valor === true) return '1';
    if (valor === false) return '0';
    if (typeof valor === 'number' || typeof valor === 'string') return String(valor);
    if (valor?.key === 'NOW' || valor?.constructor?.key === 'NOW') {
        return 'CURRENT_TIMESTAMP';
    }
    return String(valor).toUpperCase();
};

const normalizarDefaultMysql = (valor) => {
    if (valor === undefined || valor === null) return null;
    const texto = String(valor).replace(/^'(.*)'$/, '$1');
    if (/^current_timestamp(?:\(\))?$/i.test(texto)) return 'CURRENT_TIMESTAMP';
    return texto;
};

const compararLongitud = (atributo, columna) => {
    if (atributo.type?.key !== 'STRING') return true;
    const longitudModelo = atributo.type.options?.length || 255;
    const coincidencia = columna.COLUMN_TYPE.match(/^varchar\((\d+)\)/i);
    if (!coincidencia) return false;
    return longitudModelo === Number(coincidencia[1]);
};

const compararEnum = (atributo, columna) => {
    if (atributo.type?.key !== 'ENUM') return true;
    const valoresModelo = atributo.values || atributo.type.values || [];
    const valoresMysql = [...columna.COLUMN_TYPE.matchAll(/'((?:[^']|'')*)'/g)]
        .map((coincidencia) => coincidencia[1].replace(/''/g, "'"));
    return JSON.stringify(valoresModelo) === JSON.stringify(valoresMysql);
};

const auditarModelos = async (conexion) => {
    const [columnas] = await conexion.query(
        `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE,
                IS_NULLABLE, COLUMN_DEFAULT, EXTRA
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = ?
         ORDER BY TABLE_NAME, ORDINAL_POSITION`,
        [process.env.DB_NAME]
    );

    const columnasPorTabla = new Map();
    columnas.forEach((columna) => {
        if (!columnasPorTabla.has(columna.TABLE_NAME)) {
            columnasPorTabla.set(columna.TABLE_NAME, new Map());
        }
        columnasPorTabla.get(columna.TABLE_NAME).set(columna.COLUMN_NAME, columna);
    });

    const diferencias = [];
    const resumen = [];

    modelos.forEach((modelo) => {
        const tabla = modelo.getTableName();
        const nombreTabla = typeof tabla === 'string' ? tabla : tabla.tableName;
        const columnasTabla = columnasPorTabla.get(nombreTabla);

        if (!columnasTabla) {
            diferencias.push({ tabla: nombreTabla, diferencia: 'Tabla ausente en MySQL' });
            return;
        }

        let revisadas = 0;
        Object.entries(modelo.rawAttributes).forEach(([nombreAtributo, atributo]) => {
            const nombreColumna = atributo.field || nombreAtributo;
            const columna = columnasTabla.get(nombreColumna);
            revisadas += 1;

            if (!columna) {
                diferencias.push({
                    tabla: nombreTabla,
                    columna: nombreColumna,
                    diferencia: 'Columna del modelo ausente en MySQL'
                });
                return;
            }

            const tipoModelo = atributo.type?.key;
            const tiposCompatibles = familiasTipo[tipoModelo] || [];
            if (!tiposCompatibles.includes(columna.DATA_TYPE.toLowerCase())) {
                diferencias.push({
                    tabla: nombreTabla,
                    columna: nombreColumna,
                    propiedad: 'tipo',
                    modelo: atributo.type.toString(),
                    mysql: columna.COLUMN_TYPE
                });
            } else if (!compararLongitud(atributo, columna)) {
                diferencias.push({
                    tabla: nombreTabla,
                    columna: nombreColumna,
                    propiedad: 'longitud',
                    modelo: atributo.type.toString(),
                    mysql: columna.COLUMN_TYPE
                });
            } else if (!compararEnum(atributo, columna)) {
                diferencias.push({
                    tabla: nombreTabla,
                    columna: nombreColumna,
                    propiedad: 'enum',
                    modelo: atributo.type.toString(),
                    mysql: columna.COLUMN_TYPE
                });
            }

            const permiteNuloModelo = atributo.primaryKey ? false : atributo.allowNull !== false;
            const permiteNuloMysql = columna.IS_NULLABLE === 'YES';
            if (permiteNuloModelo !== permiteNuloMysql) {
                diferencias.push({
                    tabla: nombreTabla,
                    columna: nombreColumna,
                    propiedad: 'nulabilidad',
                    modelo: permiteNuloModelo ? 'NULL' : 'NOT NULL',
                    mysql: permiteNuloMysql ? 'NULL' : 'NOT NULL'
                });
            }

            const defaultModelo = normalizarDefaultModelo(atributo.defaultValue);
            const defaultMysql = normalizarDefaultMysql(columna.COLUMN_DEFAULT);
            if (defaultModelo !== defaultMysql) {
                diferencias.push({
                    tabla: nombreTabla,
                    columna: nombreColumna,
                    propiedad: 'default',
                    modelo: defaultModelo,
                    mysql: defaultMysql
                });
            }
        });

        resumen.push({ tabla: nombreTabla, columnas_revisadas: revisadas });
    });

    const [restriccionesReferenciales] = await conexion.query(
        `SELECT CONSTRAINT_NAME, TABLE_NAME, REFERENCED_TABLE_NAME,
                UPDATE_RULE, DELETE_RULE
         FROM information_schema.REFERENTIAL_CONSTRAINTS
         WHERE CONSTRAINT_SCHEMA = ?
         ORDER BY TABLE_NAME, CONSTRAINT_NAME`,
        [process.env.DB_NAME]
    );

    return { resumen, diferencias, restriccionesReferenciales };
};

const auditarTransaccionYCascadas = async (conexion) => {
    const marca = `audit_${crypto.randomUUID().replace(/-/g, '')}`;
    const correo = `${marca}@example.invalid`;
    const nombreModulo = `Modulo ${marca}`;
    const comprobaciones = {};

    await conexion.beginTransaction();
    try {
        const [usuario] = await conexion.execute(
            `INSERT INTO usuarios
                (nombre_completo, correo, hash_password, rol, fecha_registro)
             VALUES (?, ?, ?, 'estudiante', CURRENT_DATE)`,
            ['Usuario Auditoría', correo, 'hash-no-utilizable']
        );
        const idUsuarioOriginal = usuario.insertId;

        const [modulo] = await conexion.execute(
            `INSERT INTO modulos (nombre_modulo, descripcion, nivel)
             VALUES (?, 'Registro temporal de auditoría', 'Genin')`,
            [nombreModulo]
        );
        const idModulo = modulo.insertId;

        await conexion.execute(
            `INSERT INTO diagnostico
                (id_usuario, puntaje_obtenido, nivel_asignado, fecha_realizacion)
             VALUES (?, 6, 'Genin (Iniciado)', CURRENT_DATE)`,
            [idUsuarioOriginal]
        );
        await conexion.execute(
            `INSERT INTO progreso_estudiante
                (id_usuario, id_modulo, porcentaje_avance, intentos_realizados, ultima_actualizacion)
             VALUES (?, ?, 50, 1, NOW())`,
            [idUsuarioOriginal, idModulo]
        );

        await conexion.query('SAVEPOINT antes_actualizacion');
        await conexion.execute(
            'UPDATE usuarios SET nombre_completo = ? WHERE id_usuario = ?',
            ['Nombre Modificado', idUsuarioOriginal]
        );
        await conexion.query('ROLLBACK TO SAVEPOINT antes_actualizacion');
        const [[usuarioRevertido]] = await conexion.execute(
            'SELECT nombre_completo FROM usuarios WHERE id_usuario = ?',
            [idUsuarioOriginal]
        );
        comprobaciones.rollback_savepoint =
            usuarioRevertido.nombre_completo === 'Usuario Auditoría';

        const idUsuarioActualizado = -idUsuarioOriginal;
        await conexion.execute(
            'UPDATE usuarios SET id_usuario = ? WHERE id_usuario = ?',
            [idUsuarioActualizado, idUsuarioOriginal]
        );
        const [[cascadaDiagnosticoUpdate]] = await conexion.execute(
            'SELECT COUNT(*) AS total FROM diagnostico WHERE id_usuario = ?',
            [idUsuarioActualizado]
        );
        const [[cascadaProgresoUpdate]] = await conexion.execute(
            'SELECT COUNT(*) AS total FROM progreso_estudiante WHERE id_usuario = ?',
            [idUsuarioActualizado]
        );
        comprobaciones.cascada_update_usuario =
            Number(cascadaDiagnosticoUpdate.total) === 1 &&
            Number(cascadaProgresoUpdate.total) === 1;
        comprobaciones.detalle_cascada_update = {
            diagnosticos_actualizados: Number(cascadaDiagnosticoUpdate.total),
            progresos_actualizados: Number(cascadaProgresoUpdate.total)
        };

        await conexion.query('ROLLBACK TO SAVEPOINT antes_actualizacion');
        await conexion.execute(
            'DELETE FROM usuarios WHERE id_usuario = ?',
            [idUsuarioOriginal]
        );
        const [[cascadaDiagnosticoDelete]] = await conexion.execute(
            'SELECT COUNT(*) AS total FROM diagnostico WHERE id_usuario = ?',
            [idUsuarioOriginal]
        );
        const [[cascadaProgresoDelete]] = await conexion.execute(
            'SELECT COUNT(*) AS total FROM progreso_estudiante WHERE id_usuario = ?',
            [idUsuarioOriginal]
        );
        const [[moduloConservado]] = await conexion.execute(
            'SELECT COUNT(*) AS total FROM modulos WHERE id_modulo = ?',
            [idModulo]
        );
        comprobaciones.cascada_delete_usuario =
            Number(cascadaDiagnosticoDelete.total) === 0 &&
            Number(cascadaProgresoDelete.total) === 0 &&
            Number(moduloConservado.total) === 1;
        comprobaciones.detalle_cascada_delete = {
            diagnosticos_restantes: Number(cascadaDiagnosticoDelete.total),
            progresos_restantes: Number(cascadaProgresoDelete.total),
            modulos_restantes: Number(moduloConservado.total)
        };

        await conexion.rollback();

        const [[limpiezaUsuario]] = await conexion.execute(
            'SELECT COUNT(*) AS total FROM usuarios WHERE correo = ?',
            [correo]
        );
        const [[limpiezaModulo]] = await conexion.execute(
            'SELECT COUNT(*) AS total FROM modulos WHERE nombre_modulo = ?',
            [nombreModulo]
        );
        comprobaciones.rollback_total_sin_residuos =
            Number(limpiezaUsuario.total) === 0 &&
            Number(limpiezaModulo.total) === 0;

        return comprobaciones;
    } catch (error) {
        await conexion.rollback();
        throw error;
    }
};

const main = async () => {
    const conexion = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8mb4'
    });

    try {
        const [[identidad]] = await conexion.query(
            'SELECT DATABASE() AS base, VERSION() AS version'
        );
        const modelosAuditados = await auditarModelos(conexion);
        const transacciones = await auditarTransaccionYCascadas(conexion);

        const comprobacionesBooleanas = Object.entries(transacciones)
            .filter(([, valor]) => typeof valor === 'boolean')
            .map(([, valor]) => valor);

        const resultado = {
            entorno: {
                base: identidad.base,
                version_mysql: identidad.version,
                host: process.env.DB_HOST,
                puerto: Number(process.env.DB_PORT || 3306)
            },
            modelos: modelosAuditados,
            transacciones,
            resultado_transacciones: comprobacionesBooleanas.every(Boolean)
                ? 'PASS'
                : 'FAIL',
            resultado_modelos: modelosAuditados.diferencias.length === 0
                ? 'PASS'
                : 'DIFERENCIAS_ENCONTRADAS'
        };

        console.log(JSON.stringify(resultado, null, 2));
        if (!resultado.resultado_transacciones) process.exitCode = 1;
    } finally {
        await conexion.end();
    }
};

main().catch((error) => {
    console.error(JSON.stringify({
        error: error.message,
        codigo: error.code || null
    }, null, 2));
    process.exitCode = 1;
});
