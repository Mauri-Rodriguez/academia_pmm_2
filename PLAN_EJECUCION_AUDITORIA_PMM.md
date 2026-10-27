# Plan de ejecución y seguimiento de la auditoría de PMM Interactivo

## 1. Propósito

Este archivo es la **bitácora operativa** del equipo para ejecutar y registrar la auditoría técnica de PMM Interactivo.

El documento `PLAN_TRABAJO_AUDITORIA_TECNICA_PMM.md` (plan del profesor) es el criterio rector y no se modifica. Los dictámenes formales de entrega están en `docsRevisionRepo/` (`REVISION_TECNICA_PMM.md`, `RESULTADOS_PRUEBAS_PMM.md`, matrices). Este plan **no los sustituye**; los complementa con el detalle cronológico.

### Monografía de referencia

La monografía final (entrega 13–14 octubre 2026) **sí se utilizó** como base de trazabilidad (SHA-256 `E74F94FBB2A3A7D8A74E22A77718C11BF8BE0D75F996346D814BC87DB812D927`). **No se versiona en el repositorio** por contener datos sensibles; la exclusión queda documentada en `docsRevisionRepo/README.md` y `evidencias_revision/00_linea_base/`.

## 2. Reglas de trabajo

- No modificar código productivo sin autorización del responsable del proyecto.
- Antes de una corrección, registrar qué archivos cambiarían, qué se cambiaría y por qué.
- Conservar primero la evidencia del comportamiento encontrado.
- Separar los defectos del código de los bloqueos externos o de infraestructura.
- No realizar pruebas destructivas sobre producción.
- No eliminar ni modificar información de usuarios reales.
- Usar cuentas y datos ficticios para las pruebas funcionales.
- No incluir contraseñas, tokens, claves, cookies ni datos personales en las evidencias.
- Actualizar este documento en cada avance (hallazgo, dictamen, corrección o commit).
- Los commits los realiza el responsable del proyecto; este plan registra el resultado.

## 3. Estados utilizados

- `[ ] PENDIENTE`: actividad todavía no iniciada.
- `[~] EN PROCESO`: actividad iniciada, pero no terminada.
- `[X] COMPLETADO`: actividad ejecutada y respaldada por evidencia.
- `[B] BLOCKED`: no se pudo ejecutar por una dependencia o condición externa identificada.
- `[N/A] NO APLICA`: actividad descartada con justificación.

Los estados `PASS`, `FAIL`, `BLOCKED`, `NOT RUN` y `NOT APPLICABLE` se utilizarán para los resultados de las pruebas, de acuerdo con el plan del profesor.

## 4. Línea base inicial

- Proyecto: PMM Interactivo.
- Rama revisada inicialmente: `develop`.
- Rama activa al comenzar formalmente la Etapa 0: `implementacion26102026`.
- Commit inicial: `7ac322227c2de4a62a3a206dc0ed55a1b9610461`.
- Fecha inicial de esta revisión: 26 de octubre de 2026.
- Monografía de referencia: `TRABAJO-DE-GRADO - Duran, Rodriguez, Valencia. docx - Entrega 13-14 octubre.docx`.
- Plan rector del profesor: `PLAN_TRABAJO_AUDITORIA_TECNICA_PMM.md`.
- Frontend declarado: Vercel.
- Backend, MySQL y microservicio de IA declarados: Railway.
- Estado inicial de Railway: estuvo `BLOCKED` temporalmente por facturación excedida y fue restablecido el 26 de octubre de 2026.
- Restricción actual: no se realizarán modificaciones de código sin autorización previa.
- SHA-256 de la monografía final: `E74F94FBB2A3A7D8A74E22A77718C11BF8BE0D75F996346D814BC87DB812D927`.
- SHA-256 del plan del profesor: `40EC2C04324DC245BACB9C3DD320CB231AA4059F445B55AF1C78E3978FD0AA95`.

### Estado inicial del árbol de trabajo

En el momento de iniciar la revisión se encontraron cambios locales previos que deben preservarse:

- `REVISION_CUMPLIMIENTO_MONOGRAFIA_REPOSITORIO.txt`: eliminado localmente.
- `PLAN_TRABAJO_AUDITORIA_TECNICA_PMM.md`: archivo nuevo no versionado.
- Monografía final `.docx`: archivo nuevo no versionado.

La creación y las futuras actualizaciones de este archivo también aparecerán como un cambio local intencional.

Al comenzar formalmente la Etapa 0 se cambió a la rama local `implementacion26102026`. La rama conserva el mismo commit de `develop` y todavía no tiene una rama remota de seguimiento registrada. En esta rama el archivo `REVISION_CUMPLIMIENTO_MONOGRAFIA_REPOSITORIO.txt` no aparece como eliminación local.

## 5. Etapa 0 — Preservación de la línea base

### Objetivo

Dejar constancia exacta de la versión del proyecto, documentos y entorno utilizados durante la auditoría.

### Actividades

- [X] Registrar rama y commit iniciales.
- [X] Registrar el estado inicial del árbol de trabajo.
- [X] Identificar la monografía final utilizada.
- [X] Identificar el plan técnico entregado por el profesor.
- [X] Registrar versiones iniciales de Node, npm y Python.
- [X] Registrar el estado operativo de Railway y su restablecimiento después del bloqueo temporal por facturación.
- [X] Inventariar todas las variables de entorno necesarias, únicamente por nombre.
- [X] Definir y verificar las cuentas ficticias de estudiante y docente para las pruebas.
- [X] Definir la convención inicial para nombres y almacenamiento de evidencias.
- [X] Registrar las categorías iniciales del inventario maestro de pruebas.

### Resultado esperado

- Línea base reproducible.
- Bloqueos externos identificados por separado.
- Ninguna modificación correctiva antes de conservar los resultados iniciales.

### Estado de la etapa

`COMPLETADA` el 26 de octubre de 2026. La línea base, configuración, cuentas ficticias, convención de evidencias y categorías iniciales de pruebas quedaron identificadas. Las cuentas reservadas para Genin, Chunin y Jonin permanecen en rango `Recluta` hasta que sus diagnósticos se ejecuten como pruebas controladas.

### Inventario de componentes y variables

No se registran valores, credenciales ni secretos en este inventario.

| Componente | Variable | Condición | Uso observado |
|---|---|---|---|
| Backend | `MYSQL_URL` | Alternativa productiva | Cadena completa de conexión utilizada en Railway. |
| Backend | `DB_HOST` | Local, si no existe `MYSQL_URL` | Host de MySQL; usa `localhost` como fallback. |
| Backend | `DB_USER` | Local, si no existe `MYSQL_URL` | Usuario de MySQL. |
| Backend | `DB_PASSWORD` | Local, si no existe `MYSQL_URL` | Contraseña de MySQL. |
| Backend | `DB_NAME` | Local, si no existe `MYSQL_URL` | Base de datos MySQL. |
| Backend | `DB_DIALECT` | Opcional | Dialecto de Sequelize; usa `mysql` como fallback. |
| Backend | `JWT_SECRET` | Obligatoria | Firma y validación de tokens de sesión, activación y recuperación. |
| Backend | `FRONTEND_URL` | Obligatoria en despliegue | Origen CORS y construcción de enlaces enviados por correo. |
| Backend | `IA_SERVICE_URL` | Obligatoria para Flask | URL base del microservicio clasificador. El backend agrega `/api/ia/recomendar-ruta`. |
| Backend | `GEMINI_API_KEY` | Obligatoria para IA real | Acceso al tutor y a la retroalimentación con Gemini. |
| Backend | `RESEND_API_KEY` | Obligatoria para correo real | Verificación de cuenta y recuperación de contraseña. |
| Backend | `GOOGLE_CLIENT_ID` | Obligatoria para OAuth | Validación de tokens de Google en el servidor. |
| Backend | `DOMINIOS_DOCENTES` | Obligatoria para asignación docente | Lista de dominios que reciben el rol docente. |
| Backend | `UPLOADS_DIR` | Opcional/localización productiva | Carpeta de avatares e imágenes del foro. |
| Backend | `PORT` | Opcional | Puerto HTTP; usa `3001` como fallback. |
| Backend | `NODE_ENV` | Según entorno | Distingue pruebas, desarrollo y producción; controla servidor y logs de enlaces. |
| Frontend | `VITE_API_URL` | Obligatoria en despliegue | URL base del backend. |
| Microservicio Flask | `PORT` | Opcional | Puerto HTTP; usa `5000` como fallback. |

### Hallazgos del inventario de configuración

- No existen archivos `.env.example` versionados.
- El README enumera las variables principales sin revelar valores.
- El ejemplo de `IA_SERVICE_URL` del README fue corregido para usar únicamente la URL base `http://127.0.0.1:5000`; el backend continúa agregando `/api/ia/recomendar-ruta`.
- El fallback activo del frontend fue alineado con el README y el backend en `http://localhost:3001`.
- El frontend tiene el identificador público de Google OAuth escrito directamente en `pmm-frontend/src/main.jsx`; el backend utiliza `GOOGLE_CLIENT_ID` desde el entorno. Aunque un OAuth Client ID no es una clave secreta, conviene documentar y unificar su configuración.
- Existe `pmm-backend/src/api/api.js`, un cliente de frontend duplicado dentro del backend. No se encontraron referencias que lo utilicen.
- MySQL no estaba disponible al iniciar la auditoría; posteriormente fue instalado para la reproducción local. Docker continúa no disponible y no es necesario para la ruta de verificación elegida.

### Convención inicial de evidencias

```text
EV-F<fase>-<prueba>-<número>_<descripcion>.<ext>
```

Ejemplos:

```text
EV-F03-JEST-001_resultado_22_pruebas.txt
EV-F04-HU01-001_registro_correo_no_institucional.json
EV-F05-CU03-001_diagnostico_7_aciertos.png
```

Toda evidencia deberá indicar fecha, commit, rama, entorno, prueba relacionada y resultado. Antes de incorporarla al entregable se comprobará que no contenga contraseñas, tokens, cookies, claves ni información personal innecesaria.

### Categorías iniciales del inventario de pruebas

| Prefijo | Área |
|---|---|
| `T-LB` | Línea base e integridad del repositorio. |
| `T-REP` | Instalación, build y reproducibilidad. |
| `T-SEC` | Seguridad, permisos y validación. |
| `T-JEST` | Pruebas automatizadas existentes. |
| `T-HU01` a `T-HU15` | Historias y casos de uso. |
| `T-CLA` | Clasificador Flask. |
| `T-GEM` | Integración y comportamiento de Gemini. |
| `T-BD` | Estructura, contenido e integridad de MySQL. |
| `T-ACC` | Accesibilidad técnica. |
| `T-PERF` | Rendimiento básico. |
| `T-DEP` | Despliegue Vercel/Railway. |

### Cuentas ficticias de auditoría

No se registran contraseñas, enlaces de activación ni tokens. El 26 de octubre de 2026 el responsable del proyecto informó la creación de las cuentas y confirmó la activación de Genin, Chunin, Jonin y docente.

| Alias | Identificador de correo | Estado informado | Verificación pendiente |
|---|---|---|---|
| `AUD-EST-NUEVO` | `pmminteractivo+audnuevo@gmail.com` | Estudiante, verificada, activa y en rango `Recluta`. | 0 diagnósticos y 0 registros de progreso. |
| `AUD-EST-GENIN` | `pmminteractivo+audgenin@gmail.com` | Estudiante, verificada, activa y en rango `Recluta`. | Reservada para diagnóstico Genin; 0 diagnósticos y 0 registros de progreso. |
| `AUD-EST-CHUNIN` | `pmminteractivo+audchunin@gmail.com` | Estudiante, verificada, activa y en rango `Recluta`. | Reservada para diagnóstico Chunin; 0 diagnósticos y 0 registros de progreso. |
| `AUD-EST-JONIN` | `pmminteractivo+audjonin@gmail.com` | Estudiante, verificada, activa y en rango `Recluta`. | Reservada para diagnóstico Jonin; 0 diagnósticos y 0 registros de progreso. |
| `AUD-DOCENTE` | `pmminteractivo+auddocente@gmail.com` | Docente, verificada, activa y en rango `Recluta`; `id_usuario` observado: 62. | 0 diagnósticos y 0 registros de progreso. |
| `AUD-SIN-ACTIVAR` | `pmminteractivo+audinactivo@gmail.com` | Estudiante, no verificada, inactiva y en rango `Recluta`. | 0 diagnósticos y 0 registros de progreso. |

Las cuentas de estudiante no se utilizarán para ejecutar diagnósticos hasta definir los puntajes y preservar la evidencia anterior y posterior a cada prueba.

## 6. Etapa 1 — Reproducibilidad local

### Objetivo

Comprobar que una persona diferente al equipo puede instalar, compilar y ejecutar los componentes usando la documentación disponible.

### Actividades

- [X] Ejecutar las pruebas Jest del backend.
- [X] Compilar el frontend para producción.
- [X] Instalar el backend desde cero siguiendo el README en una copia temporal del commit.
- [X] Instalar el frontend desde cero siguiendo el README en una copia temporal del commit.
- [X] Instalar y ejecutar el microservicio Flask en un entorno virtual temporal fuera del repositorio.
- [X] Importar `schema.sql` en la base local desechable `pmm_interactivo_auditoria`.
- [X] Importar `seed_data.sql` en la base local desechable `pmm_interactivo_auditoria`.
- [X] Verificar el inicio del backend conectado a la base local.
- [X] Verificar el flujo backend a microservicio Flask.
- [X] Registrar comandos, versiones, tiempos, advertencias y pasos no documentados.
- [X] Contrastar los puertos y URLs locales documentados con el código.

### Resultados iniciales

- Jest: 5 suites aprobadas y 22 de 22 pruebas aprobadas.
- Frontend: build de Vite aprobado.
- Advertencia de build: datos de Browserslist desactualizados.
- Diferencia corregida: README y backend utilizan el puerto local `3001`, y el fallback del frontend fue alineado con `http://localhost:3001` sin alterar `VITE_API_URL` productiva.
- Reproducción limpia desde una copia temporal del commit: `npm ci` aprobado en backend y frontend; Jest aprobó nuevamente 22/22 y Vite compiló 2791 módulos en 4,12 segundos.
- Microservicio local: Flask 3.1.3, Flask-CORS 6.0.5 y scikit-learn 1.9.1 se instalaron correctamente en un entorno virtual temporal con Python 3.14.6.
- La API Flask inició en un puerto local controlado y respondió HTTP 200 para los puntajes 7 y 13; una cadena no numérica respondió HTTP 500.
- El script `test_clasificador.py` ejecutó 34 casos: 32 aprobados y 2 fallidos. Los 14 enteros válidos de 0 a 13 aprobaron; fallaron las expectativas declaradas para los decimales 6.9 y 10.5.
- Los fallos decimales no contradicen la tabla 0–13 de la monografía, cuyo dominio válido es entero, pero demuestran que el árbol no es idéntico a la regla fija para todos los números reales.
- El script del clasificador imprime un resultado fallido, pero termina con código de salida 0; por tanto, sirve como comprobación manual y no como prueba automatizada estricta para CI.
- MySQL 8 fue instalado y los scripts `schema.sql` y `seed_data.sql` se ejecutaron en la base local aislada `pmm_interactivo_auditoria`.
- La consulta posterior confirmó los valores esperados: 17 tablas, 21 módulos, 210 ejercicios, 13 preguntas diagnósticas, 24 insignias y 16 recursos.
- El backend inició en `0.0.0.0:3001` y Sequelize confirmó la conexión exitosa a `pmm_interactivo_auditoria` mediante el usuario local dedicado `pmm_auditor`. La ausencia de `RESEND_API_KEY` activó el modo simulacro de correo y no impidió el arranque.
- La primera ejecución integral del diagnóstico guardó 4 de 13 respuestas correctas y asignó `Genin (Iniciado)`, pero utilizó el algoritmo de respaldo porque Node no alcanzó Flask mediante `http://localhost:5000` en este entorno Windows.
- Al configurar localmente `IA_SERVICE_URL=http://127.0.0.1:5000` y repetir el flujo con una segunda cuenta desechable, Flask recibió `puntaje: 4.0`, asignó `nivel_id: 0` y respondió `POST /api/ia/recomendar-ruta` con HTTP 200. El backend persistió el diagnóstico y el inicio de sesión posterior indicó `requiereDiagnostico: false`.
- El mensaje de arranque de `app.py` afirma que el motor fue desplegado en Railway incluso durante la ejecución local; es texto fijo de consola y puede confundir la evidencia del entorno.

### Estado de la etapa

`COMPLETADA` el 26 de octubre de 2026. Se reprodujeron instalaciones limpias, pruebas, compilación, base de datos, backend y microservicio; también se verificó el recorrido autenticado desde el backend hacia Flask y la persistencia del diagnóstico en la base local aislada.

## 7. Etapa 2 — Seguridad y análisis estático

### Objetivo

Identificar secretos, datos personales, rutas inseguras, entradas sin validar, dependencias vulnerables, código muerto y referencias rotas.

### Actividades

- [X] Revisar archivos personales o cargas de usuarios versionadas.
- [X] Buscar secretos, tokens y credenciales versionados.
- [X] Revisar autenticación JWT y autorización por roles.
- [X] Revisar propiedad de publicaciones, comentarios y notificaciones.
- [X] Ejecutar una matriz completa de endpoints y permisos (matriz dinámica + `docsRevisionRepo/matrices/matriz_permisos.md`).
- [~] Revisar IDOR en recursos de estudiante y docente.
- [X] Revisar validación de archivos cargados.
- [X] Revisar validación de registro y recuperación de contraseña.
- [X] Revisar CORS, logs, errores y configuración productiva.
- [X] Ejecutar `npm audit` en backend y frontend.
- [X] Ejecutar ESLint en el frontend.
- [X] Localizar código muerto, endpoints de desarrollo y referencias inexistentes.
- [X] Clasificar formalmente cada hallazgo por severidad (`REVISION_TECNICA_PMM.md` §8; altos/críticos cerrados al cierre).

### Resultados iniciales

- Backend: 21 vulnerabilidades reportadas por npm, incluidas 1 crítica y 10 altas.
- Frontend: 21 vulnerabilidades reportadas por npm, incluidas 13 altas.
- ESLint: 28 errores y 2 advertencias.
- Git todavía rastrea cinco archivos dentro de `pmm-backend/public/uploads/`; uno contiene la fotografía de una persona.
- Cuatro de las cinco cargas rastreadas son imágenes de ejercicios matemáticos o contenido vacío; `ninja_media_1775159279383.jpg` es una fotografía tipo documento de una persona identificable.
- `pmm-backend/Reporte_Clase.xlsx` está versionado y contiene una fila con ID, nombre completo, correo, rango, nota diagnóstica y avance. Debe tratarse como un archivo con datos personales aunque se desconozca todavía si la fila corresponde a una persona real o ficticia.
- La fotografía y el reporte Excel fueron incorporados en el commit `de6fdb87212a62b48658bd7d89a56d160991aa49` del 2 de septiembre de 2026. Ignorar `public/uploads/` actualmente evita archivos nuevos, pero no retira los cinco objetos ya rastreados ni sus versiones históricas.
- Una consulta de solo lectura sobre `pmm_interactivo_auditoria` confirmó cero referencias a `ninja_media_1775159279383.jpg` tanto en `usuarios.foto_perfil` como en `foro_posts.imagen_url`. Este resultado solo acredita la base local; la base desplegada debe consultarse por separado antes de retirar el archivo del despliegue actual.
- No se encontraron `.env`, llaves privadas, tokens JWT ni firmas comunes de claves Gemini, Resend o URLs MySQL con contraseña en el árbol versionado actual. El historial contiene un antiguo `pmm-frontend/.env` con una única variable `VITE_API_URL`; su valor no constituye un secreto.
- El Google OAuth Client ID está escrito directamente en `pmm-frontend/src/main.jsx`. Es un identificador público, no una credencial secreta, pero conviene centralizarlo mediante configuración para evitar divergencias con `GOOGLE_CLIENT_ID` del backend.
- La ejecución de Flask generó `pmm-ia-service/__pycache__/` como artefacto local no versionado; no existe una regla específica para ignorar `__pycache__/` o archivos `.pyc`.
- La pantalla de error de verificación referencia `/incorrecto.png`, que no existe.
- El estado vacío de la biblioteca referencia `/estudiando.png`, que no existe.
- Las referencias rotas anteriores fueron corregidas usando recursos ya existentes: `/respuesta incorrecta robot.png` para el error de verificación y `/leyendo un libro robot.png` para los estados sin recursos de Biblioteca y VisualizadorModulo. No quedan referencias a los nombres inexistentes y el build de Vite aprobó con 2791 módulos.
- `VisualizadorModulo.jsx` no está conectado a `App.jsx` y conserva endpoints inexistentes.
- El endpoint de reinicio del diagnóstico fue retirado, pero su controlador permanece como código muerto.
- Las rutas de estudiante aplican globalmente JWT y rol `estudiante`; las rutas de diagnóstico, ejercicios, progreso y docente también declaran autenticación y rol. No se encontraron rutas funcionales privadas expuestas sin middleware.
- La matriz dinámica local inicial obtuvo los resultados esperados: dashboard sin token `401`, estudiante en dashboard `200`, docente en dashboard de estudiante `403`, estudiante en resumen docente `403` y docente en resumen docente `200`. La autenticación y la separación básica de roles quedaron confirmadas en esos cinco casos.
- Edición y eliminación de publicaciones/comentarios, lectura de notificaciones y actualización de avatar filtran por el `id_usuario` del JWT. La revisión estática no encontró un IDOR evidente en esas operaciones.
- La prueba dinámica de edición de publicaciones confirmó la propiedad: el estudiante B recibió `404` al intentar editar la publicación del estudiante A y el propietario A recibió `200` al editarla.
- La prueba dinámica de comentarios confirmó la propiedad: el estudiante A recibió `404` al intentar editar y eliminar el comentario del estudiante B; el propietario B pudo editarlo con `200`.
- La prueba dinámica de notificaciones confirmó la propiedad: el estudiante B recibió `404` al intentar marcar la notificación del estudiante A y el propietario A recibió `200`.
- La prueba dinámica de eliminación confirmó la propiedad y limpió los datos temporales: B no pudo eliminar el post de A (`404`), B eliminó su propio comentario (`200`) y A eliminó su publicación (`200`).
- Después de eliminar la publicación se confirmó `PostExiste: false` y cero comentarios, pero la notificación leída permaneció con la ruta `/estudiante/foro?open=1`. La monografía exige generar la notificación al recibir una respuesta, condición que sí se cumple, pero no define su eliminación posterior. El plan del profesor sí exige revisar la integridad entre publicaciones y notificaciones; por ello se clasifica como referencia huérfana de severidad baja.
- `GET /api/docente/reporte-individual/:id` exige rol docente, pero no valida que el ID objetivo pertenezca a un usuario con rol `estudiante`; además devuelve `error.message` en respuestas HTTP 500.
- La prueba dinámica confirmó el defecto de alcance: sin token devolvió `401`, un estudiante recibió `403`, el docente pudo consultar a un estudiante con `200`, un ID inexistente devolvió `404`, pero el docente también consultó su propio ID docente con `200`. No es una evasión del rol docente, pero sí una autorización incompleta sobre el tipo de objeto y expone nombre/correo de usuarios fuera del conjunto previsto.
- El login comprueba `verificado`, pero no comprueba explícitamente `estado = 'Activo'`. Una cuenta verificada marcada posteriormente como inactiva podría seguir autenticándose.
- `Login.jsx` y `Registro.jsx` conservan listas cerradas de dominios permitidos. Aunque incluyen dominios institucionales y proveedores comunes, bloquean otros correos con formato válido y contradicen la declaración final de la monografía de que la restricción por dominio fue retirada.
- Las páginas de registro, login, solicitud de recuperación y restablecimiento ya muestran `error.response.data.mensaje`, por lo que son compatibles con las respuestas controladas del backend. Sin embargo, el interceptor global de Axios interpreta cualquier `401/403` fuera de `/` como sesión vencida; esto también afecta rutas públicas como restablecimiento y verificación, pudiendo mostrar una alerta y redirigir antes de que la página gestione un token inválido.
- El login diferencia usuario inexistente (`404`) de contraseña incorrecta (`401`), facilitando enumeración de correos. No se encontró limitación de intentos para login, registro, activación o recuperación.
- `resetPassword` no valida presencia, tipo, longitud ni complejidad de `nuevaPassword`; los JWT de sesión ya emitidos tampoco se revocan al cambiar la contraseña.
- La matriz dinámica de registro confirmó `400` para nombre ausente, correo sin `@`, contraseña corta, consentimiento faltante y correo duplicado. En cambio, `correo` numérico y `password` numérico produjeron HTTP `500`, confirmando que el controlador usa operaciones de cadena sin validar previamente los tipos.
- La matriz dinámica de login confirmó HTTP `500` para correo ausente, contraseña ausente y contraseña numérica; el correo numérico y el correo inexistente devolvieron `404`, la contraseña incorrecta `401` y las credenciales correctas `200`. La diferencia `404/401` confirma enumeración de cuentas y la falta de validación de tipos.
- La matriz de `forgot-password` confirmó HTTP `500` para correo ausente y `200` para correo numérico o sin formato válido. Correo existente e inexistente devolvieron ambos `200`, por lo que la protección anti-enumeración de esta ruta sí funciona.
- Con un token de recuperación válido, `reset-password` devolvió `401` tanto para `nuevaPassword` ausente como numérica. El controlador captura errores de tipo como si el enlace fuera inválido, en vez de rechazar la entrada con HTTP 400.
- `reset-password` aceptó la contraseña corta `123` con HTTP 200; el login con la contraseña anterior pasó a `401` y con `123` respondió `200`. Inmediatamente se generó un nuevo token local, se restauró la contraseña original y el login final respondió `200`.
- La creación de publicaciones y comentarios no aplica las validaciones de longitud y formato que sí existen al editar; entradas vacías, excesivas o IDs inválidos pueden terminar en datos deficientes o errores de servidor.
- La prueba dinámica confirmó: publicación con título `abc` y contenido `x` respondió `200`; comentario vacío respondió `200` y quedó persistido; comentario sobre post inexistente respondió `500`; título de 151 caracteres respondió `500`. La publicación y el comentario temporales se eliminaron con HTTP 200.
- El esquema define `foro_posts.titulo` como `VARCHAR(150)` y contenido/comentarios como `TEXT`. El frontend impone mínimos de 5/10 al crear o editar posts y no permite comentario vacío, pero el backend no replica esas reglas. React muestra título, contenido y comentarios como texto y no se encontró `dangerouslySetInnerHTML`; además, las consultas usan reemplazos parametrizados, por lo que HTML/JavaScript y cadenas SQL-like no se ejecutan en este flujo actual.
- Multer limita cada imagen a 5 MB y valida MIME declarado más extensión, pero no comprueba la firma binaria del archivo. Los archivos se sirven públicamente desde `/uploads`.
- La matriz dinámica de cargas confirmó: texto disfrazado con extensión y MIME PNG fue aceptado (`200`) y persistido; extensión `.txt` con MIME PNG, extensión PNG con MIME `text/plain` y tamaño mayor a 5 MB fueron rechazados (`400`). Después de eliminar el post (`200`), el archivo falso siguió en disco, confirmando falta de limpieza de imágenes asociadas. El archivo exacto de auditoría fue retirado al finalizar.
- El JWT de sesión se almacena en `localStorage`. No se encontró `dangerouslySetInnerHTML`, pero un futuro XSS tendría acceso directo al token.
- Las pruebas automáticas locales confirmaron HTTP `401` para un JWT con firma/formato inválido y para un JWT correctamente firmado pero expirado. La reutilización del token de recuperación ya había devuelto `401`, cubriendo su invalidación de un solo uso.
- La prueba de manipulación de rol envió explícitamente `rol: docente` al registro con un correo ficticio no docente; la API ignoró el campo y respondió `rol: estudiante`, confirmando que la asignación se realiza en el servidor.
- El cambio de contraseña no revoca JWT de sesión emitidos previamente; conservan su vigencia máxima de ocho horas. La monografía no promete revocación inmediata, por lo que se mantiene como endurecimiento futuro separado y no se introduce un cambio de esquema durante esta corrección.
- CORS admite cualquier origen terminado en `.vercel.app`, además de la lista exacta. Es una política más amplia de lo necesario y debe contrastarse con los dominios reales de despliegue.
- No se encontraron `helmet` ni un limitador de solicitudes en la configuración del servidor.
- Las consultas SQL dinámicas activas del diagnóstico interpolan únicamente IDs numéricos derivados del JWT o listas internas. El controlador muerto de reinicio conserva SQL interpolado y no debe volver a exponerse sin parametrización.

### Clasificación preliminar de seguridad

| Severidad | Hallazgo | Estado |
|---|---|---|
| Alta | Fotografía identificable y reporte Excel con datos de estudiante versionados e incluidos en el historial Git. | Retirados del árbol actual mediante el commit `61e0331`; permanecen en el historial Git anterior. |
| Alta → cerrada como alta | Dependencias con vulnerabilidades reportadas por `npm audit`. | Mitigado: audit fix 2A/2B + retiro de `nodemailer`. BE **0 high/critical** (3 moderate uuid); FE **2 low** katex. |
| Alta → mitigado | Ausencia de limitación de solicitudes en autenticación y recuperación. | **Corregido en código:** `express-rate-limit` en login/Google/registro/forgot/reset; Jest confirma `429`. Pendiente deploy y smoke remoto. |
| Media | Login no verificaba `estado`, distinguía usuario inexistente y no invalida sesiones después de restablecer contraseña. | PARCIALMENTE CORREGIDO y verificado: cuenta activa `200`, cuenta verificada pero inactiva `403`, cuenta no verificada `403` y usuario inexistente/contraseña incorrecta `401`. La revocación inmediata de JWT previos al cambio de contraseña permanece como endurecimiento futuro no comprometido por la monografía. |
| Media | Frontend restringe registro/login a una lista cerrada de dominios pese a que la monografía declara aceptación de cualquier correo válido. | CORREGIDO y verificado: login con `@example.com` funciona; registro duplicado identifica rol estudiante y llega al backend sin bloqueo de dominio. |
| Media | Restablecimiento acepta una nueva contraseña sin validación explícita. | CORREGIDO y verificado: ausente, numérica y corta devuelven `400`; cambio válido `200`; reutilización y token inexistente `401`; login final `200`. |
| Media | Solicitud de recuperación no valida tipo/formato del correo y puede producir HTTP 500. | CORREGIDO y verificado: entradas inválidas `400`; cuenta inexistente y existente mantienen respuesta `200`. |
| Media | Registro con correo o contraseña de tipo no textual provoca HTTP 500. | CORREGIDO y verificado: los siete casos inválidos o duplicados devuelven HTTP 400. |
| Media | Login produce HTTP 500 ante campos ausentes/tipos inválidos y diferencia cuenta inexistente (`404`) de contraseña incorrecta (`401`). | CORREGIDO y verificado: entradas inválidas `400`, cuenta inexistente y contraseña incorrecta `401`, credenciales válidas `200`; correo con mayúsculas/espacios normalizado correctamente. |
| Media | Cargas verificadas solo por MIME declarado y extensión, sin firma binaria. | CORREGIDO y verificado: texto disfrazado de PNG, extensión/MIME incorrectos y archivo mayor de 5 MB devuelven `400`; una PNG real devuelve `200`. Firma PNG/JPEG/WebP contrastada con MIME y extensión en avatar/foro. |
| Media | Eliminar una publicación no elimina su imagen asociada del almacenamiento. | CORREGIDO y verificado: la imagen existía tras crear el post y dejó de existir físicamente después de eliminarlo (`200`). La limpieza queda confinada a `uploads` al reemplazar/eliminar post o avatar. |
| Media | Creación de foro/comentarios acepta campos demasiado cortos o vacíos y transforma referencias/límites inválidos en HTTP 500. | CORREGIDO y verificado: casos inválidos `400/404`, operaciones válidas `200`, limpieza `200` y cero archivos residuales tras multipart rechazado. |
| Media | Reporte individual docente no limita el objetivo al rol estudiante y filtra errores internos al cliente. | CORREGIDO y verificado: ID entero positivo, objetivo limitado a rol estudiante y error HTTP 500 genérico. Jest aprobó 22/22 y la matriz dinámica devolvió `401`, `403`, `200`, `404`, `404` y `400`. |
| Media | Token de sesión almacenado en `localStorage`. | Confirmado; riesgo condicionado a XSS. |
| Baja | CORS permite cualquier subdominio `*.vercel.app`. | Confirmado; el impacto actual se reduce porque la API usa Bearer token y no autenticación por cookie. |
| Baja | Interceptor Axios trata todo `401/403` como sesión expirada, incluso en rutas públicas de activación y recuperación. | CORREGIDO y verificado: recuperación y token inválidos muestran el mensaje específico, permanecen en la página y no generan alerta/redirección global. |
| Baja | Google OAuth Client ID público está codificado directamente en el frontend. | Confirmado; problema de configuración, no exposición de secreto. |
| Baja | `__pycache__/` no está ignorado y el mensaje de Flask afirma Railway durante ejecución local. | Confirmado; higiene y trazabilidad del entorno. |
| Baja | Al eliminar una publicación permanecen notificaciones cuya ruta apunta al ID eliminado. | CORREGIDO y verificado: la limpieza ocurre en la misma transacción; Jest aprobó 22/22 y la repetición dinámica confirmó post inexistente, cero comentarios y notificación asociada inexistente después de eliminar. |

## 8. Etapa 3 — Verificación de las pruebas existentes

### Objetivo

Confirmar la afirmación académica de 5 suites y 22 pruebas e identificar qué código productivo cubren realmente.

### Actividades

- [X] Contar suites Jest reales.
- [X] Contar casos Jest reales.
- [X] Buscar pruebas `.skip`, `.only`, vacías o pendientes.
- [X] Ejecutar las pruebas sin modificarlas.
- [X] Clasificar pruebas unitarias, integración parcial e integración real.
- [X] Identificar mocks y componentes reemplazados.
- [X] Elaborar la matriz prueba a controlador, ruta e historia de usuario.
- [X] Identificar funciones esenciales sin cobertura.
- [X] Determinar si se requiere sustituir pruebas existentes sin aumentar su cantidad.

### Resultados iniciales

- 5 suites aprobadas.
- 22 de 22 pruebas aprobadas.
- No se encontraron `.skip`, `.only` ni pruebas pendientes.
- Las pruebas utilizan principalmente mocks y no integran MySQL ni servicios de IA reales.
- Las pruebas de `moduloController` cubren un controlador que no está conectado a las rutas actuales.
- Parte de las pruebas de `progresoController` cubre una función de escritura que ya no está expuesta.
- La evaluación productiva vigente de `ejercicioController` no tiene pruebas dedicadas.

### Matriz de las pruebas automatizadas existentes

| Suite | Casos | Tipo | Código cubierto | Relación productiva |
|---|---:|---|---|---|
| `api.test.js` | 1 | Integración HTTP parcial con Supertest | Ruta pública `GET /` | Ruta activa; no involucra base de datos ni servicios externos. |
| `authController.test.js` | 4 | Unitaria con mocks | Validaciones iniciales de `register` | Controlador activo de CU-01; no cubre persistencia, activación, login, recuperación ni correo. |
| `diagnosticoController.test.js` | 4 | Unitaria con modelos, transacción y Flask simulados | `evaluarDiagnostico` y asignación Genin/Chunin/Jonin | Controlador activo de CU-03; no es integración real con MySQL ni Flask. |
| `moduloController.test.js` | 6 | Unitaria con mocks | `obtenerEjerciciosModulo` y `actualizarProgreso` | Controlador no conectado a las rutas productivas actuales. |
| `progresoController.test.js` | 7 | Unitaria con mocks | Cuatro casos de `actualizarProgreso` y tres de `obtenerEstadoModulo` | Solo `obtenerEstadoModulo` continúa expuesto; la escritura se realiza actualmente al evaluar ejercicios. |
| **Total** | **22** | **5 suites** |  |  |

### Funciones esenciales sin cobertura automatizada directa

- Login, activación, Google OAuth y recuperación/restablecimiento de contraseña.
- Rutas, middleware JWT, separación de roles, propiedad de recursos e IDOR.
- `ejercicioController.evaluarEjercicio`, que contiene la evaluación productiva y actualización del progreso.
- Foro, comentarios, notificaciones, avatar, biblioteca, ranking y dashboard.
- Reportes docentes, generación de Excel y reporte individual.
- Tutor Gemini, carga y validación binaria de imágenes, MySQL real y Flask real.

Se conservarán intactas las 5 suites y 22 pruebas declaradas en la monografía. No se sustituirán casos porque hacerlo podría cambiar el alcance académico documentado; las brechas se cubrirán mediante la matriz dinámica reproducible de la auditoría y se informarán como limitación de cobertura.

## 9. Etapa 4 — Regresión prioritaria HU-01, HU-05 y HU-06

### HU-01 — Registro e inicio de sesión

- [N/A] Probar correo institucional (fuera del alcance CA-01.1 documentado; monografía retiró filtro de dominio).
- [X] Probar correo no institucional.
- [X] Probar correo duplicado.
- [X] Probar activación y cuenta no verificada.
- [X] Probar login y expiración del token.
- [X] Confirmar asignación de rol en el servidor.
- [X] Intentar manipular el rol desde el cliente.
- [X] Emitir dictamen: CA-01.1 permanece como limitación documentada en la monografía; el resto de criterios cumple y el frontend fue alineado (listas de dominio retiradas).

Resultado estático inicial: permanece parcial. El backend valida un formato básico, pero no limita el registro al dominio institucional. Esta limitación está reconocida en la monografía final.

Dictamen Etapa 5 (2026-10-27): cumple según la monografía. Formato de correo, duplicado, activación, login, rol asignado en servidor y acceso a rutas protegidas verificados. CA-01.1 sigue siendo el único criterio parcial declarado (sin filtro de dominio institucional). Hallazgo de seguridad pendiente y ajeno a los CA: ausencia de límite de intentos en autenticación.

### HU-05 — Ejercicios interactivos

- [X] Probar respuesta correcta.
- [X] Probar respuesta incorrecta.
- [X] Probar respuesta vacía o manipulada.
- [X] Probar orden de ejercicios.
- [X] Probar acceso a ejercicios de un módulo bloqueado.
- [X] Verificar progreso, intentos e historial de errores. Persistencia observada y datos temporales limpiados.
- [X] Verificar indicación textual y accesible de correcto o incorrecto. Mensajes verde/rojo comprobados visualmente, con `role="status"`, `aria-live="polite"` y `aria-atomic="true"`.
- [X] Emitir dictamen: el flujo permanece y el defecto de retroalimentación textual fue corregido.

Resultado estático inicial: permanece parcial. El backend retorna el estado y un mensaje explícito, pero el frontend no muestra una etiqueta textual de respuesta correcta o incorrecta.

Resultado dinámico local: carga del primer módulo `200`; respuesta correcta no expuesta al cliente; módulo siguiente y módulo Chunin bloqueados con `403`; respuesta vacía e ID manipulado `400`; ejercicio fuera de orden `409`; respuesta incorrecta y correcta `200` con `es_correcta` y mensajes explícitos. La persistencia temporal registró 10% y 2 intentos, y luego fue restaurada a cero registros. El frontend continúa sin anunciar textualmente una respuesta correcta ordinaria y reemplaza el mensaje explícito de respuesta incorrecta por el flujo del tutor.

Corrección aplicada: `ModuloEstudio.jsx` conserva y muestra el mensaje de evaluación devuelto por el backend en un estado visible verde/rojo y una región viva accesible. El build de Vite aprobó 2791 módulos. El lint aislado mantiene un único reporte preexistente sobre la importación de `motion`, utilizada en múltiples elementos JSX del mismo archivo; no se modificó dentro de este ajuste.

Verificación visual final: se observaron ambos mensajes, correcto e incorrecto. Ante la indisponibilidad local de Gemini se mostró el fallback "El Tutor está meditando en las montañas" y el historial se persistió correctamente. No se configuró ni expuso una clave remota para esta prueba. Al finalizar se retiraron exactamente 1 registro de progreso, 8 errores y la notificación `id_notificacion = 4` generados por la sesión; la cuenta ficticia volvió a cero progreso y cero errores.

### HU-06 — Tutor virtual

- [X] Confirmar estáticamente que el prompt incluye el nivel.
- [X] Confirmar estáticamente que el prompt incluye el ejercicio.
- [X] Confirmar que no adjunta intencionalmente nombre, correo o identificador.
- [X] Probar respuesta normal mediante mock, sin llamada externa.
- [B] Probar solicitud de solución directa contra el proveedor. Regla reforzada estáticamente; ejecución real omitida sin credencial autorizada.
- [B] Probar prompt injection contra el proveedor. Entrada delimitada como no confiable y regla reforzada; ejecución real omitida sin credencial autorizada.
- [X] Probar mensaje vacío y excesivamente largo. Vacío, tipo numérico, 1001 caracteres e ID inválido devolvieron `400` antes del proveedor.
- [X] Mockear éxito, timeout, error, respuesta vacía y salida inesperada. Seis casos temporales aprobaron y el archivo fue retirado.
- [B] Probar el servicio remoto. Ejecución omitida sin credencial autorizada y para evitar consumo; la prueba real es opcional en el plan rector.
- [X] Emitir dictamen: integración endurecida y verificada mediante mocks; comportamiento semántico del proveedor queda limitado explícitamente.

Resultado estático inicial: la construcción del prompt incluye nivel y contexto, pero falta evidencia funcional de ejecución sobre la versión actual.

Revisión estática ampliada: el payload enviado a Gemini contiene rango, texto del ejercicio y mensaje del estudiante, pero no nombre, correo ni identificador del usuario. El mensaje se interpola directamente como contenido no confiable dentro del prompt; no existen validaciones de tipo, vacío o longitud en el backend. Tampoco se configura timeout, no se rechaza una respuesta vacía del proveedor y el frontend muestra el estado fijo "En línea" aun cuando Gemini no está disponible. La versión instalada de `@google/generative-ai` admite `timeout` mediante `RequestOptions`, por lo que el endurecimiento no requiere paquetes nuevos. La prueba real continuará omitida sin credencial autorizada; el plan del profesor exige mocks en este escenario.

Corrección aplicada: el backend exige un identificador válido y un mensaje textual de 1 a 1000 caracteres, trata el mensaje como contenido no confiable, refuerza el prompt contra instrucciones incrustadas, configura timeout de 10 segundos y controla ausencia de clave, cuota, timeout, respuesta vacía, salida inesperada y error general. El frontend limita la entrada a 1000 caracteres y sustituyó el estado fijo "En línea" por "Asistencia mediante IA". Seis mocks temporales aprobaron sin red; después de retirarlos, las 5 suites y 22 pruebas permanentes aprobaron. El build de Vite aprobó 2791 módulos.

Repetición dinámica posterior al reinicio: mensaje vacío, mensaje numérico, texto de 1001 caracteres e identificador inválido devolvieron `400` y fueron rechazados antes de invocar al proveedor. No se enviaron prompts válidos a Gemini ni se utilizaron claves reales.

## 10. Etapa 5 — Auditoría funcional de HU/CU-01 a HU/CU-15

### Objetivo

Evaluar cada caso en las dimensiones funcional, negativa, autorización, persistencia e integración.

### Orden de ejecución

1. [X] HU-01, HU-03, HU-04, HU-05 y HU-07 (lote A).
2. [X] HU-09, HU-10, HU-11, HU-12 y HU-13 (lote B).
3. [X] HU-02, HU-06 y HU-14 (lote C).
4. [X] HU-08 y HU-15 (lote D).

### Estado de la etapa

`COMPLETADA` el 27 de octubre de 2026 en modo de contraste monografía ↔ código ↔ evidencia previa (Etapas 1–4) y revisión estática/dinámica parcial. No se modificó código productivo durante la Etapa 5. Quedan pendientes evidencias saneadas formales y algunas reejecuciones autenticadas puntuales si el profesor las exige en vivo.

### Procedimiento por cada caso

- [X] Identificar criterios exactos en la monografía (lotes A–D).
- [X] Trazar interfaz, endpoint, middleware, controlador y tabla (lotes A–D).
- [X] Preparar datos ficticios controlados (cuentas de auditoría definidas; reuso de matrices previas).
- [X] Ejecutar prueba positiva (combinación de evidencia previa verificada y revisión estática del 2026-10-27).
- [X] Ejecutar pruebas negativas y límites (cubiertas en Etapa 2/4 para auth, foro, ejercicios, tutor, permisos docente; resto por inspección de guards).
- [X] Probar directamente el endpoint con los roles aplicables (matrices previas + `401` sin token el 2026-10-27).
- [~] Comprobar el estado de la base antes y después (sí en matrices previas; no repetido para todos los 15 casos en esta pasada).
- [~] Recargar o iniciar una sesión nueva para confirmar persistencia (cubierto en HU-03/05/07/15 previas; no reejecutado hoy para todo el lote).
- [X] Registrar evidencia saneada en carpetas formales del entregable (`docsRevisionRepo/evidencias_revision/`).
- [X] Crear un hallazgo cuando el resultado no coincida (ver consolidado al final de esta etapa).

### Dictámenes del lote A (2026-10-27)

| HU/CU | Criterios monografía | Trazado principal | Dictamen | Notas |
|---|---|---|---|---|
| HU-01 / CU-01 | CA-01.1 a CA-01.3 | `Registro.jsx`, `Login.jsx` → `/api/auth/*` → `authController` → `usuarios` | Cumple según monografía; CA-01.1 permanece parcial documentado | Frontend sin lista cerrada de dominios. Rate limit pendiente (seguridad, no CA). |
| HU-03 / CU-03 | 13 preguntas; puntaje/nivel; sin repetición inmediata | `Diagnostico.jsx` → `/api/diagnostico/*` → `diagnosticoController` + Flask/fallback → `diagnostico`, `usuarios` | Cumple | Seed con 13 preguntas; `409` si ya existe; rangos 0–6 / 7–10 / 11–13. |
| HU-04 / CU-04 | Módulos del nivel; bloqueo secuencial | `DashboardEstudiante.jsx` → dashboard + `accesoModuloMiddleware` | Cumple | UI y API bloquean módulos fuera de secuencia/rango. |
| HU-05 / CU-05 | Correcto/incorrecto + orientación | `ModuloEstudio.jsx` → `/api/ejercicios/*` | Fue corregido | Mensaje textual accesible verificado. |
| HU-07 / CU-07 | Progreso global y por módulo | Dashboard + evaluación | Cumple | Evidencia previa de persistencia de porcentaje. |

### Dictámenes del lote B — Panel docente (2026-10-27)

| HU/CU | Criterios monografía | Trazado principal | Dictamen | Notas |
|---|---|---|---|---|
| HU-09 / CU-09 | Listado con progreso; organización/filtro | `DashboardDocente.jsx` → `GET /api/docente/resumen-estudiantes` → `docenteController.obtenerResumenEstudiantes` | Cumple | Solo rol `docente`. Filtro por rango en cliente. Al ascender, `finalizacionModuloService` también actualiza `diagnostico.nivel_asignado`, alineando el filtro. |
| HU-10 / CU-10 | Historial individual; desempeño por módulo | `ReporteDetalladoEstudiante.jsx` → `GET /api/docente/reporte-individual/:id` | Cumple | Objetivo limitado a rol estudiante (corrección previa verificada). Incluye progresos por módulo. |
| HU-11 / CU-11 | Temas con más errores; conteo de fallos | Mismo reporte → consulta a `historial_errores` agrupada por módulo | Cumple | `fallos_comunes` con `cantidad_fallos`, top 5. |
| HU-12 / CU-12 | Campo de búsqueda; filtrado | Búsqueda en `DashboardDocente.jsx` sobre nombre/correo | Cumple | Filtrado en cliente (sin SQL dinámico de búsqueda; reduce riesgo de inyección). |
| HU-13 / CU-13 | Excel general; consulta individual | `GET /api/docente/descargar-excel` + reporte individual | Cumple | ExcelJS genera `Reporte_Clase_PMM.xlsx` con ID, nombre, correo, rango, puntaje y avance. |

Observaciones lote B (no impiden el CA): el resumen docente no expone `estado` de `usuarios` aunque el frontend consulta `est.estado`; estudiantes sin diagnóstico aparecen como Genin con puntaje 0; el avance promedio se calcula solo sobre módulos con registro de progreso.

### Dictámenes del lote C (2026-10-27)

| HU/CU | Criterios monografía | Trazado principal | Dictamen | Notas |
|---|---|---|---|---|
| HU-02 / CU-02 | Enlace de recuperación; nueva contraseña | `forgot-password` / `reset-password` → `authController` | Cumple | Validaciones y anti-enumeración verificadas en Etapa 2. |
| HU-06 / CU-06 | Tutor orienta; considera nivel y contexto | `consultarOraculo` + `ModuloEstudio` | Cumple con limitación explícita | Prompt incluye rango y ejercicio; mocks y validaciones Etapa 4/6. CA-06.2 de la monografía (referencia explícita al nivel en la respuesta del modelo) no se revalidó semánticamente sin clave Gemini. |
| HU-14 / CU-14 | Insignias en perfil; progresión de rango | `PerfilEstudiante.jsx`, dashboard, `finalizacionModuloService` | Cumple | Ascenso Genin→Chunin→Jonin→Kage al completar módulos del nivel; insignia por módulo; ranking usa `rango_actual`. |

### Dictámenes del lote D (2026-10-27)

| HU/CU | Criterios monografía | Trazado principal | Dictamen | Notas |
|---|---|---|---|---|
| HU-08 / CU-08 | Acceso a materiales; recurso acorde | `Biblioteca.jsx` → `GET /api/estudiante/biblioteca` → `biblioteca_pergaminos` | Cumple | Acceso visible desde el dashboard. Filtrado por dificultad Bajo/Intermedio/Alto según rango. No hay enlace directo desde `ModuloEstudio.jsx` (observación menor). |
| HU-15 / CU-15 | Imágenes en foro; notificación al autor | `ForoComunidad.jsx` → crear/comentar + Multer/firma + `crearNotificacion` | Cumple / fue endurecido | PNG/JPEG/WebP con firma; notificación al autor distinto; limpieza de notificaciones al borrar post (Etapa 2). |

### Consolidado Etapa 5

| Resultado | Casos |
|---|---|
| Cumple | HU-02, HU-03, HU-04, HU-07, HU-08, HU-09, HU-10, HU-11, HU-12, HU-13, HU-14, HU-15 |
| Cumple según monografía (CA parcial documentado) | HU-01 (CA-01.1) |
| Fue corregido respecto del defecto declarado en la monografía | HU-05 (CA-05.1) |
| Cumple con limitación de prueba (sin Gemini real) | HU-06 (CA-06.2 semántico del proveedor) |

Hallazgos abiertos relevantes tras Etapa 5 (ninguno es FAIL de CA esencial de los 15, salvo seguridad transversal):

1. **Alta — seguridad:** ausencia de límite de intentos en login/registro/recuperación.
2. **Dependencias:** residual solo moderate/low tras 2A/2B/2C (ya no alta pendiente).
3. **Media/observación:** IDs de módulos hardcodeados en herencia del diagnóstico.
4. **Baja/observación:** resumen docente sin campo `estado`; biblioteca no enlazada desde el módulo; avance docente promedio solo sobre módulos iniciados.

## 11. Etapa 6 — Clasificador y Gemini

### Estado de la etapa

`COMPLETADA` el 27 de octubre de 2026 para el clasificador Flask (matriz dinámica local) y consolidada para Gemini (mocks y revisión estática/dinámica de Etapa 4). No se modificó código. El script `test_clasificador.py` no se reejecutó en este entorno porque el intérprete global no tenía Flask instalado; la matriz se ejecutó contra el servicio ya levantado en `http://127.0.0.1:5000`.

### Clasificador Flask

- [X] Ejecutar todos los puntajes enteros de 0 a 13.
- [X] Probar `-1`, `14` y `999`.
- [X] Probar `null`, cadena, decimal y objeto.
- [X] Registrar estado HTTP y respuesta JSON.
- [X] Comparar el árbol con la regla fija.
- [X] Confirmar el comportamiento documentado para valores fuera de rango.

Regla fija de la monografía / comentario de `app.py`: **0–6 Genin (`nivel_id` 0) | 7–10 Chunin (1) | 11–13 Jonin (2)**. Para `puntaje > 13` el código fuerza Genin.

#### Matriz dinámica (2026-10-27, servicio local)

| Caso | HTTP | `nivel_id` | ¿Coincide regla fija? | Notas |
|---|---:|---:|---|---|
| 0–6 | 200 | 0 | Sí | Genin. |
| 7–10 | 200 | 1 | Sí | Chunin. |
| 11–13 | 200 | 2 | Sí | Jonin. |
| 14 | 200 | 0 | Sí (regla >13 → Genin) | Documentado en código. |
| 999 | 200 | 0 | Sí (regla >13 → Genin) | Documentado en código. |
| -1 | 200 | 0 | No hay regla académica para negativos | Acepta y clasifica como Genin; no valida dominio ≥ 0. |
| 6.9 | 200 | 1 | No (entero ≤6 sería Genin) | Árbol diverge en decimales; dominio válido de la monografía es entero 0–13. |
| 10.5 | 200 | 1 | No (entero ≥11 sería Jonin) | Mismo comentario: fuera del dominio entero documentado. |
| `null` | 500 | — | — | Error interno en vez de 400. |
| cadena `"abc"` | 500 | — | — | Error interno en vez de 400. |
| objeto | 500 | — | — | Error interno en vez de 400. |
| body vacío | 500 | — | — | Error interno. |
| sin campo `puntaje` | 200 | 0 | Ambiguo | Usa default `0` y responde éxito. |

Dictamen clasificador: **PASS** para el dominio académico entero 0–13 y para `>13` → Genin. **Observación / mejora:** entradas inválidas (`null`, cadena, objeto) responden **500** en lugar de **400**; `-1` no se rechaza; decimales no siguen la regla de enteros (esperado si el dominio es solo entero, pero el profesor puede marcarlo).

### Gemini

- [X] Mockear respuesta exitosa.
- [X] Mockear timeout.
- [X] Mockear error del proveedor.
- [X] Mockear respuesta vacía.
- [X] Mockear salida inesperada.
- [X] Revisar renderizado y sanitización (texto plano; sin `dangerouslySetInnerHTML` en el flujo del tutor).
- [X] Confirmar ausencia de PII en el payload (rango, texto del ejercicio y mensaje; sin nombre, correo ni ID).
- [B] Ejecutar prueba real únicamente cuando exista servicio y credencial autorizada.

Dictamen Gemini: integración endurecida y verificada con mocks (Etapa 4). Validación 1–1000 caracteres, timeout 10 s, entrada no confiable delimitada, fallbacks controlados. Prueba semántica real (solución directa / prompt injection contra el proveedor) permanece `BLOCKED` sin credencial autorizada.

## 12. Etapa 7 — Base de datos, calidad y accesibilidad

### Estado de la etapa

`COMPLETADA` el 27 de octubre de 2026. Incluye contraste BD, build/audit/lint, teclado/foco por inspección de código, viewports por breakpoints Tailwind (sin frontend local levantado para capturas) y mediciones de latencia locales. No se modificó código.

### Base de datos

- [X] Confirmar estáticamente 17 tablas en `schema.sql`.
- [X] Confirmar estáticamente 21 módulos.
- [X] Confirmar estáticamente 210 ejercicios.
- [X] Confirmar distribución de ejercicios 40/90/80.
- [X] Confirmar 13 preguntas diagnósticas.
- [X] Confirmar 24 insignias y 16 recursos.
- [X] Identificar las cuatro tablas previstas para ampliaciones futuras.
- [X] Importar y consultar los datos en MySQL.
- [X] Comparar completamente modelos Sequelize y `schema.sql`.
- [X] Revisar llaves, índices, nulos, valores únicos, cascadas y transacciones.

#### Modelos Sequelize vs `schema.sql`

| Tabla en schema | Modelo Sequelize | Observación |
|---|---|---|
| `usuarios` | `Usuario.js` | Schema tiene columna `rango` además de `rango_actual`; el modelo **no declara `rango`**. El código productivo actualiza ambos vía SQL crudo. |
| `diagnostico` | `Diagnostico.js` | Alineado; FK cascade a usuarios. |
| `modulos` | `Modulo.js` | Alineado. |
| `ejercicios` | `Ejercicio.js` | Alineado; FK cascade a módulos. |
| `preguntas_diagnostico` | `PreguntaDiagnostico.js` | Alineado. |
| `progreso_estudiante` | `ProgresoEstudiante.js` | Alineado. |
| `historial_errores` | `HistorialError.js` | Alineado; FK a ejercicios/usuarios. |
| `insignias` / `usuarios_insignias` | `Insignia.js` / `UsuarioInsignia.js` | Alineado; PK compuesta y cascade. |
| `resultados_modulos` | `ResultadoModulo.js` | Modelo mínimo; tabla prevista/ampliación. |
| `foro_posts`, `foro_comentarios`, `notificaciones`, `biblioteca_pergaminos` | Sin modelo | Acceso por SQL parametrizado en controladores (válido; menor tipado). |
| `lecciones`, `logros_usuario`, `reportes_docente` | Sin modelo | Tablas de ampliación futura / poco o nada usadas en rutas activas. |

Integridad: FKs con `ON DELETE CASCADE` en diagnóstico, ejercicios, foro, errores e insignias. Transacciones activas en evaluación de diagnóstico, ejercicios/`finalizarModulo` y eliminación de posts con notificaciones. Correo único en `usuarios`.

### Calidad y accesibilidad

- [X] Ejecutar build de producción. Vite aprobó (~5,9 s); bundle JS principal ≈ **4,69 MB** (gzip ≈ **969 KB**) — peso alto, principalmente KaTeX/vendor.
- [X] Ejecutar ESLint. **27 errores**, 0 warnings (antes 28+2); predominan `motion` no usado según regla y escapes innecesarios / react-refresh.
- [X] Revisar navegación por teclado y foco (inspección de código; Vite/preview no estaban levantados).
- [X] Revisar labels, textos alternativos y mensajes.
- [X] Revisar escritorio y móvil con viewports registrados (por breakpoints; sin capturas visuales en vivo).
- [X] Revisar tamaño del bundle e imágenes. Bundle grande (arriba); imágenes en `/public` referenciadas por nombre.
- [X] Ejecutar mediciones básicas de endpoints en un entorno controlado (local).

#### Teclado, foco y etiquetas (2026-10-27)

| Hallazgo | Severidad | Detalle |
|---|---|---|
| Labels de Login/Registro sin `htmlFor`/`id` | Baja | Hay texto `<label>` visual, pero no asociatividad programática con el input. |
| Tarjetas de módulo del dashboard con `div` + `onClick` | Media/accesibilidad | Sin `role="button"`, `tabIndex` ni `onKeyDown`; no activables con teclado. |
| `AscensoModal` | Observación positiva / parcial | `role="dialog"`, `aria-modal`, cierre con Escape; **no** hay trampa de foco ni foco inicial forzado al abrir. |
| Campana / inputs con `focus:ring` | Observación positiva | Anillo de foco visible en varios controles. |
| Foro file upload | Observación positiva | `label htmlFor="file-upload"` correctamente ligado. |
| HU-05 `aria-live` | Observación positiva | Retroalimentación de ejercicio anunciable. |

#### Viewports registrados (breakpoints Tailwind usados)

| Viewport de referencia | Ancho | Evidencia en código |
|---|---:|---|
| Móvil | 375 px | Base sin prefijo; grids `grid-cols-1`; tipografías `text-sm` / `md:text-*`. |
| Tablet | 768 px (`md`) | Login padding `md:p-3.5`; dashboards y foro con columnas/`md:` intensivo (p. ej. DashboardEstudiante >150 usos de `sm:`/`md:`/`xl:`). |
| Escritorio | 1280 px (`xl`) | `xl:grid-cols-2` en ruta de módulos; paneles ampliados. |

Limitación: `http://127.0.0.1:5173` y `:4173` no respondían; no se generaron capturas visuales. La conclusión responsive se basa en clases presentes, no en render real.

#### Mediciones básicas de latencia (local, 5 muestras, 2026-10-27)

| Endpoint | HTTP | avg ms | min | max |
|---|---:|---:|---:|---:|
| `GET /` | 200 | 41 | 27 | 90 |
| `GET /api/diagnostico/preguntas` (sin token) | 401 | 8.8 | 3 | 25 |
| `GET /api/estudiante/dashboard` (sin token) | 401 | 3.8 | 3 | 4 |
| `GET /api/docente/resumen-estudiantes` (sin token) | 401 | 7.4 | 3 | 19 |
| `POST /api/auth/login` (credenciales inválidas tipadas) | 400 | 8.8 | 5 | 15 |
| `POST Flask /api/ia/recomendar-ruta` puntaje 7 | 200 | 52.8 | 36 | 71 |

Dictamen rendimiento básico: latencias locales bajas (<100 ms en estos casos). No sustituye prueba de carga ni medición autenticada/producción.

#### Desglose actualizado de `npm audit` (2026-10-27)

Backend (21): **1 critical** (`proxy-addr`), **10 high** (entre ellas `axios`, `multer`, `mysql2`, `nodemailer`, `body-parser`, `form-data`), **9 moderate**, **1 low**.

Frontend (21): **0 critical**, **13 high** (destacan `react-router` / `react-router-dom`, `vite`, `axios`, `dompurify`), **5 moderate**, **3 low**.

`npm audit --omit=dev`: backend **17** (8 moderate, 8 high, 1 critical); frontend **9** (2 low, 2 moderate, 5 high). **No aplicar `npm audit fix --force`** sin ficha: Sequelize forzaría downgrade breaking.

### Cambio autorizado F-CLA-400 — Clasificador Flask (opción A, aplicada 2026-10-27)

- **ID:** F-CLA-400
- **Archivo:** `pmm-ia-service/app.py`
- **Cambio:** puntaje obligatorio; solo entero **0–13**; entradas inválidas o fuera de rango → HTTP **400** con `mensaje`; eliminado default `0` y la regla `>13` → Genin.
- **Verificación local:** `test_client` — 7→200; -1/14/`abc`/`null`/body vacío→400.
- **Pendiente (histórico):** commit/`app.py` ya aplicados en cadena de deploy. `test_clasificador.py` realineado a F-CLA-400 (fuera de rango e inválidos → 400; sin >13→Genin).

## 13. Etapa 8 — Verificación del despliegue

### Estado de la etapa

`COMPLETADA` el 27 de octubre de 2026 para el alcance de despliegue oficial verificable. Smoke, CORS, auth, flujo estudiante Genin y panel docente (resumen, reporte individual, Excel, aislamiento de roles) verificados en producción. Limpieza opcional del 10% residual en la cuenta Genin queda a decisión del responsable. Contraseñas no registradas en este documento.

### Estado actual

- [X] Confirmar que los frontends de Vercel responden HTTP 200.
- [X] Backend oficial asociado a `academia-pmm-2.vercel.app`: `https://academiapmm2-production.up.railway.app/` responde HTTP 200 y entrega el mensaje de bienvenida de la API.
- [X] Confirmar CORS desde `https://academia-pmm-2.vercel.app`: origen autorizado y preflight HTTP 204.
- [X] Confirmar protección básica sin credenciales: diagnóstico, panel de estudiante, panel docente y ejercicios responden HTTP 401 sin token.
- [B] Despliegue alterno anterior `academia-pmm.vercel.app`: responde HTTP 200, pero su bundle apunta a `https://academiapmm-production.up.railway.app`, que responde `404`. No es el despliegue oficial.

### Actividades cuando Railway sea restablecido

- [X] Confirmar la URL pública vigente del backend.
- [X] Confirmar que el frontend oficial publicado utiliza esa URL. Bundle `index-CnUKlY2p.js` embebe `https://academiapmm2-production.up.railway.app`.
- [X] Confirmar CORS desde el dominio oficial. Preflight `OPTIONS` → 204; `Access-Control-Allow-Origin: https://academia-pmm-2.vercel.app`.
- [X] Probar registro, verificación y login. Negativo: duplicado/ inválido `400`; post-deploy login inexistente y clave errónea ambos `401`. Login OK con cuenta ficticia Genin → `200`, rol `estudiante`, `requiereDiagnostico: true` (antes del diagnóstico).
- [X] Ejecutar un diagnóstico completo. 13 preguntas; 4 aciertos → `Genin (Iniciado)`; repetición de preguntas → `409`.
- [X] Ejecutar un ejercicio correcto y uno incorrecto. Incorrecta e correcta en módulo 1 → `200` con mensajes explícitos; módulo Chunin `403`; módulo 2 (siguiente) `403` hasta completar el anterior.
- [X] Probar tutor y fallback. Con `mensaje_estudiante` válido → `200` y orientación sin entregar la respuesta final (Gemini operativo en Railway).
- [X] Probar panel docente y reportes. Login docente `200`; resumen `200` (43 estudiantes); Genin de auditoría visible con rango Genin, puntaje 4 y avance 10%; reporte individual `200` con progreso por módulo; Excel `200` (~9 KB); docente sobre rutas de estudiante `403`; reporte del propio ID docente `404`; ID inexistente `404`; ID inválido `400`.
- [X] Confirmar persistencia después de recargar. Tras re-login, dashboard Genin 0/4 módulos y avance del módulo 1 en **10%** tras 1 acierto.
- [X] Registrar fecha, URL y resultado (sin contraseñas ni tokens).

### Resultado flujo estudiante Genin en producción (2026-10-27)

| Paso | Resultado |
|---|---|
| Login | `200` estudiante |
| Dashboard pre-diagnóstico | `403` (esperado) |
| Preguntas diagnóstico | `200`, total 13 |
| Evaluar (4/13) | `200`, rango Genin |
| Repetir diagnóstico | `409` |
| Módulo 1 ejercicios | `200`, 10 ítems |
| Módulo 3 (Chunin) | `403` fuera de ruta |
| Respuesta incorrecta / correcta | `200` / `200`; progreso 10% |
| Módulo 2 | `403` secuencial |
| Estado residual | cuenta Genin con ~10% en Álgebra Básica y 2 intentos (no revertido en producción) |

### Resultado flujo docente en producción (2026-10-27)

| Paso | Resultado |
|---|---|
| Login docente | `200`, rol `docente` |
| Dashboard estudiante como docente | `403` |
| Resumen estudiantes | `200`, 43 filas; Genin id 59 con 10% / puntaje 4 |
| Reporte individual Genin | `200`; Álgebra Básica 10%; `fallos_comunes` vacío |
| Reporte sobre ID docente / inexistente / inválido | `404` / `404` / `400` |
| Descargar Excel | `200`, `Reporte_Clase_PMM.xlsx` (~9 KB) |

### Hallazgos de despliegue (2026-10-27)

| ID | Severidad | Hallazgo |
|---|---|---|
| DEP-01 | Cerrado | Tras merge PR #40/#43, login producción unifica inexistente y clave errónea en HTTP `401`. |
| DEP-02 | Baja / operativa | Front alterno `academia-pmm.vercel.app` sigue vivo y apunta a un backend Railway muerto (`academiapmm-production`). Riesgo de confusión en la auditoría del profesor. |
| DEP-03 | Observación | F-CLA-400 quedó en `main`/`develop`; el diagnóstico productivo (4→Genin) confirma Flask/Node operativos. Matriz de bordes 400 en el microservicio remoto no se reejecutó aparte. |
| DEP-04 | Cerrado | Flujos estudiante Genin y docente verificados en producción. El 10% residual en Álgebra Básica de la cuenta Genin se conserva a propósito como estado de prueba esperado. |
| DEP-05 | Corregido (pendiente commit/deploy) | `/ejercicios/evaluar` ahora inserta en `historial_errores` al fallar; `registrar-fallo` actualiza la fila reciente (5 min) con la explicación de IA para no duplicar. |

## 14. Etapa 9 — Consolidación y cierre

### Estado de la etapa

`COMPLETADA` el 27 de octubre de 2026; actualizada tras deploy post-auditoría. Entregables en `docsRevisionRepo/`. El 10% de progreso Genin en producción se conserva como estado de prueba esperado. Concepto técnico final: **A — Conforme** (H-001 429 en prod; H-002 sin high/critical; residual uuid/katex como observación).

### Entregables previstos

- [X] `docsRevisionRepo/REVISION_TECNICA_PMM.md`.
- [X] `docsRevisionRepo/RESULTADOS_PRUEBAS_PMM.md`.
- [X] Inventario maestro de pruebas (`matrices/inventario_pruebas.md`).
- [X] Matriz de cobertura de los 15 casos.
- [X] Matriz de permisos.
- [X] Matriz de trazabilidad monografía a código y prueba.
- [X] Evidencias saneadas (referenciadas en el plan operativo; sin secretos).
- [X] Hallazgos con severidad y recomendación (sección 8 de la revisión técnica).
- [X] Checklist de cierre alineado al plan del profesor (concepto + matrices).
- [X] Concepto técnico final **A** (actualizado tras deploy H-001 y cierre high de H-002).

## 15. Orden inicial recomendado para las correcciones

Las correcciones solamente se ejecutarán después de presentar el detalle y obtener autorización.

1. [X] Restablecer Railway y verificar la URL del backend oficial.
2. [X] Retirar del árbol actual los archivos con datos personales (foto y Excel); permanecen en el historial Git anterior. No se reescribirá el historial sin autorización explícita.
3. [X] Corregir referencias activas a imágenes inexistentes.
4. [X] Corregir el fallback local del frontend de `3000` a `3001` (commit `7da0145`).
5. [X] Evaluar y actualizar dependencias vulnerables de manera controlada. **2A/2B/2C:** BE sin high/critical (3 moderate `uuid`); FE 2 low `katex`. Residual documentado; no se usa `npm audit fix --force`.
6. [X] Corregir los errores de ESLint. **28→0**.
7. [X] Revisar código muerto y referencias a endpoints inexistentes. Jest productivo **13/13** (tras retirar tests de código muerto + test rate limit). Lint/build FE OK.
8. [X] Endurecer validaciones + **rate limit auth (H-001)** verificado en prod (**429**, 2026-10-27).
9. [X] Preparar `.env.example` (backend, frontend, Flask) y excepciones en `.gitignore`.
10. [X] Alinear pruebas con rutas productivas: suite Jest depurada (13 casos); brechas históricas documentadas en matrices (sin inventar cobertura ficticia).
11. [X] Ignorar artefactos locales de Python en `.gitignore` (commit `46ed6b0`).
12. [X] Documentar exclusión de la monografía `.docx` del repositorio (sensible) manteniendo hash y trazabilidad en entregables.

## 16. Registro de actualizaciones

> Nota: algunas filas antiguas hablan de “pendiente de commit” o del concepto **B** porque así estaba el trabajo ese día. Hoy el cierre vigente es el de las secciones 14–15 y las últimas filas (concepto **A**, H-001 en producción, H-002 sin high/critical).

| Fecha | Etapa | Actualización | Decisión / nota |
|---|---|---|---|
| 2026-10-26 | General | Armé este plan operativo a partir de la monografía final y del plan del profesor. | Solo documentación; no toqué código. |
| 2026-10-26 | Etapa 8 | Restablecí Railway. La API oficial me respondió HTTP 200, CORS aceptó el frontend oficial y cuatro rutas protegidas devolvieron 401 sin token. El despliegue alterno anterior sigue en 404. | Verificación remota, sin cambios de código. |
| 2026-10-26 | Etapa 0 | Registré la rama `implementacion26102026`, los hashes de los documentos, el inventario de variables, los hallazgos de configuración, la convención de evidencias y las categorías de pruebas. | Solo lectura y bitácora. |
| 2026-10-26 | Etapa 0 | Definí los alias de las cuentas ficticias. Confirmé Genin, Chunin, Jonin y docente; el docente en MySQL tiene rol `docente`, estado `Activo` e id 62. | Preparé datos de prueba; no guardé contraseñas ni tokens. |
| 2026-10-26 | Etapa 0 | Revisé las seis cuentas: cinco activas y verificadas, una inactiva y sin verificar, docente con rol correcto, todas en `Recluta`, sin diagnóstico ni progreso. Cerré la Etapa 0. | Consulta sobre datos ficticios. |
| 2026-10-26 | Etapa 1 | Reproduje la instalación Node en una copia temporal: `npm ci` OK en backend y frontend, Jest 22/22 y Vite OK. Levanté Flask en un venv temporal y corrí 34 casos del clasificador: 32 OK y 2 fallos en decimales; los 14 enteros pasaron. | Todo fuera del árbol productivo; no toqué el Python global. |
| 2026-10-26 | Etapa 1 | Instalé MySQL 8, creé `pmm_interactivo_auditoria` e importé `schema.sql` y `seed_data.sql`. Conté 17 tablas, 21 módulos, 210 ejercicios, 13 preguntas, 24 insignias y 16 recursos. | Solo entorno local; no toqué Railway. |
| 2026-10-26 | Etapa 1 | Arranqué el backend en el puerto 3001 y Sequelize conectó a la base local con `pmm_auditor`. | Sin `RESEND_API_KEY` quedó el modo simulacro de correo; no cambié código. |
| 2026-10-26 | Etapa 1 | Probé el diagnóstico con cuentas locales. Primero vi el fallback; con `IA_SERVICE_URL=http://127.0.0.1:5000` Flask recibió puntaje 4, respondió nivel 0 con 200 y el backend guardó `Genin (Iniciado)`. Cerré la Etapa 1. | Solo base local; no documenté tokens ni claves. |
| 2026-10-26 | Etapa 2 | Revisé secretos y datos personales: no vi secretos versionados, pero sí una foto identificable y un Excel con una fila de estudiante en el historial. También había `__pycache__/` sin ignore. | Solo lectura; no borré historial ni código. |
| 2026-10-26 | Etapa 2 | Revisé en estático rutas, JWT, roles, propiedad, reset, uploads, CORS, token, SQL y filtrado de errores. Anoté una severidad preliminar. | Solo lectura; las pruebas dinámicas de IDOR las dejé para después. |
| 2026-10-26 | Etapa 2 | En la base local no encontré referencias a esa foto en perfiles ni en el foro. | No borré el archivo ni toqué producción. |
| 2026-10-26 | Etapa 2 | Saqué del árbol de trabajo el Excel y la foto `ninja_media_…jpg`. | Quedaban pendientes de commit; siguen en el historial viejo de Git. |
| 2026-10-26 | Etapa 2 | Confirmé el commit `61e0331` (retiro de esos dos archivos). | Dejé fuera del commit docs de auditoría, monografía y `__pycache__/`. |
| 2026-10-26 | Etapa 2 | Creé un docente local y corrí la matriz básica de permisos: 401, 200, 403, 403 y 200, como esperaba. | Solo `pmm_interactivo_auditoria`; sin tokens de prod. |
| 2026-10-26 | Etapa 2 | En el reporte individual vi que el rol se controla, pero un docente podía consultar el ID de otro docente y recibir 200. | GET local; lo registré como hallazgo medio de alcance. |
| 2026-10-26 | Etapa 2 | Corregí el reporte docente: valido el id, solo permito rol `estudiante` y ya no filtro mensajes internos en 500. Sintaxis, `git diff --check` y Jest 22/22 OK. | Cambio que apliqué; luego repetí la matriz con el backend reiniciado. |
| 2026-10-26 | Etapa 2 | Tras la corrección confirmé: sin token 401, estudiante 403, docente→estudiante 200, docente→sí mismo 404, id inexistente 404 e id inválido 400. | Verificado en local; listo para commit. |
| 2026-10-26 | Etapa 2 | Confirmé el commit `df7513a` (solo `docenteController.js`). | No metí archivos no rastreados. |
| 2026-10-26 | Etapa 2 | Con el estudiante A creé un post; B no pudo editarlo (404) y A sí (200). | Datos ficticios locales. |
| 2026-10-26 | Etapa 2 | B dejó un comentario; A no pudo editarlo ni borrarlo (404) y B sí pudo editarlo (200). | Seguí con notificaciones. |
| 2026-10-26 | Etapa 2 | Confirmé propiedad en notificaciones y borrados: cruce 404, dueño 200; borrado cruzado del post 404; borrado propio de comentario y post 200. | Limpié esos temporales en local. |
| 2026-10-26 | Etapa 2 | Después de borrar el post no quedaron posts ni comentarios, pero la notificación seguía leída apuntando al id ya inexistente. | Hallazgo bajo de integridad; no cambié código en ese momento. |
| 2026-10-26 | Etapa 2 | En la eliminación del post añadí la limpieza de notificaciones ligadas a esa ruta. Sintaxis, `git diff --check` y Jest 22/22 OK. | Luego lo volví a probar con un post nuevo. |
| 2026-10-26 | Etapa 2 | Al repetir: 200 al borrar, post inexistente, cero comentarios, notificación presente antes y ausente después. | Quedó una notificación vieja de la prueba anterior; la limpié solo en local. |
| 2026-10-26 | Etapa 2 | Confirmé el commit `29ccc81` (ocho líneas en `estudianteController.js`) y borré esa notificación huérfana con condición exacta. | Commit selectivo; temporales limpios. |
| 2026-10-26 | Etapa 2 | Corrí siete casos de registro: cinco 400 esperados y dos 500 con correo/contraseña numéricos. | No creé usuarios nuevos; anoté el problema de tipos. |
| 2026-10-26 | Etapa 2 | Corrí siete casos de login: tres 500, dos 404, un 401 por clave mala y un 200 válido. | Vi validación incompleta y enumeración. |
| 2026-10-27 | Etapa 2 | Después de corregir registro/login: los siete registros dieron 400; en login, inválidos 400, inexistente/clave mala 401 y dos logins válidos 200 (también con mayúsculas/espacios). | Nada de eso creó usuarios. |
| 2026-10-27 | Etapa 2 | La corrección de `authController` pasó `node --check`, `git diff --check` y Jest 22/22. | Recuperación la dejé para el bloque siguiente. |
| 2026-10-27 | Etapa 2 | Confirmé el commit `ad67d51` (solo `authController.js`). | Docs y monografía fuera del commit. |
| 2026-10-27 | Etapa 2 | Cinco casos de forgot-password: ausente 500; numérico/inválido 200; inexistente y existente 200. | Solo generé un token temporal en la cuenta ficticia. |
| 2026-10-27 | Etapa 2 | Con token válido envié reset sin clave y con clave numérica: ambos 401 en vez de 400. | El token siguió vivo y no cambió la clave. |
| 2026-10-27 | Etapa 2 | Con un token válido puse temporalmente `123`, confirmé login, emití otro token, restauré la clave original y volví a entrar con 200. | Solo cuenta local; no guardé tokens en la evidencia. |
| 2026-10-27 | Etapa 2 | Corregí forgot/reset: correo normalizado, clave textual mínimo 6 caracteres y errores separados. Checks y Jest 22/22 OK. | Reinicié y repetí las matrices. |
| 2026-10-27 | Etapa 2 | Repetí: inválidos 400, anti-enumeración 200/200, tres claves malas 400, reset OK 200, token usado/inexistente 401 y login final 200. | La cuenta ficticia quedó con su clave original. |
| 2026-10-27 | Etapa 2 | Confirmé el commit `a9e7e9c` (solo `authController.js`). | Sin archivos extra. |
| 2026-10-27 | Etapa 2 | Quité las listas cerradas de dominio en login/registro, dejé la pista visual de dominios docentes y limité el cierre global de sesión a 401 de rutas protegidas. Vite 2791 módulos; ESLint seguía en 28, sin tocar esos tres archivos. | Alineé el front con la limitación de la monografía; luego lo miré en pantalla. |
| 2026-10-27 | Etapa 2 | En pantalla: login con `@example.com`, registro duplicado como estudiante, correo inválido en recuperación y token inválido sin alerta ni redirección rara. | Listo para commit. |
| 2026-10-27 | Etapa 2 | Confirmé el commit `8f7710a` (`api.js`, `Login.jsx`, `Registro.jsx`). | Sin extras. |
| 2026-10-27 | Etapa 2 | Probé en memoria un JWT inválido y uno vencido contra ruta protegida: ambos 401. También comprobé el uso único del token de recuperación. | No imprimí ni guardé esos tokens. |
| 2026-10-27 | Etapa 2 | Intenté registrar pidiendo `rol: docente`; el backend asignó `estudiante`. | Escalamiento por cliente rechazado; luego limpié ese usuario inactivo. |
| 2026-10-27 | Etapa 2 | Localicé esa cuenta por correo exacto, la borré y verifiqué conteo cero. | Solo datos ficticios locales. |
| 2026-10-27 | Etapa 2 | Foro inválido: post corto 200, comentario vacío 200, post inexistente 500, título 151 chars 500; al limpiar el post temporal 200. | Anoté falta de validación; aún no cambié código. |
| 2026-10-27 | Etapa 2 | Tras corregir el foro: corto 400, inexistente 404, título largo 400, post OK 200, comentario vacío 400, comentario OK 200, delete 200, multipart malo 400 y sin archivos basura. Jest 22/22. | Datos temporales fuera. |
| 2026-10-27 | Etapa 2 | Confirmé el commit `c4c0e7c` (solo `estudianteController.js`). | Sin extras. |
| 2026-10-27 | Etapa 2 | En uploads: texto disfrazado de PNG pasó 200; extensión/MIME/tamaño malos 400; al borrar el post el archivo quedaba. | Limpié post y archivo; anoté firma y ciclo de vida. |
| 2026-10-27 | Etapa 2 | Añadí validación binaria PNG/JPEG/WebP y limpieza segura al rechazar/reemplazar/borrar. Checks y Jest 22/22 OK. | Middleware, rutas y controlador. |
| 2026-10-27 | Etapa 2 | Repetí: texto disfrazado, MIME malo y >5 MB → 400; PNG real → 200; al borrar el post el archivo desapareció. | Temporales limpios. |
| 2026-10-27 | Etapas 2 y 4, CU-01 | Misma cuenta: activa/verificada 200, verificada/inactiva 403, no verificada 403. | Restauré `verificado=1` y `Activo`; no hizo falta cambiar código. |
| 2026-10-27 | Etapa 2 | Mandé 15 logins locales con clave mala: todos 401, sin RateLimit ni `Retry-After`. | Confirmé el hueco de rate limit; lo corregí más adelante. |
| 2026-10-27 | Etapa 2 | Cambié `/incorrecto.png` y `/estudiando.png` por imágenes que ya estaban en `public`. Vite 2791 OK. | Solo tres páginas; sin paquetes nuevos. |
| 2026-10-27 | Etapa 3 | Clasifiqué las 5 suites / 22 pruebas, mocks y rutas. Vi cobertura sobre código desconectado y huecos sin test automático. | Decidí no inflar Jest a la fuerza; las brechas las cubrí con pruebas dinámicas. |
| 2026-10-27 | Etapa 4, HU-05 | Matriz dinámica OK: carga segura, sin spoiler, rango/secuencia, inválidos, orden, correcta/incorrecta y 10% con 2 intentos. | Borré ese progreso temporal; faltaba el texto accesible en UI. |
| 2026-10-27 | Etapa 4, HU-05 | Añadí el mensaje del backend con estilo no solo por color y `aria-live`. Vite 2791 OK. | Luego lo miré en pantalla. |
| 2026-10-27 | Etapa 4, HU-05 | Vi mensajes correcto/incorrecto, el fallback del tutor y ocho fallos guardados. | Limpié progreso, esos ocho errores y la notificación 4; di por cerrada HU-05. |
| 2026-10-27 | Etapas 4 y 6, HU-06 | Revisé payload, prompt, PII, validaciones, timeout y UI del tutor sin llamar al proveedor. | Sin nombre/correo/ID; faltaban validación, timeout y estado honesto. Prueba real la dejé sin clave. |
| 2026-10-27 | Etapas 4 y 6, HU-06 | Corregí validación, entrada, timeout, vacíos y UI. Seis mocks temporales OK y los retiré; Jest se mantuvo en 22 y Vite 2791. | Sin Gemini real ni deps nuevas; luego matriz dinámica. |
| 2026-10-27 | Etapas 4 y 6, HU-06 | Matriz: vacío/numérico/1001 chars/id malo → 400 antes del proveedor. | Cerré HU-06 con mocks; no corrí injection semántica real sin credencial. |
| 2026-10-27 | Docs / config | Commit `7da0145`: README con URL base del microservicio y fallback local del front en 3001. | Solo `README.md` y `api.js`. |
| 2026-10-27 | Docs / config | Commit `46ed6b0`: ignore de `__pycache__/` y `*.py[cod]`. | La caché de Flask deja de molestar como untracked. |
| 2026-10-27 | Etapa 5, lote A | Dictaminé HU-01/03/04/05/07: cumplen; HU-05 ya corregida; CA-01.1 parcial documentado. | Solo lectura. Anoté IDs hardcodeados en herencia; rate limit aún pendiente ese día. |
| 2026-10-27 | Etapa 5, lotes B–D | Cerré HU/CU-01 a 15 en criterios esenciales; CA-01.1 parcial; HU-06 con límite de Gemini. | Solo lectura; sin tocar código ese día. |
| 2026-10-27 | Etapa 6 | Matriz Flask: 0–13 y `>13` según regla antigua; `-1` como Genin; null/cadena/objeto/vacío → 500; decimales 6.9/10.5 raros. Gemini con mocks/PII; prueba real BLOCKED. | Dejé anotado el candidato a validar 0–13 con 400. |
| 2026-10-27 | Etapa 7 | Contrasté modelos vs schema (`rango` no está en el modelo). Build ~4,69 MB JS. ESLint 27. Audit BE/FE 21. A11y parcial. | Solo lectura; F-CLA-400 pendiente ese día. |
| 2026-10-27 | Etapa 7 restante | Revisé teclado/foco (labels, módulos, AscensoModal), viewports 375/768/1280 y latencias &lt;100 ms en muestra. | Sin preview Vite levantado; sin capturas formales. |
| 2026-10-27 | F-CLA-400 | Apliqué validación estricta 0–13 en `app.py` y 400 fuera de dominio (opción A). | Lo implementé yo; luego commit/redeploy Flask. |
| 2026-10-27 | F-CLA-400 | Tras reiniciar local: 15/15 PASS (bordes 0/6/7/10/11/13 → 200; inválidos → 400). | Verificación local antes del commit de `app.py`. |
| 2026-10-27 | Etapa 8 | Smoke oficial: FE/BE 200, CORS 204, rutas 401. Auth negativo en prod aún distinguía 404/401. Front alterno → Railway 404. Flujos con AUD-* aún BLOCKED ese día. | Solo lectura remota; sin claves en la bitácora. |
| 2026-10-27 | Deploy | Mergeé PR #40 a `develop` y #43 a `main` (F-CLA-400 y cadena). Login prod unifica inexistente/clave mala en 401. Bundle nuevo. | Post-merge remoto. |
| 2026-10-27 | Etapa 8 autenticada | Con Genin: login, diagnóstico 4/13→Genin, ejercicios, bloqueos 403, tutor 200, progreso 10% en módulo 1. | No documenté la clave; dejé el 10% a propósito. |
| 2026-10-27 | Etapa 8 docente | Login docente, resumen 43, reporte Genin, Excel, aislamiento 403/404/400. Marqué Etapa 8 COMPLETADA. | Observé `fallos_comunes` vacío tras una incorrecta (luego unifiqué HU-11). |
| 2026-10-27 | Etapa 8/9 | Decidí conservar el 10% de progreso Genin como estado esperado de la cuenta de prueba. | Mi decisión para no borrar evidencia útil. |
| 2026-10-27 | Etapa 9 | Armé `docsRevisionRepo/` (revisión, resultados, matrices). Ese día el concepto quedó en **B**. | Solo docs; el concepto pasó a **A** después del deploy de H-001/H-002. |
| 2026-10-27 | Deps 2A | Corrí `npm audit fix` sin force en backend: 21→4; se fue la crítica de `proxy-addr`. Jest 22/22. | Solo `package-lock.json`. |
| 2026-10-27 | Deps 2B | Igual en frontend: 21→2 low (`katex`). Build Vite OK. | Solo `package-lock.json`. |
| 2026-10-27 | HU-11 | Unifiqué el historial: `evaluarEjercicio` registra el fallo y `registrarFallo` completa la explicación sin duplicar. Jest OK. | Luego commit y redeploy. |
| 2026-10-27 | Accesibilidad | Puse `htmlFor`/`id` en login/registro/recuperación; módulos con teclado y `aria-label`; AscensoModal enfoca al abrir. | Frontend. |
| 2026-10-27 | Docs | Añadí `.env.example` en backend, frontend e ia-service; `.gitignore` con `!.env.example`. | Sin secretos. |
| 2026-10-27 | ESLint | Dejé `npm run lint` en 0 (ignore de `motion`/configs; `catch` limpios; escapes; Campana justificada). | Revisé caso a caso para no silenciar falsos positivos. |
| 2026-10-27 | Depuración | Retiré código muerto confirmado (VisualizadorModulo, controllers huérfanos, etc.). Jest 12/12 en ese momento; lint/build OK. | No toqué `InfoTooltip` ni `GET /api/progreso/estado`. |
| 2026-10-27 | test_clasificador | Alineé `test_clasificador.py` a F-CLA-400 (fuera de rango e inválidos → 400). | Solo el script del microservicio. |
| 2026-10-27 | H-001 | Puse rate limit en login/Google/registro/forgot/reset (`express-rate-limit`, IP+correo). Jest 13/13 con 429. | Luego commit y smoke en prod. |
| 2026-10-27 | H-002 | Quité `nodemailer` (no se usaba; el correo va por Resend). Audit BE sin high/critical; 3 moderate `uuid`. | Confirmé cero usos en `src/`. |
| 2026-10-27 | Deploy + smoke | Con los PR ya en prod: fallos de login → 401 y después **429** (Retry-After ≈ 898). Actualicé el concepto a **A** en `docsRevisionRepo`. | Smoke remoto post-deploy. |
| 2026-10-27 | Docs cierre | Dejé los entregables alineados a A; la monografía la consulté (SHA-256) pero la excluía del repo por datos sensibles; actualicé `.gitignore` y reescribí este registro en primera persona. | Paquete listo para versionar sin el `.docx`. |
