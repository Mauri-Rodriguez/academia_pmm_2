# Matriz de permisos

Leyenda: `OK` = comportamiento esperado verificado; `—` = no aplicable.

| Recurso | Sin token | Estudiante | Docente |
|---|---|---|---|
| `GET /api/estudiante/dashboard` | 401 | 200 (con diagnóstico) / 403 (sin) | 403 |
| `GET /api/diagnostico/preguntas` | 401 | 200 / 409 si ya diagnosticó | 403 |
| `POST /api/diagnostico/evaluar` | 401 | 200 una vez | 403 |
| `GET /api/ejercicios/modulo/:id` | 401 | 200 si ruta/secuencia; 403 si no | 403 |
| `POST /api/ejercicios/evaluar` | 401 | 200 con reglas de orden | 403 |
| `POST /api/estudiante/tutor-ia` | 401 | 200/400/503 según entrada/clave | 403 |
| `GET /api/docente/resumen-estudiantes` | 401 | 403 | 200 |
| `GET /api/docente/reporte-individual/:id` | 401 | 403 | 200 si estudiante; 404 si docente/inexistente; 400 si id inválido |
| `GET /api/docente/descargar-excel` | 401 | 403 | 200 |
| Foro editar/eliminar ajeno | 401 | 404 | — (ruta estudiante) |
| Notificación ajena | 401 | 404 | — |

Notas:

- Rol se asigna en servidor (ignora `rol` enviado en registro).
- Propiedad de foro/comentarios/notificaciones verificada dinámicamente en local (Etapa 2).
- Alcance de objeto en reporte docente corregido y verificado en local y prod.
