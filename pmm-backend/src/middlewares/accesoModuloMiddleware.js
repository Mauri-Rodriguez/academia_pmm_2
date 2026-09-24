const { Op, QueryTypes } = require('sequelize');
const db = require('../config/database');
const Modulo = require('../models/Modulo');
const Ejercicio = require('../models/Ejercicio');
const ProgresoEstudiante = require('../models/ProgresoEstudiante');

const nivelesPorRango = {
    'Genin (Iniciado)': [
        'Genin (Iniciado)'
    ],
    'Chunin (Guerrero)': [
        'Genin (Iniciado)',
        'Chunin (Guerrero)'
    ],
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

const obtenerIdUsuario = (req) =>
    req.user?.id_usuario || req.user?.id;

const resolverIdModulo = async (req, fuente, campo) => {
    const valor = fuente === 'params'
        ? req.params[campo]
        : req.body[campo];

    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    if (fuente !== 'ejercicio') {
        return id;
    }

    const ejercicio = await Ejercicio.findByPk(id, {
        attributes: ['id_modulo']
    });

    return ejercicio?.id_modulo || null;
};

exports.verificarAccesoModulo = ({
    fuente = 'params',
    campo = 'id_modulo'
} = {}) => {
    return async (req, res, next) => {
        try {
            const idUsuario = obtenerIdUsuario(req);

            if (!idUsuario) {
                return res.status(401).json({
                    mensaje: 'No se pudo identificar al estudiante.'
                });
            }

            const idModulo = await resolverIdModulo(
                req,
                fuente,
                campo
            );

            if (!idModulo) {
                return res.status(400).json({
                    mensaje: 'El módulo o ejercicio indicado no es válido.'
                });
            }

            const usuarios = await db.query(
                `SELECT rango_actual, rango
                 FROM usuarios
                 WHERE id_usuario = ?
                 LIMIT 1`,
                {
                    replacements: [idUsuario],
                    type: QueryTypes.SELECT
                }
            );

            const usuario = usuarios[0];

            if (!usuario) {
                return res.status(404).json({
                    mensaje: 'Estudiante no encontrado.'
                });
            }

            const rango =
                usuario.rango_actual ||
                usuario.rango;

            const nivelesPermitidos =
                nivelesPorRango[rango];

            if (!nivelesPermitidos) {
                return res.status(403).json({
                    mensaje: 'Debes completar el diagnóstico antes de acceder a los módulos.'
                });
            }

            const ruta = await Modulo.findAll({
                where: {
                    nivel: {
                        [Op.in]: nivelesPermitidos
                    }
                },
                attributes: ['id_modulo'],
                order: [
                    [
                        db.literal(
                            "FIELD(nivel, 'Genin (Iniciado)', 'Chunin (Guerrero)', 'Jonin (Maestro)')"
                        ),
                        'ASC'
                    ],
                    ['id_modulo', 'ASC']
                ],
                raw: true
            });

            const posicion = ruta.findIndex(
                modulo =>
                    Number(modulo.id_modulo) ===
                    Number(idModulo)
            );

            if (posicion === -1) {
                return res.status(403).json({
                    mensaje: 'Este módulo no pertenece a tu ruta de aprendizaje actual.'
                });
            }

            const anteriores = ruta
                .slice(0, posicion)
                .map(modulo => modulo.id_modulo);

            if (anteriores.length > 0) {
                const completados =
                    await ProgresoEstudiante.count({
                        distinct: true,
                        col: 'id_modulo',
                        where: {
                            id_usuario: idUsuario,
                            id_modulo: {
                                [Op.in]: anteriores
                            },
                            porcentaje_avance: {
                                [Op.gte]: 100
                            }
                        }
                    });

                if (completados !== anteriores.length) {
                    return res.status(403).json({
                        mensaje: 'Debes completar el módulo anterior antes de continuar.'
                    });
                }
            }

            req.idModuloAutorizado = idModulo;
            next();
        } catch (error) {
            console.error(
                'Error validando acceso secuencial:',
                error
            );

            res.status(500).json({
                mensaje: 'No fue posible validar el acceso al módulo.'
            });
        }
    };
};