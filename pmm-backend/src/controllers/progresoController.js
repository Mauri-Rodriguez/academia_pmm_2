/**
 * ============================================================================
 * Archivo: src/controllers/progresoController.js
 * Propósito: Gestión lógica del avance estudiantil e insignias instantáneas.
 * ============================================================================
 */

const sequelize = require('../config/database'); 
const ProgresoEstudiante = require('../models/ProgresoEstudiante');


/**
 * Actualiza el progreso parcial de un estudiante en un módulo.
 * Implementa "Piso de Cristal": solo actualiza si el nuevo porcentaje es mayor.
 * @param {import('express').Request} req - Petición Express (body: id_modulo, porcentaje).
 * @param {import('express').Response} res - Respuesta Express.
 * @returns {Promise<void>}
 */
exports.actualizarProgreso = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id_modulo, porcentaje } = req.body;
        const id_usuario = req.user.id_usuario || req.user.id;

        let progreso = await ProgresoEstudiante.findOne({
            where: { id_usuario, id_modulo },
            transaction: t
        });

        if (progreso) {
            if (porcentaje > progreso.porcentaje_avance) progreso.porcentaje_avance = porcentaje;
            progreso.intentos_realizados += 1;
            progreso.ultima_actualizacion = new Date();
            await progreso.save({ transaction: t });
        } else {
            progreso = await ProgresoEstudiante.create({
                id_usuario, id_modulo, porcentaje_avance: porcentaje,
                intentos_realizados: 1, ultima_actualizacion: new Date()
            }, { transaction: t });
        }

        await t.commit();
        res.json({ success: true, data: progreso });
    } catch (error) {
        if (t) await t.rollback();
        res.status(500).json({ error: "Falla en actualización" });
    }
};

/**
 * Recupera el progreso (porcentaje de avance) de un estudiante en un módulo específico.
 * @param {import('express').Request} req - Petición Express (params: id_modulo).
 * @param {import('express').Response} res - Respuesta Express.
 * @returns {Promise<void>} JSON con el progreso o 0 si no existe.
 */
exports.obtenerEstadoModulo = async (req, res) => {
    try {
        const { id_modulo } = req.params;
        const id_usuario = req.user.id_usuario || req.user.id;
        
        const registro = await ProgresoEstudiante.findOne({ 
            where: { id_usuario, id_modulo } 
        });

        res.json(registro || { porcentaje_avance: 0 });
    } catch (error) {
        console.error("❌ Error en obtenerEstadoModulo:", error);
        res.status(500).json({ error: "Error al consultar estado" });
    }
};