
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biblioteca_pergaminos` (
  `id_pergamino` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nivel_requerido` enum('Bajo','Intermedio','Alto') COLLATE utf8mb4_general_ci DEFAULT 'Bajo',
  `url_recurso` text COLLATE utf8mb4_general_ci,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `fecha_subida` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_recurso` enum('pdf','video','enlace') COLLATE utf8mb4_general_ci DEFAULT 'enlace',
  PRIMARY KEY (`id_pergamino`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostico` (
  `id_diagnostico` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `puntaje_obtenido` float NOT NULL,
  `nivel_asignado` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_realizacion` date NOT NULL,
  PRIMARY KEY (`id_diagnostico`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_diagnostico_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicios` (
  `id_ejercicio` int NOT NULL AUTO_INCREMENT,
  `id_modulo` int NOT NULL,
  `pregunta` text COLLATE utf8mb4_general_ci NOT NULL,
  `opcion_a` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `opcion_b` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `opcion_c` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `opcion_d` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `respuesta_correcta` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_ejercicio`),
  KEY `id_modulo` (`id_modulo`),
  CONSTRAINT `fk_ejercicios_modulos_v2` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foro_comentarios` (
  `id_comentario` int NOT NULL AUTO_INCREMENT,
  `id_post` int NOT NULL,
  `id_usuario` int NOT NULL,
  `comentario` text COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_comentario` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_comentario`),
  KEY `id_post` (`id_post`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_comentarios_posts_v2` FOREIGN KEY (`id_post`) REFERENCES `foro_posts` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comentarios_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foro_posts` (
  `id_post` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `titulo` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `contenido` text COLLATE utf8mb4_general_ci NOT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_post`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_posts_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_errores` (
  `id_error` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_pregunta` int NOT NULL,
  `respuesta_dada` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_error` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `explicacion_ia` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id_error`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_pregunta` (`id_pregunta`),
  CONSTRAINT `fk_errores_ejercicios_v2` FOREIGN KEY (`id_pregunta`) REFERENCES `ejercicios` (`id_ejercicio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_errores_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insignias` (
  `id_insignia` int NOT NULL AUTO_INCREMENT,
  `nombre_insignia` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_insignia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecciones` (
  `id_leccion` int NOT NULL AUTO_INCREMENT,
  `id_modulo` int DEFAULT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contenido_texto` text COLLATE utf8mb4_general_ci,
  `url_video` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `orden` int DEFAULT NULL,
  PRIMARY KEY (`id_leccion`),
  KEY `id_modulo` (`id_modulo`),
  CONSTRAINT `fk_lecciones_modulos_v2` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logros_usuario` (
  `id_logro` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `tipo_logro` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_modulo` int DEFAULT NULL,
  `fecha_obtencion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_logro`),
  KEY `id_usuario` (`id_usuario`),
  KEY `fk_logros_modulos_v2` (`id_modulo`),
  CONSTRAINT `fk_logros_modulos_v2` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_logros_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulos` (
  `id_modulo` int NOT NULL AUTO_INCREMENT,
  `nombre_modulo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `nivel` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_modulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `mensaje` text COLLATE utf8mb4_general_ci,
  `leida` tinyint(1) DEFAULT '0',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ruta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_notificaciones_usuarios_v2` (`id_usuario`),
  CONSTRAINT `fk_notificaciones_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas_diagnostico` (
  `id_pregunta` int NOT NULL AUTO_INCREMENT,
  `pregunta` text COLLATE utf8mb4_general_ci NOT NULL,
  `opcion_a` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `opcion_b` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `opcion_c` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `opcion_d` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `respuesta_correcta` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_pregunta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progreso_estudiante` (
  `id_progreso` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_modulo` int NOT NULL,
  `porcentaje_avance` float DEFAULT '0',
  `intentos_realizados` int DEFAULT '0',
  `ultima_actualizacion` datetime NOT NULL,
  PRIMARY KEY (`id_progreso`),
  UNIQUE KEY `idx_usuario_modulo` (`id_usuario`,`id_modulo`),
  KEY `id_modulo` (`id_modulo`),
  CONSTRAINT `fk_progreso_modulos_v2` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_progreso_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportes_docente` (
  `id_reporte` int NOT NULL AUTO_INCREMENT,
  `id_docente` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `tipo_reporte` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `detalle` text COLLATE utf8mb4_general_ci,
  `fecha_generacion` datetime NOT NULL,
  PRIMARY KEY (`id_reporte`),
  KEY `id_docente` (`id_docente`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `fk_reportes_docente_v2` FOREIGN KEY (`id_docente`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reportes_estudiante_v2` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultados_modulos` (
  `id_resultado` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_modulo` int NOT NULL,
  `puntaje_final` float NOT NULL,
  `fecha_finalizacion` datetime NOT NULL,
  PRIMARY KEY (`id_resultado`),
  KEY `fk_resultados_usuarios_v2` (`id_usuario`),
  KEY `fk_resultados_modulos_v2` (`id_modulo`),
  CONSTRAINT `fk_resultados_modulos_v2` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_resultados_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `hash_password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `rol` enum('estudiante','docente','administrador') COLLATE utf8mb4_general_ci NOT NULL,
  `foto_perfil` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rango_actual` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'Recluta',
  `puntaje_total` int DEFAULT '0',
  `racha_dias` int DEFAULT '0',
  `fecha_registro` date DEFAULT NULL,
  `ultima_conexion` datetime DEFAULT NULL,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Activo',
  `verificado` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verification_token_expiry` bigint DEFAULT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiry` bigint DEFAULT NULL,
  `rango` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Recluta',
  `fecha_aceptacion_terminos` datetime DEFAULT CURRENT_TIMESTAMP,
  `acepta_politica_privacidad` tinyint(1) DEFAULT '1',
  `fecha_aceptacion_politica` datetime DEFAULT NULL,
  `version_politica_privacidad` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acepta_terminos` tinyint(1) NOT NULL DEFAULT '0',
  `version_terminos` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_insignias` (
  `id_usuario` int NOT NULL,
  `id_insignia` int NOT NULL,
  `fecha_otorgada` datetime NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_insignia`),
  KEY `fk_ui_insignias_v2` (`id_insignia`),
  CONSTRAINT `fk_ui_insignias_v2` FOREIGN KEY (`id_insignia`) REFERENCES `insignias` (`id_insignia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ui_usuarios_v2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

