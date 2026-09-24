const express = require('express');
const router = express.Router();
const ejercicioController = require('../controllers/ejercicioController');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');
const { verificarAccesoModulo } = require('../middlewares/accesoModuloMiddleware');

const accesoPorParametro = verificarAccesoModulo({
    fuente: 'params',
    campo: 'id_modulo'
});

const accesoPorEjercicio = verificarAccesoModulo({
    fuente: 'ejercicio',
    campo: 'id_ejercicio'
});

// Ruta GET para obtener los ejercicios de un módulo (Protegida)
// Usamos :id_modulo como un parámetro dinámico en la URL
router.get(
    '/modulo/:id_modulo',
    verificarToken,
    verificarRol(['estudiante']),
    accesoPorParametro,
    ejercicioController.obtenerEjerciciosPorModulo
);

router.post(
    '/evaluar',
    verificarToken,
    verificarRol(['estudiante']),
    accesoPorEjercicio,
    ejercicioController.evaluarEjercicio
);

module.exports = router;