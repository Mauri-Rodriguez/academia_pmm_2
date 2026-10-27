# Trazabilidad monografía → software → prueba

| Afirmación académica | Componente | Prueba | ¿Coincide? |
|---|---|---|---|
| Registro/login seguro (HU-01) | `authController`, Login/Registro | Matrices auth + prod login | Sí, con CA-01.1 documentado |
| Recuperación de contraseña (HU-02) | forgot/reset | Matriz Etapa 2 | Sí |
| Diagnóstico 13 preguntas y nivel (HU-03) | diagnostico + Flask | Local + prod Genin 4/13 | Sí |
| Ruta por nivel y bloqueos (HU-04) | dashboard + accesoModulo | Prod 403 | Sí |
| Feedback inmediato (HU-05) | ejercicioController + ModuloEstudio | Visual + prod | Sí (corregido) |
| Tutor IA con nivel/contexto (HU-06) | consultarOraculo | Mocks + prod | Sí c/ limitación semántica |
| Progreso visible (HU-07) | dashboard | Prod 10% Genin | Sí |
| Biblioteca (HU-08) | biblioteca_pergaminos | API/estático | Sí |
| Panel docente (HU-09) | resumen-estudiantes | Prod 43 filas | Sí |
| Reporte individual (HU-10) | reporte-individual | Prod Genin | Sí |
| Errores frecuentes (HU-11) | fallos_comunes / historial | `evaluarEjercicio` registra fallo; `registrar-fallo` completa IA | Sí |
| Búsqueda (HU-12) | DashboardDocente filtro | Código | Sí |
| Excel (HU-13) | descargar-excel | Prod xlsx | Sí |
| Rangos e insignias (HU-14) | finalizacionModulo + perfil | Código + dash | Sí |
| Comunidad + imagen + notificación (HU-15) | foro + Multer + notificaciones | Etapa 2 | Sí |
| Suite Jest backend | Jest | 13/13 actuales (histórico 22 documentado) | Sí (cobertura acotada a controladores vivos) |
| Clasificador 0–6 / 7–10 / 11–13 | Flask + fallback Node | Matriz 0–13 | Sí |
| 21 módulos / 210 ejercicios / 17 tablas | schema + seed | Consultas Etapa 1/7 | Sí |
