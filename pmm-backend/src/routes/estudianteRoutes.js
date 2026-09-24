const express = require("express");
const router = express.Router();
const estudianteController = require("../controllers/estudianteController");
const upload = require("../middlewares/subidaMiddleware");
const {
  verificarToken,
  verificarRol,
} = require("../middlewares/authMiddleware");
const {
  verificarAccesoModulo,
} = require("../middlewares/accesoModuloMiddleware");

//  DEBUG: Verificación de carga
console.log("--- Rutas Sincronizadas ---");
// Todas las rutas de este archivo son exclusivas para estudiantes.
router.use(verificarToken, verificarRol(["estudiante"]));
const accesoPorParametro = verificarAccesoModulo({
  fuente: "params",
  campo: "id_modulo",
});

const accesoPorBody = verificarAccesoModulo({
  fuente: "body",
  campo: "id_modulo",
});

const accesoPorEjercicio = verificarAccesoModulo({
  fuente: "ejercicio",
  campo: "id_pregunta",
});

// ---  RUTAS DE CONSULTA (GET) ---
router.get("/dashboard", estudianteController.obtenerDashboard);
router.get("/ranking", estudianteController.obtenerRanking);
router.get("/biblioteca", estudianteController.obtenerBiblioteca);
router.get(
  "/modulo/:id_modulo/ejercicios",
  accesoPorParametro,
  estudianteController.obtenerEjerciciosModulo,
);
router.get("/errores-recientes", estudianteController.obtenerErroresRecientes);
router.get("/sugerencia-ia", estudianteController.obtenerSugerenciaIA);

//  Perfil y Notificaciones
router.get("/perfil/datos", estudianteController.obtenerPerfil);
router.get("/notificaciones", estudianteController.obtenerNotificaciones);
router.put("/notificaciones/:id/leer", estudianteController.marcarNotificacionLeida,);

//  Foro
router.get("/foro/temas", estudianteController.obtenerTemasForo);
router.get("/foro/comentarios/:id_post", estudianteController.obtenerComentarios,);
// La ruta blindada definitiva:
router.post("/tutor-ia", accesoPorEjercicio, estudianteController.consultarOraculo,);

router.post("/actualizar-progreso", accesoPorBody, estudianteController.actualizarProgreso,
);

router.post("/registrar-fallo", accesoPorEjercicio, estudianteController.registrarFallo,);

router.post("/finalizar", accesoPorBody, estudianteController.finalizarModulo);
//  GESTIÓN DE AVATAR
router.post(
  "/perfil/avatar",
  (req, res, next) => {
    upload.single("avatar")(req, res, function (err) {
      if (err)
        return res
          .status(400)
          .json({ error: "Error de Multer: " + err.message });
      next();
    });
  },
  estudianteController.actualizarAvatar,
);

//  GESTIÓN DE FORO
router.post(
  "/foro/crear",
  (req, res, next) => {
    upload.single("imagen")(req, res, function (err) {
      if (err)
        return res
          .status(400)
          .json({ error: "Error al procesar imagen: " + err.message });
      next();
    });
  },
  estudianteController.crearMisionForo,
);

router.post("/foro/comentar", estudianteController.comentarMision);
router.put("/foro/comentario/:id_comentario", estudianteController.editarComentario,);
router.delete("/foro/comentario/:id_comentario", estudianteController.eliminarComentario,);
router.put(
  "/foro/post/:id_post",
  (req, res, next) => {
    upload.single("imagen")(req, res, function (err) {
      if (err)
        return res
          .status(400)
          .json({ error: "Error al procesar imagen: " + err.message });
      next();
    });
  },
  estudianteController.editarMision,
);
router.delete("/foro/post/:id_post", estudianteController.eliminarMision);

module.exports = router;
