const { Op, QueryTypes } = require('sequelize');
const db = require('../config/database');
const Modulo = require('../models/Modulo');
const ProgresoEstudiante = require('../models/ProgresoEstudiante');
const Usuario = require('../models/Usuario');

const EMOJIS_INSIGNIA = {
    1: '🧬',
    2: '🔍',
    3: '📉',
    4: '📐',
    5: '♾️',
    6: '📈',
    7: '📊',
    10: '⚖️',
    11: '🗺️',
    12: '🏹',
    14: '🌑',
    15: '🌱',
    16: '🛡️',
    17: '🧪',
    18: '🔭',
    19: '👣',
    20: '⛓️',
    21: '🎯',
    22: '🏰',
    23: '✂️',
    24: '🧈',
    25: '🏺',
    101: '⚔️',
    102: '⛩️',
    103: '👑'
};

const NIVELES_POR_RANGO = {
    'Genin (Iniciado)': ['Genin (Iniciado)'],
    'Chunin (Guerrero)': ['Genin (Iniciado)', 'Chunin (Guerrero)'],
    'Jonin (Maestro)': [
        'Genin (Iniciado)',
        'Chunin (Guerrero)',
        'Jonin (Maestro)'
    ],
    'Kage (Leyenda)': [
        'Genin (Iniciado)',
        'Chunin (Guerrero)',
        'Jonin (Maestro)'
    ]
};

/**
 * Otorga la insignia del módulo y evalúa el ascenso del estudiante.
 * Debe ejecutarse dentro de la misma transacción que marca el progreso en 100%.
 */
const finalizarModulo = async ({ idUsuario, idModulo, transaction }) => {
    await db.query(
        `INSERT IGNORE INTO usuarios_insignias
            (id_usuario, id_insignia, fecha_otorgada)
         VALUES (?, ?, NOW())`,
        {
            replacements: [idUsuario, idModulo],
            transaction
        }
    );

    let insignia = null;
    const [insigniaDb] = await db.query(
        `SELECT id_insignia, nombre_insignia AS nombre
         FROM insignias
         WHERE id_insignia = ?
         LIMIT 1`,
        {
            replacements: [idModulo],
            type: QueryTypes.SELECT,
            transaction
        }
    );

    if (insigniaDb) {
        insignia = {
            nombre: insigniaDb.nombre,
            url_imagen: EMOJIS_INSIGNIA[insigniaDb.id_insignia] || '🏅'
        };
    }

    const usuario = await Usuario.findByPk(idUsuario, { transaction });
    const rangoActual = usuario?.rango_actual || usuario?.rango || 'Genin (Iniciado)';
    const nivelesAEvaluar = NIVELES_POR_RANGO[rangoActual] || [];

    const modulosDelNivel = await Modulo.findAll({
        where: { nivel: { [Op.in]: nivelesAEvaluar } },
        attributes: ['id_modulo'],
        transaction
    });

    const idsModulosNivel = modulosDelNivel.map((modulo) => modulo.id_modulo);
    const totalMisionesNivel = idsModulosNivel.length;

    const completadosDelNivel = totalMisionesNivel === 0
        ? 0
        : await ProgresoEstudiante.count({
            distinct: true,
            col: 'id_modulo',
            where: {
                id_usuario: idUsuario,
                porcentaje_avance: 100,
                id_modulo: { [Op.in]: idsModulosNivel }
            },
            transaction
        });

    let nuevoRango = rangoActual;
    let mensajeAscenso = '';

    if (totalMisionesNivel > 0 && completadosDelNivel === totalMisionesNivel) {
        if (rangoActual.includes('Genin')) {
            nuevoRango = 'Chunin (Guerrero)';
            mensajeAscenso = '¡Felicidades! La aldea te reconoce ahora como Chunin.';
        } else if (rangoActual.includes('Chunin')) {
            nuevoRango = 'Jonin (Maestro)';
            mensajeAscenso = '¡Increíble! Has alcanzado el rango de Maestro Jonin.';
        } else if (rangoActual.includes('Jonin')) {
            nuevoRango = 'Kage (Leyenda)';
            mensajeAscenso = '¡Has dominado todas las artes! Ahora eres una Leyenda viva.';
        }
    }

    const ascendio = nuevoRango !== rangoActual;

    if (ascendio) {
        await db.query(
            'UPDATE usuarios SET rango = ?, rango_actual = ? WHERE id_usuario = ?',
            {
                replacements: [nuevoRango, nuevoRango, idUsuario],
                transaction
            }
        );

        await db.query(
            `UPDATE diagnostico
             SET nivel_asignado = ?
             WHERE id_usuario = ?
             ORDER BY fecha_realizacion DESC
             LIMIT 1`,
            {
                replacements: [nuevoRango, idUsuario],
                transaction
            }
        );

        let idMedallaRango = 101;
        if (nuevoRango.includes('Jonin')) idMedallaRango = 102;
        if (nuevoRango.includes('Kage')) idMedallaRango = 103;

        await db.query(
            `INSERT IGNORE INTO usuarios_insignias
                (id_usuario, id_insignia, fecha_otorgada)
             VALUES (?, ?, NOW())`,
            {
                replacements: [idUsuario, idMedallaRango],
                transaction
            }
        );

        await db.query(
            `INSERT INTO notificaciones
                (id_usuario, mensaje, ruta, leida, fecha_creacion)
             VALUES (?, ?, NULL, 0, NOW())`,
            {
                replacements: [idUsuario, mensajeAscenso],
                transaction
            }
        );
    }

    return {
        insignia,
        ascendio,
        detallesAscenso: ascendio
            ? { nuevoNivel: nuevoRango, mensaje: mensajeAscenso }
            : null
    };
};

module.exports = { finalizarModulo };
