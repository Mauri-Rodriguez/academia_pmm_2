// Gestiona la entrega segura de ejercicios y su evaluación en el servidor.

const db = require('../config/database');
const Ejercicio = require('../models/Ejercicio');
const ProgresoEstudiante = require('../models/ProgresoEstudiante');
const { finalizarModulo } = require('../services/finalizacionModuloService');

const normalizarOpcion = (valor) => {
    const opcion = String(valor || '').trim().toLowerCase();
    return /^[a-d]$/.test(opcion) ? `opcion_${opcion}` : opcion;
};

/** Entrega los ejercicios sin incluir la respuesta correcta. */
exports.obtenerEjerciciosPorModulo = async (req, res) => {
    try {
        const { id_modulo } = req.params;
        const ejercicios = await Ejercicio.findAll({
            where: { id_modulo },
            attributes: { exclude: ['respuesta_correcta'] },
            order: [['id_ejercicio', 'ASC']]
        });

        if (!ejercicios || ejercicios.length === 0) {
            return res.status(404).json({
                mensaje: 'Aún no hay pergaminos de entrenamiento para este módulo.'
            });
        }

        return res.status(200).json({
            mensaje: 'Ejercicios cargados con éxito.',
            total: ejercicios.length,
            data: ejercicios
        });
    } catch (error) {
        console.error('Error al obtener los ejercicios:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor al consultar la biblioteca.'
        });
    }
};

/**
 * Evalúa una respuesta, exige el orden pedagógico y actualiza el progreso.
 * La respuesta correcta nunca forma parte de la respuesta HTTP.
 */
exports.evaluarEjercicio = async (req, res) => {
    let transaction;

    try {
        const idUsuario = req.user?.id_usuario || req.user?.id;
        const idEjercicio = Number(req.body?.id_ejercicio);
        const respuestaNormalizada = normalizarOpcion(req.body?.respuesta_estudiante);

        if (!idUsuario) {
            return res.status(401).json({ mensaje: 'Sello de identidad no encontrado.' });
        }

        if (!Number.isInteger(idEjercicio) || idEjercicio <= 0 ||
            !/^opcion_[a-d]$/.test(respuestaNormalizada)) {
            return res.status(400).json({
                mensaje: 'El ejercicio y la opción seleccionada deben ser válidos.'
            });
        }

        const ejercicio = await Ejercicio.findByPk(idEjercicio);
        if (!ejercicio) {
            return res.status(404).json({ mensaje: 'El ejercicio indicado no existe.' });
        }

        const idModulo = ejercicio.id_modulo;
        const ejerciciosModulo = await Ejercicio.findAll({
            where: { id_modulo: idModulo },
            attributes: ['id_ejercicio'],
            order: [['id_ejercicio', 'ASC']],
            raw: true
        });

        if (ejerciciosModulo.length === 0) {
            return res.status(404).json({ mensaje: 'El módulo no tiene ejercicios.' });
        }

        transaction = await db.transaction();

        let progreso = await ProgresoEstudiante.findOne({
            where: { id_usuario: idUsuario, id_modulo: idModulo },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!progreso) {
            progreso = await ProgresoEstudiante.create({
                id_usuario: idUsuario,
                id_modulo: idModulo,
                porcentaje_avance: 0,
                intentos_realizados: 0,
                ultima_actualizacion: new Date()
            }, { transaction });
        }

        const totalEjercicios = ejerciciosModulo.length;
        const porcentajeActual = Math.max(
            0,
            Math.min(100, Number(progreso.porcentaje_avance) || 0)
        );
        const modoRepaso = porcentajeActual >= 100;
        let ejerciciosCompletados = modoRepaso
            ? totalEjercicios
            : Math.max(
                0,
                Math.min(
                    totalEjercicios - 1,
                    Math.round((porcentajeActual / 100) * totalEjercicios)
                )
            );

        if (!modoRepaso) {
            const ejercicioEsperado = ejerciciosModulo[ejerciciosCompletados];

            if (Number(ejercicioEsperado.id_ejercicio) !== idEjercicio) {
                await transaction.rollback();
                transaction = null;

                return res.status(409).json({
                    mensaje: 'Debes resolver los ejercicios del módulo en orden.',
                    siguiente_indice: ejerciciosCompletados,
                    progreso_actual: Math.round(porcentajeActual)
                });
            }
        }

        const esCorrecta = normalizarOpcion(ejercicio.respuesta_correcta) ===
            respuestaNormalizada;

        progreso.intentos_realizados = Number(progreso.intentos_realizados || 0) + 1;
        progreso.ultima_actualizacion = new Date();

        if (esCorrecta && !modoRepaso) {
            ejerciciosCompletados += 1;
            progreso.porcentaje_avance = ejerciciosCompletados === totalEjercicios
                ? 100
                : (ejerciciosCompletados / totalEjercicios) * 100;
        }

        await progreso.save({ transaction });

        const indiceEjercicioActual = ejerciciosModulo.findIndex(
            (item) => Number(item.id_ejercicio) === idEjercicio
        );
        const moduloCompletado = esCorrecta && (
            (!modoRepaso && ejerciciosCompletados === totalEjercicios) ||
            (modoRepaso && indiceEjercicioActual === totalEjercicios - 1)
        );
        let finalizacion = null;

        if (moduloCompletado && !modoRepaso) {
            finalizacion = await finalizarModulo({
                idUsuario,
                idModulo,
                transaction
            });
        }

        await transaction.commit();
        transaction = null;

        return res.status(200).json({
            es_correcta: esCorrecta,
            mensaje: esCorrecta
                ? '¡Excelente! Respuesta correcta. Dominas este concepto.'
                : 'Respuesta incorrecta. Revisa tus sellos e inténtalo de nuevo.',
            modulo_completado: moduloCompletado,
            modo_repaso: modoRepaso,
            siguiente_indice: modoRepaso
                ? null
                : Math.min(ejerciciosCompletados, totalEjercicios - 1),
            finalizacion,
            estadisticas_modulo: {
                intentos_totales: progreso.intentos_realizados,
                progreso_actual: `${Math.round(progreso.porcentaje_avance)}%`
            }
        });
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }

        console.error('Error al evaluar el ejercicio:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor al procesar la respuesta.'
        });
    }
};
