const express = require('express');
const router = express.Router();
const progresoController = require('../controllers/progresoController');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');
const { verificarAccesoModulo } = require('../middlewares/accesoModuloMiddleware');

const accesoPorParametro = verificarAccesoModulo({
    fuente: 'params',
    campo: 'id_modulo'
});

// El avance es de solo lectura aquí: solo cambia al evaluar un ejercicio.
router.get(
    '/estado/:id_modulo',
    verificarToken,
    verificarRol(['estudiante']),
    accesoPorParametro,
    progresoController.obtenerEstadoModulo
);

module.exports = router;
