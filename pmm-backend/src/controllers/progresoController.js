/**
 * ============================================================================
 * Archivo: src/controllers/progresoController.js
 * Propósito: Consulta de avance estudiantil por módulo (solo lectura).
 * La escritura del progreso ocurre al evaluar ejercicios.
 * ============================================================================
 */

const ProgresoEstudiante = require('../models/ProgresoEstudiante');

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
