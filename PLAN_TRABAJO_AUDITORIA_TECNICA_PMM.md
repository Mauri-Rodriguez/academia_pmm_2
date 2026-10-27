# Plan de trabajo para la auditoría técnica rigurosa de PMM Interactivo

## 1. Identificación del plan

- **Proyecto auditado:** PMM Interactivo.
- **Propósito:** verificar, mediante evidencia reproducible, si el software entregado coincide con las afirmaciones del trabajo de grado y si satisface los criterios de aceptación de los casos CU-01 a CU-15.
- **Documento rector:** `instrucciones_codex_revision_PMM_Interactivo.md`.
- **Modalidad:** auditoría técnica y funcional independiente, priorizando un entorno local o de prueba.
- **Principio de preservación:** durante la obtención de la línea base no se modificará la lógica productiva para hacer pasar pruebas.
- **Unidad de trazabilidad:** afirmación académica → requisito/caso de uso → componente → prueba → evidencia → hallazgo → concepto final.

## 2. Objetivos

### 2.1 Objetivo general

Determinar, con evidencia verificable, el grado de conformidad técnica y funcional de PMM Interactivo, su reproducibilidad, seguridad básica, integridad de datos y correspondencia con el documento académico.

### 2.2 Objetivos específicos

1. Establecer una línea base inmutable del repositorio, sus versiones y su configuración.
2. Reproducir la instalación, compilación, ejecución y pruebas existentes sin corregir previamente el producto.
3. Confirmar la arquitectura realmente implementada y el flujo entre frontend, backend, MySQL, microservicio Flask y Gemini.
4. Auditar los 15 casos de uso, con prioridad especial para HU-01, HU-05 y HU-06.
5. Comprobar autenticación, autorización, validación de entrada, persistencia, protección de datos y manejo de errores.
6. Verificar el clasificador, la integración con Gemini y las pruebas Jest reportadas.
7. Contrastar las afirmaciones del trabajo de grado con el código y con pruebas ejecutadas.
8. Emitir hallazgos priorizados y un concepto técnico final sustentado.

## 3. Alcance

### 3.1 Incluido

- Código fuente, configuración, documentación, scripts, modelos, esquema de datos y artefactos versionados.
- Instalación y ejecución local de los componentes disponibles.
- Pruebas estáticas, unitarias, de integración y funcionales controladas.
- Verificación de los 15 casos de uso y sus reglas de negocio.
- Autenticación, autorización por roles, IDOR y validación de entradas.
- Persistencia e integridad en MySQL/Sequelize.
- Clasificador Flask/scikit-learn y su integración con Node.
- Gemini mediante mocks; prueba real solo con credencial autorizada y control de costo.
- Revisión técnica básica de accesibilidad, usabilidad y rendimiento.
- Dependencias, secretos, configuración de despliegue y CI.
- Comparación entre afirmaciones académicas y evidencia técnica.

### 3.2 Excluido, salvo autorización posterior

- Pentesting agresivo sobre Vercel, Railway u otra infraestructura pública.
- Pruebas destructivas o de carga sobre producción.
- Creación masiva de usuarios o generación significativa de consumo en Gemini.
- Corrección del producto antes de cerrar y preservar la línea base de resultados.
- Certificación formal de cumplimiento WCAG.
- Medición del impacto pedagógico, aprendizaje, rendimiento o deserción.
- Interpretación del resultado SUS como prueba de eficacia educativa.

## 4. Condiciones previas y decisiones que deben quedar registradas

Antes de iniciar las pruebas funcionales se documentará:

1. URL o ubicación del repositorio, rama y commit exactos.
2. Estado del árbol de trabajo y archivos no versionados existentes.
3. Versión exacta del trabajo de grado usada como referencia.
4. Sistemas operativos y versiones de Node, npm, Python, pip, MySQL y Docker, si aplica.
5. Archivos `.env.example` y variables requeridas por componente.
6. Disponibilidad de base de datos, servicio de correo, Gemini y microservicio Flask.
7. Credenciales de prueba autorizadas para estudiante y docente.
8. Datos iniciales, fixtures o procedimientos para crear datos controlados.
9. Autorización expresa para probar entornos remotos, si se requiere.
10. Política de anonimización, conservación y eliminación de evidencias.

La ausencia de un insumo no se interpretará automáticamente como defecto funcional. Se registrará como impedimento de reproducibilidad o prueba `BLOCKED`, según corresponda.

## 5. Reglas de ejecución y clasificación

### 5.1 Estados de prueba

- **PASS:** la prueba fue ejecutada, el resultado observable coincide completamente con lo esperado y existe evidencia suficiente.
- **FAIL:** la prueba fue ejecutada y existe una diferencia reproducible respecto del criterio esperado.
- **BLOCKED:** la ejecución no pudo completarse por una dependencia, credencial, dato, servicio o condición externa identificada.
- **NOT RUN:** la prueba todavía no fue ejecutada. No equivale a `BLOCKED` ni a `PASS`.
- **NOT APPLICABLE:** el requisito fue descartado con justificación y evidencia de que no pertenece al diseño evaluado.

### 5.2 Severidad de hallazgos

- **Crítica:** afecta seguridad, datos, autenticación/autorización o impide una función esencial.
- **Alta:** incumple un criterio esencial o prioritario, o produce resultados incorrectos relevantes.
- **Media:** implementación parcial, inconsistencia o error recuperable.
- **Baja:** interfaz, mantenibilidad, documentación o comportamiento menor.
- **Observación:** requiere aclaración, pero no demuestra un defecto.

### 5.3 Reglas de evidencia

- Toda evidencia debe incluir fecha, entorno, commit y prueba relacionada.
- Se anonimizarán nombres, correos, tokens, cookies, claves y demás datos personales.
- No se capturarán secretos en consola, imágenes, reportes o historial de comandos.
- Los logs se conservarán sin edición; si se publica una copia saneada, se mantendrá también su referencia al original protegido.
- No se marcará una prueba como aprobada basándose únicamente en lectura de código.
- La inspección estática, la prueba automatizada y la prueba manual se reportarán por separado.

## 6. Organización de artefactos

Se propone la siguiente estructura, creada durante la auditoría:

```text
docsRevisionRepo/
├── PLAN_TRABAJO_AUDITORIA_TECNICA_PMM.md
├── REVISION_TECNICA_PMM.md
├── RESULTADOS_PRUEBAS_PMM.md
├── matrices/
│   ├── inventario_pruebas.csv
│   ├── matriz_cobertura.md
│   ├── matriz_permisos.md
│   └── trazabilidad_documento_software.md
├── evidencias_revision/
│   ├── 00_linea_base/
│   ├── 01_reproducibilidad/
│   ├── 02_tests_existentes/
│   ├── 03_casos_uso/
│   ├── 04_integraciones/
│   ├── 05_seguridad_datos/
│   ├── 06_bd/
│   ├── 07_accesibilidad_rendimiento/
│   └── 08_cierre/
└── auditoria_tests/
    ├── README.md
    ├── fixtures/
    ├── mocks/
    ├── integration/
    └── e2e/
```

Convención de evidencia:

```text
EV-<FASE>-<PRUEBA>-<NNN>_<descripcion>.<ext>
```

Ejemplo: `EV-F05-T-CU03-04-001_respuesta_endpoint.json`.

## 7. Estrategia general

La auditoría se ejecutará en ocho fases con puertas de control. Cada fase debe dejar un resultado verificable antes de avanzar. Si una limitación impide ejecutar una prueba, se continuará con las actividades independientes y se registrará el bloqueo.

| Fase | Propósito | Esfuerzo orientativo | Salida principal |
|---|---|---:|---|
| 0 | Preparación, alcance y línea base | 0,5–1 día | Acta de línea base e inventario |
| 1 | Reproducibilidad y arquitectura | 1–2 días | Mapa técnico y bitácora de instalación |
| 2 | Integridad, secretos y análisis estático | 1–2 días | Hallazgos iniciales y superficie de ataque |
| 3 | Pruebas existentes y cobertura | 1 día | Verificación de 5 suites/22 pruebas |
| 4 | Regresión prioritaria HU-01, HU-05 y HU-06 | 1,5–2 días | Dictamen de regresión |
| 5 | Casos CU-01 a CU-15 e integraciones | 5–8 días | Resultados funcionales y evidencias |
| 6 | BD, seguridad, calidad, accesibilidad y rendimiento | 2–4 días | Resultados transversales |
| 7 | Consolidación y concepto final | 1–2 días | Informes finales y matrices |

**Estimación total:** 13–22 jornadas-persona, dependiendo de la reproducibilidad del entorno, disponibilidad de credenciales y nivel de automatización existente. Es una estimación de esfuerzo, no una fecha contractual.

## 8. Plan detallado por fases

### Fase 0 — Preparación y línea base

#### Actividades

1. Leer el documento académico completo y registrar versión, fecha y fuente.
2. Identificar el repositorio, rama, commit, tags y estado local recibido.
3. Inventariar carpetas, componentes y documentación, sin inferir tecnologías solo por dependencias declaradas.
4. Crear el registro maestro de pruebas con identificadores únicos.
5. Definir los entornos: local, prueba controlada y remoto autorizado.
6. Preparar la política de evidencia, anonimización y custodia de secretos.
7. Definir cuentas de prueba y datos controlados para roles estudiante/docente.
8. Registrar todos los bloqueos iniciales y supuestos necesarios.

#### Criterio de salida

- Commit y entorno identificados.
- Alcance aprobado y restricciones registradas.
- Inventario inicial de pruebas y evidencias creado.
- Ninguna prueba productiva ha modificado el código del producto.

### Fase 1 — Reproducibilidad, instalación y arquitectura

#### Actividades

1. Identificar tecnologías y versiones realmente utilizadas.
2. Revisar scripts de instalación, inicio, build, lint, type-check y test.
3. Instalar dependencias siguiendo exclusivamente la documentación disponible.
4. Levantar frontend, backend, base de datos y microservicio por separado.
5. Registrar comandos, salidas, tiempos, advertencias y pasos no documentados.
6. Comprobar imports, rutas, archivos referenciados y variables de entorno.
7. Trazar los flujos:
   - frontend → backend;
   - backend → MySQL;
   - backend → Flask;
   - backend → Gemini;
   - backend → correo/almacenamiento, si existen.
8. Revisar CI, despliegue y evidencia de Vercel/Railway sin ejecutar cambios remotos.
9. Elaborar el mapa de arquitectura real y compararlo con la arquitectura declarada.

#### Evidencias mínimas

- Versiones de herramientas.
- Salidas de instalación y build.
- Puertos y servicios levantados.
- Variables requeridas, solo por nombre.
- Diagrama o tabla de componentes y dependencias.

#### Criterio de salida

- Cada componente está ejecutándose o tiene un bloqueo reproducible y documentado.
- Existe una lista de diferencias entre arquitectura declarada e implementada.

### Fase 2 — Integridad, seguridad básica y análisis estático

#### Actividades

1. Detectar archivos faltantes, imports rotos, rutas inexistentes y dependencias no declaradas.
2. Buscar `.env`, secretos, claves, tokens, credenciales, datos personales, dumps y capturas sensibles.
3. Revisar `.gitignore`, lockfiles, binarios, temporales y artefactos innecesarios.
4. Localizar `TODO`, `FIXME`, código crítico comentado, endpoints de depuración y logs sensibles.
5. Revisar CORS, headers, cookies, JWT, expiración, configuración de producción y exposición de errores.
6. Identificar rutas y middleware de autenticación/autorización.
7. Construir una primera matriz endpoint → método → rol → middleware → controlador → modelo/servicio.
8. Revisar dependencias obsoletas o vulnerables, registrando fecha, herramienta y limitaciones.

#### Criterio de salida

- Los secretos o datos sensibles encontrados están documentados sin reproducir su valor.
- Existe un inventario de endpoints y controles de acceso para orientar las pruebas dinámicas.

### Fase 3 — Verificación de pruebas existentes

#### Actividades

1. Localizar y contar suites y casos Jest reales.
2. Confirmar o refutar la afirmación de 5 suites y 22 pruebas.
3. Detectar `.skip`, `.only`, pruebas vacías y aserciones triviales.
4. Clasificar cada prueba como unitaria, integración parcial o integración real.
5. Identificar mocks y componentes que reemplazan.
6. Ejecutar las pruebas sin modificarlas y conservar la salida completa.
7. Ejecutar cobertura si está configurada o puede obtenerse sin alterar el producto.
8. Comparar cobertura declarada, cobertura observada y funciones esenciales no cubiertas.

#### Criterio de salida

- Conteo verificable de suites/tests.
- Resultado reproducible con versión de Node/npm.
- Inventario de vacíos de cobertura.

### Fase 4 — Regresión prioritaria HU-01, HU-05 y HU-06

#### HU-01 — Registro e inicio de sesión

- Comparar validaciones de correo en frontend y backend.
- Probar correo institucional y no institucional.
- Verificar duplicados, activación, login, tokens y rutas protegidas.
- Determinar si el rol se deriva del dominio o de datos controlados por el cliente.
- Dictaminar: defecto permanece, fue corregido o cambió de comportamiento.

#### HU-05 — Ejercicios interactivos

- Probar respuestas correctas, incorrectas, vacías y manipuladas.
- Verificar indicación inequívoca y accesible de correcto/incorrecto.
- Confirmar registro de progreso y errores.
- Dictaminar el estado del defecto previo.

#### HU-06 — Tutor virtual

- Inspeccionar construcción del prompt y payload al proveedor.
- Confirmar inclusión de nivel, contexto y respuesta del estudiante.
- Confirmar ausencia de nombre, correo e identificadores innecesarios.
- Ejecutar pruebas con proveedor mockeado y fallos controlados.
- Dictaminar el estado del defecto previo.

#### Criterio de salida

- Cada historia tiene evidencia de código, payload y comportamiento ejecutado cuando sea posible.
- El informe usa literalmente una de las categorías: “permanece”, “fue corregido” o “cambió de comportamiento”.

### Fase 5 — Auditoría funcional de CU-01 a CU-15

Cada caso se probará en cinco dimensiones: funcional positiva, negativa, autorización, persistencia e integración.

#### Lote A — Prioridad alta

1. **CU-01:** registro, activación, login, logout, tokens y correo institucional/no institucional.
2. **CU-03:** 13 preguntas, 14 puntajes, rangos, repetición, manipulación y persistencia.
3. **CU-04:** rutas Genin/Chunin/Jonin, bloqueos, acceso directo y desbloqueo.
4. **CU-05:** feedback, orientación, progreso y registro de errores.
5. **CU-07:** progreso global/por módulo, Chakra, concurrencia y propiedad del recurso.
6. **CU-09:** panel docente, filtros, aislamiento de datos y consistencia.
7. **CU-11:** errores frecuentes con datos controlados 5/2/0.
8. **CU-12:** búsquedas, normalización, entradas especiales y parametrización.
9. **CU-13:** reportes general/individual, contenido, permisos, volumen y exposición de PII.

#### Lote B — Prioridad media

1. **CU-02:** recuperación de contraseña, tokens, expiración, reutilización y enumeración.
2. **CU-06:** batería mínima de 20 prompts, contexto, seguridad, fallos y pertinencia.
3. **CU-10:** reporte individual, manipulación de ID y consistencia con BD.
4. **CU-14:** insignias, progresión, duplicados, manipulación y condiciones de carrera.

#### Lote C — Prioridad baja

1. **CU-08:** enlaces/materiales, correspondencia, acceso y recursos faltantes.
2. **CU-15:** publicaciones, imágenes, MIME, tamaño, XSS, permisos, traversal y notificaciones.

#### Procedimiento común por caso

1. Identificar requisito y criterio de aceptación.
2. Trazar interfaz → endpoint → middleware → controlador/servicio → modelo/BD.
3. Preparar datos controlados y precondiciones.
4. Ejecutar prueba positiva.
5. Ejecutar pruebas negativas y de límites.
6. Probar acceso directo al endpoint con cada rol.
7. Comprobar estado antes/después en la base de datos.
8. Recargar o iniciar nueva sesión para verificar persistencia.
9. Adjuntar evidencia saneada.
10. Registrar hallazgo si el resultado difiere.

#### Criterio de salida

- Todos los casos tienen estado por dimensión.
- Ningún `PASS` carece de evidencia de ejecución.
- Los bloqueos describen causa, impacto y acción necesaria para resolverlos.

### Fase 6 — Integraciones y pruebas transversales

#### 6.1 Integraciones independientes de auditoría

Crear, fuera de la lógica productiva, pruebas para:

1. frontend → backend;
2. backend → MySQL;
3. backend → Flask;
4. backend → Gemini mock;
5. flujo diagnóstico completo;
6. flujo de progreso completo;
7. rol docente;
8. exportación de reportes;
9. comunidad + notificación;
10. recuperación de contraseña.

Los artefactos se ubicarán en `auditoria_tests/`, con un `README` que indique requisitos, comandos, datos creados y método de limpieza segura.

#### 6.2 Autenticación y autorización

- Ejecutar matriz sin login/estudiante/docente.
- Probar endpoints directamente, no solo navegación visible.
- Revisar IDOR, escalamiento, tokens inválidos/expirados y roles enviados por cliente.
- Intentar modificar recursos pertenecientes a otro usuario con datos de prueba.

#### 6.3 Validación de entrada

- Nulos, faltantes, tipos incorrectos y rangos inválidos.
- Strings largos, Unicode, HTML, JavaScript y cadenas SQL-like.
- Arrays/objetos inesperados y JSON anidado.
- Archivos con extensión falsa, MIME incorrecto, tamaño excesivo y traversal.

#### 6.4 Contraseñas, tokens y datos personales

- Hash, comparación, expiración, invalidación y recuperación.
- Secretos fuera del repositorio y ausencia de datos sensibles en JWT/logs.
- PII enviada a Gemini, incluida en reportes o expuesta por endpoints.

#### 6.5 Clasificador

- Revisar entrenamiento, 14 observaciones, parámetros y serialización.
- Ejecutar exhaustivamente puntajes 0–13.
- Probar `-1`, `14`, `999`, `null`, cadena, decimal y objeto.
- Comparar el árbol con la regla fija y documentar complejidad/limitaciones.

#### 6.6 Gemini

- Revisar modelo configurado, prompt, contexto, PII, timeout, reintentos y rate limit.
- Mockear éxito, timeout, error del proveedor, respuesta vacía y salida inesperada.
- Revisar renderizado/sanitización de la respuesta.
- Realizar una prueba real únicamente si hay clave autorizada, presupuesto y entorno seguro.

### Fase 7 — Base de datos, calidad, accesibilidad y rendimiento

#### 7.1 Base de datos e integridad

- Contar tablas y verificar la afirmación de 17.
- Comparar modelos Sequelize, migraciones y `schema.sql`.
- Revisar PK, FK, índices, `NOT NULL`, `UNIQUE`, cascadas y transacciones.
- Identificar tablas previstas pero no utilizadas.
- Probar integridad en diagnóstico, progreso, errores, insignias, publicaciones y notificaciones.
- Usar transacciones o una base desechable para cualquier prueba que altere datos.

#### 7.2 Calidad del código

- Backend: separación de responsabilidades, validación, errores, async, N+1 y duplicación.
- Frontend: estado, carga, vacíos, errores, rutas, accesibilidad y contenido de IA.
- Python: reproducibilidad, tipos, validación, carga del modelo, excepciones y logging.

#### 7.3 Accesibilidad técnica

- Teclado, foco, labels, `alt`, contraste, zoom, mensajes y estados.
- Revisar escritorio y móvil con tamaños de viewport registrados.
- Separar hallazgos automatizados de evaluación manual.
- No afirmar cumplimiento WCAG global.

#### 7.4 Rendimiento básico

- Medir endpoints principales en entorno controlado y documentar hardware/datos.
- Revisar listas, N+1, tamaño de respuestas, bundles, imágenes y exportaciones.
- Reportar percentiles/medianas cuando se repitan mediciones; sin umbral acordado, tratar los datos como descriptivos.
- No ejecutar carga destructiva.

#### Criterio de salida

- La estructura de datos y las reglas críticas están contrastadas con ejecución o inspección explícitamente diferenciada.
- Las mediciones indican contexto y no presentan conclusiones superiores a la evidencia.

### Fase 8 — Consolidación, revisión cruzada y cierre

#### Actividades

1. Normalizar hallazgos y eliminar duplicados sin perder trazabilidad.
2. Validar que cada hallazgo incluya prueba, esperado, obtenido, evidencia, severidad y recomendación.
3. Completar la matriz de cobertura CU-01 a CU-15.
4. Completar la matriz de permisos.
5. Completar la tabla afirmación académica → evidencia → prueba → resultado → coincidencia.
6. Marcar como `NO VERIFICABLE CON LA EVIDENCIA DISPONIBLE` toda afirmación sin soporte suficiente.
7. Verificar conteos: módulos, ejercicios, distribución 40/90/80, preguntas, tablas, suites y tests.
8. Revisar expresamente las afirmaciones sobre Vercel, Railway, GitHub Actions y Gemini 2.5 Flash-Lite.
9. Elaborar resumen ejecutivo, limitaciones y riesgos residuales.
10. Emitir concepto A, B, C o D conforme a las reglas del documento rector.
11. Hacer revisión final de secretos y PII antes de entregar evidencias.

#### Criterio de salida

- Todos los resultados son rastreables a una evidencia.
- No existen pruebas con estado implícito.
- Las limitaciones y bloqueos se distinguen de los defectos.
- El concepto final se deriva de los hallazgos y no de una impresión general.

## 9. Inventario mínimo de pruebas

El inventario maestro debe contener, como mínimo:

| Campo | Descripción |
|---|---|
| ID | Identificador único, por ejemplo `T-CU03-04` |
| Requisito | Criterio o afirmación evaluada |
| Caso | CU/HU relacionado |
| Tipo | Estática, unitaria, integración, E2E, manual, seguridad |
| Prioridad | Alta, media o baja |
| Precondiciones | Estado necesario del entorno/datos |
| Datos | Entradas exactas |
| Pasos | Procedimiento reproducible |
| Esperado | Resultado objetivo |
| Obtenido | Resultado observado |
| Estado | PASS/FAIL/BLOCKED/NOT RUN/N/A |
| Evidencia | Ruta o referencia |
| Componentes | Archivos, funciones, endpoints, tablas |
| Hallazgo | ID del hallazgo, si existe |

## 10. Matrices obligatorias

### 10.1 Matriz de cobertura por caso

| Caso | Funcional | Negativo | Autorización | Persistencia | Integración | Estado general |
|---|---:|---:|---:|---:|---:|---|
| CU-01 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-02 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-03 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-04 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-05 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-06 | Pendiente | Pendiente | Pendiente | Por definir | Pendiente | NOT RUN |
| CU-07 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-08 | Pendiente | Pendiente | Pendiente | Pendiente | Por definir | NOT RUN |
| CU-09 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-10 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-11 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-12 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-13 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-14 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |
| CU-15 | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NOT RUN |

### 10.2 Matriz de permisos inicial

| Recurso | Sin login | Estudiante | Docente | Verificación |
|---|---:|---:|---:|---|
| Panel estudiante | No | Sí | Según diseño documentado | Endpoint + UI |
| Diagnóstico | No | Sí | Según diseño documentado | Endpoint + UI |
| Módulos | No | Sí | Según diseño documentado | Endpoint + UI |
| Tutor | No | Sí | Según diseño documentado | Endpoint + UI |
| Comunidad | No | Sí | Según diseño documentado | Endpoint + UI |
| Panel docente | No | No | Sí | Endpoint + UI |
| Reporte individual | No | No | Sí | Endpoint + archivo |
| Reporte general | No | No | Sí | Endpoint + archivo |

Los valores “según diseño documentado” deben resolverse contra requisitos explícitos antes de calificarse.

## 11. Gestión de datos de prueba

Se crearán datos mínimos, ficticios y fácilmente identificables:

- un estudiante Genin;
- un estudiante Chunin;
- un estudiante Jonin;
- un docente;
- un usuario sin activar;
- un usuario sin progreso;
- datos de errores controlados 5/2/0;
- módulos completos, parciales y bloqueados;
- publicaciones con y sin respuestas;
- insignias y notificaciones controladas.

Los datos se cargarán en una base local/desechable o mediante fixtures. La limpieza se hará solo sobre registros creados por la auditoría y mediante procedimientos explícitos. No se eliminarán datos ajenos.

## 12. Gestión de riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Documentación incompleta | Bloqueo de instalación o requisitos ambiguos | Registrar supuestos; solicitar versión exacta; usar BLOCKED |
| Falta de credenciales | No permite correo/Gemini/remotos | Mocks obligatorios y prueba real opcional |
| Diferencias de versiones | Resultados no reproducibles | Capturar versiones y usar lockfiles/contenedores |
| Datos personales en evidencias | Riesgo de privacidad | Datos ficticios, anonimización y revisión final |
| Modificación accidental del producto | Invalida línea base | Estado Git, artefactos separados y no corregir antes de reportar |
| Dependencias externas inestables | Resultados variables | Mocks, timestamps, reintentos limitados y evidencia del proveedor |
| Pruebas destructivas | Pérdida de datos/servicio | Solo local/prueba; base desechable; no atacar producción |
| Alcance superior al tiempo disponible | Cobertura incompleta | Priorizar reproducibilidad, seguridad, regresión y casos altos |
| Requisitos contradictorios | Calificación injusta | Separar requisito académico, diseño real y comportamiento observado |
| Costos de API | Consumo no autorizado | Mock por defecto y prueba real mínima autorizada |

## 13. Priorización si el tiempo es limitado

Orden de corte recomendado:

1. Línea base, reproducibilidad y secretos.
2. Tests existentes.
3. HU-01, HU-05 y HU-06.
4. Autenticación/autorización y casos de prioridad alta.
5. Clasificador y Gemini mock.
6. Base de datos e integraciones críticas.
7. Casos de prioridad media.
8. Casos de prioridad baja.
9. Calidad, accesibilidad y rendimiento complementario.

Reducir alcance no autoriza marcar como aprobadas las pruebas no ejecutadas; deben quedar `NOT RUN` o `BLOCKED`.

## 14. Entregables y criterios de aceptación

### 14.1 `REVISION_TECNICA_PMM.md`

Debe incluir:

- resumen ejecutivo;
- alcance y limitaciones;
- arquitectura real;
- diferencias documento/software;
- hallazgos priorizados;
- análisis de seguridad, datos, BD, IA y calidad;
- regresión HU-01/HU-05/HU-06;
- concepto técnico final A/B/C/D.

### 14.2 `RESULTADOS_PRUEBAS_PMM.md`

Debe incluir:

- entorno y línea base;
- inventario de pruebas;
- resultados detallados por caso;
- pruebas transversales;
- tabla exhaustiva 0–13 del clasificador;
- resultados de entradas inválidas;
- resumen PASS/FAIL/BLOCKED/NOT RUN;
- referencias a evidencias.

### 14.3 `evidencias_revision/`

Debe contener salidas de consola, JSON saneado, capturas, reportes, archivos exportados y consultas necesarias, sin secretos ni PII innecesaria.

### 14.4 `auditoria_tests/`

Debe contener solo pruebas, mocks, fixtures y utilidades de auditoría claramente separadas del producto, junto con instrucciones reproducibles.

### 14.5 Aceptación global del trabajo

El trabajo se considera concluido cuando:

1. todas las pruebas planificadas tienen un estado explícito;
2. los 15 casos aparecen en la matriz de cobertura;
3. las afirmaciones académicas obligatorias están contrastadas;
4. los hallazgos tienen evidencia y severidad;
5. los bloqueos explican su causa y el dato requerido para resolverlos;
6. se ha realizado una revisión de PII/secretos;
7. el concepto final está sustentado por los resultados.

## 15. Formato de hallazgo

```markdown
### H-<NNN> — <título breve>

- Severidad:
- Caso de uso:
- Afirmación académica relacionada:
- Componentes afectados:
- Precondiciones:
- Prueba realizada:
- Resultado esperado:
- Resultado obtenido:
- Evidencia:
- Impacto:
- Recomendación:
- Contradice el trabajo de grado: Sí / No / No verificable
```

## 16. Formato de prueba

```markdown
### T-CU03-04 — Puntaje límite 7 asigna Chunin

- Caso de uso: CU-03 / HU-03
- Tipo: Integración
- Prioridad: Alta
- Precondiciones:
  - Usuario estudiante autenticado.
  - Diagnóstico disponible.
- Datos:
  - 7 respuestas correctas.
- Pasos:
  1. ...
  2. ...
- Resultado esperado:
  - Puntaje = 7.
  - Nivel = Chunin.
  - Ruta correspondiente habilitada.
- Resultado obtenido:
  - Pendiente de ejecución.
- Estado: NOT RUN
- Evidencia:
  - Pendiente.
- Archivos de código relacionados:
  - Pendiente de trazado.
- Observaciones:
  - Ninguna antes de la ejecución.
```

## 17. Reglas para el concepto final

- **A. Conforme:** los 15 casos cumplen sus criterios esenciales y no hay hallazgos altos o críticos pendientes.
- **B. Conforme con observaciones:** se cumple el objetivo funcional con defectos medios/bajos o discrepancias documentales no impeditivas.
- **C. Parcialmente conforme:** algún caso prioritario incumple, faltan pruebas esenciales o hay inconsistencias importantes.
- **D. No conforme:** existen fallos críticos, funciones esenciales ausentes, problemas graves de seguridad/integridad o falta de reproducibilidad sustancial.

Un bloqueo relevante puede impedir emitir A o B si deja sin comprobar una función esencial. La decisión deberá explicar el peso de cada limitación.

## 18. Lista de control de inicio

- [ ] Commit y rama registrados.
- [ ] Árbol de trabajo preservado.
- [ ] Documento académico exacto disponible.
- [ ] Versiones de herramientas registradas.
- [ ] Variables de entorno inventariadas sin valores secretos.
- [ ] Base de datos local/de prueba disponible.
- [ ] Cuentas ficticias de estudiante/docente disponibles.
- [ ] Política de evidencias y PII aplicada.
- [ ] Inventario de pruebas creado.
- [ ] Mocks de Gemini/correo previstos.
- [ ] Prohibición de pruebas destructivas sobre producción confirmada.

## 19. Lista de control de cierre

- [ ] Todas las pruebas tienen estado explícito.
- [ ] Los 15 casos están cubiertos o justificados.
- [ ] HU-01, HU-05 y HU-06 tienen dictamen de regresión.
- [ ] Se verificaron 5 suites/22 pruebas o se refutó la afirmación.
- [ ] Se ejecutó la tabla del clasificador 0–13.
- [ ] Se revisó el payload de Gemini y la ausencia de PII.
- [ ] Se completaron matrices de permisos, cobertura y trazabilidad.
- [ ] Se contrastaron 21 módulos, 210 ejercicios, distribución 40/90/80 y 17 tablas.
- [ ] Todas las evidencias están saneadas.
- [ ] Los hallazgos incluyen severidad y recomendación.
- [ ] El concepto final deriva de evidencia verificable.

---

Este plan organiza la auditoría; no constituye por sí mismo evidencia de que una funcionalidad haya sido probada o aprobada.
