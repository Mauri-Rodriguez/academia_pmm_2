// Archivo: src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
    limitarLogin,
    limitarRegistro,
    limitarRecuperacion
} = require('../middlewares/rateLimitAuth');

// Definición de las rutas REST (rate limit H-001 en autenticación/recuperación)
router.post('/register', limitarRegistro, authController.register);
router.post('/login', limitarLogin, authController.login);
router.post('/google-login', limitarLogin, authController.googleLogin);
router.post('/forgot-password', limitarRecuperacion, authController.forgotPassword);
router.post('/reset-password/:token', limitarRecuperacion, authController.resetPassword);
router.get('/verificar/:token', authController.verificarCorreo);
module.exports = router;