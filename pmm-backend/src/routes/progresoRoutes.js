const express = require('express');
const router = express.Router();
const progresoController = require('../controllers/progresoController');

//  EL PARCHE MAESTRO: Extraemos la función específica con llaves { }
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

const { verificarAccesoModulo } = require('../middlewares/accesoModuloMiddleware');

const accesoPorParametro = verificarAccesoModulo({
    fuente: 'params',
    campo: 'id_modulo'
});

const accesoPorBody = verificarAccesoModulo({
    fuente: 'body',
    campo: 'id_modulo'
});

// 1. Actualizar progreso parcial (mientras hace el módulo)
router.post(
    '/actualizar',
    verificarToken,
    verificarRol(['estudiante']),
    accesoPorBody,
    progresoController.actualizarProgreso
);


// 2. Obtener estado de un módulo
router.get(
    '/estado/:id_modulo',
    verificarToken,
    verificarRol(['estudiante']),
    accesoPorParametro,
    progresoController.obtenerEstadoModulo
);

module.exports = router;
