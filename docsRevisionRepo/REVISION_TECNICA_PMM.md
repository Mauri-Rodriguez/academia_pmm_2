# Revisión técnica — PMM Interactivo

## Seguimiento posterior al concepto docente — 15 de noviembre de 2026

El dictamen original se conserva como evidencia histórica. Después del concepto docente del 14 de noviembre se incorporó una batería versionada de regresión de seguridad:

- batería Jest original: 5 suites / 22 pruebas;
- ampliación de seguridad: 5 suites / 22 pruebas;
- total de la primera ampliación: 10 suites / 44 pruebas aprobadas;
- revisión de dominios del 21-11-2026: 6 casos adicionales, total local de 10 suites / 50 pruebas aprobadas;
- Python: 36 casos funcionales + 5 de seguridad = 41/41;
- Auditoría de producción repetida el 21-11-2026: 3 moderadas en backend, 2 bajas en frontend, 0 altas y 0 críticas. Los lockfiles conservaron sus hashes.

La ampliación cubre recuperación y reset, payload/expiración JWT, variables productivas, sanitización de logs, CORS, rate limit, firma/recodificación de uploads y credencial interna Flask. Los resultados por categoría y sus suites se registran en el [inventario de pruebas](matrices/inventario_pruebas.md).

El JWT en `localStorage` permanece como riesgo aceptado para el cierre académico. Las cinco ramas públicas de Git se reescribieron el 21-11-2026 a partir del espejo verificado. Queda gestionar la limpieza de las referencias internas de GitHub y completar el reclonado del equipo. [Acta de saneamiento](evidencias_revision/08_cierre/README.md#saneamiento-de-historial-git-rc-01)

## 1. Resumen ejecutivo

Se ejecutó una auditoría técnica y funcional alineada con `PLAN_TRABAJO_AUDITORIA_TECNICA_PMM.md` y la monografía final (entrega 13–14 octubre 2026). El producto reproduce la arquitectura declarada (Vercel + Railway + MySQL + Flask + Gemini), cumple los criterios esenciales de los 15 casos de uso en el alcance verificado, y las regresiones prioritarias HU-01 / HU-05 / HU-06 quedaron cerradas o alineadas con limitaciones documentadas.

**Concepto técnico final: A — Conforme.**

Los 15 casos cumplen criterios esenciales en el alcance auditado originalmente. Los hallazgos altos H-001 y H-002 quedaron tratados en ese cierre. El seguimiento del 14 de noviembre mantiene abierto RC-01, sobre datos personales en el historial Git.

- **H-001** cerrado en producción (2026-10-27): tras ~10 fallos de login → HTTP **429** con `Retry-After`.
- **H-002** sin high/critical en el cierre original tras retirar `nodemailer` (no usado; correo vía Resend). En esa revisión quedaron **10 moderate** en backend y **2 low** en frontend. La repetición del 21-11-2026 confirmó cero avisos altos o críticos en producción y registró los avisos residuales.

No se emite **C/D**: no hay incumplimiento esencial ni fallo crítico de reproducibilidad del despliegue oficial.

## 2. Alcance y limitaciones

### Incluido

- Línea base del repositorio, reproducibilidad local, seguridad estática/dinámica básica.
- Pruebas Jest del backend al cierre original: 5 suites / **22** casos. Seguimiento posterior: 10 suites / 44 casos.
- Auditoría funcional CU/HU-01 a CU/HU-15 (contraste monografía ↔ código ↔ evidencia dinámica).
- Clasificador Flask (matriz 0–13 y bordes F-CLA-400) y Gemini (mocks + prueba real limitada en producción).
- BD/schema, calidad (build, ESLint **0**, audit), accesibilidad corregida en formularios/módulos/AscensoModal, latencias locales.
- Despliegue oficial `academia-pmm-2.vercel.app` + `academiapmm2-production.up.railway.app`, con flujo autenticado Genin y docente; smoke post-deploy de rate limit.

### Limitaciones

- GitHub conservaba 57 referencias internas de pull requests al historial original tras la reescritura de las ramas públicas. La limpieza de esas referencias y vistas en caché requiere seguimiento con GitHub.
- Prueba semántica agresiva de prompt injection contra Gemini real: omitida / parcial.
- Matriz completa de teclado en navegador real: inspección de código + correcciones; sin capturas formales de todos los viewports en vivo.
- Front alterno `academia-pmm.vercel.app` sigue apuntando a un Railway inexistente (fuera del despliegue oficial).
- Evidencias detalladas de consola se consolidan en `PLAN_EJECUCION_AUDITORIA_PMM.md`; esta carpeta no duplica secretos ni capturas con PII.

## 3. Línea base

| Campo | Valor |
|---|---|
| Rama de trabajo auditoría | `implementacion26102026` (correcciones mergeadas vía PR a develop/main) |
| Monografía | Consultada como base de trazabilidad. Archivo local de referencia (no versionado por datos sensibles): entrega 13–14 octubre 2026. SHA-256: `E74F94FBB2A3A7D8A74E22A77718C11BF8BE0D75F996346D814BC87DB812D927`. Ver `evidencias_revision/00_linea_base/`. |
| Frontend oficial | `https://academia-pmm-2.vercel.app` |
| Backend oficial | `https://academiapmm2-production.up.railway.app` |
| Plan rector | `PLAN_TRABAJO_AUDITORIA_TECNICA_PMM.md` |
| Bitácora operativa (anexo) | `PLAN_EJECUCION_AUDITORIA_PMM.md` |

## 4. Arquitectura real observada

```text
Navegador → Vercel (React/Vite)
         → Railway Node/Express (JWT, roles, CORS, rate limit auth)
         → MySQL (Railway)
         → Flask/scikit-learn (clasificador de diagnóstico)
         → Gemini (tutor)
         → Resend (correo, con modo simulacro local)
```

Coincide con lo declarado en la monografía. El fallback del clasificador en Node (0–6 / 7–10 / 11–13) respalda a Flask.

## 5. Diferencias documento / software

| Tema | Monografía | Software | Dictamen |
|---|---|---|---|
| Dominio institucional en registro | CA-01.1 parcial: restricción retirada por anti-phishing | Acepta correo con formato válido; rol docente por `DOMINIOS_DOCENTES` | Alineado con limitación documentada |
| Etiqueta correcto/incorrecto (HU-05) | Parcial en pruebas de aceptación originales | Corregido: mensaje textual + `aria-live` | Fue corregido |
| Referencia explícita al nivel en respuesta Gemini (HU-06) | Parcial CA-06.2 | Prompt incluye nivel; salida del modelo no garantizada | Cumple con limitación de proveedor |
| Nombre de nivel “BÁSICO” | Aparece en evidencias antiguas | Código usa `Genin (Iniciado)` | Cosmético / nomenclatura ninja |
| Suite Jest original “22 pruebas” | 5 suites / 22 pruebas | **22** casos originales aprobados; después se añadieron 5 suites/22 casos de seguridad, total 10/44 | Alineado tras actualización documental posterior |

## 6. Regresión HU-01, HU-05 y HU-06

| Historia | Dictamen | Notas |
|---|---|---|
| HU-01 | Cumple según monografía | CA-01.1 permanece parcial documentado |
| HU-05 | Fue corregido | Feedback textual accesible verificado |
| HU-06 | Cumple con limitación | Mocks + tutor real en producción (orientación sin spoiler) |

## 7. Seguridad, datos, BD, IA y calidad

### Seguridad

- JWT + roles en rutas privadas; IDOR básico de foro/notificaciones verificado.
- Validaciones endurecidas: auth, recuperación, foro, firmas de imagen, tutor, reporte docente solo sobre estudiantes.
- **H-001 cerrado en producción:** rate limit en login/Google/registro/forgot/reset; smoke remoto **429**.
- **H-002:** en el cierre original se documentaron 10 moderate backend y 2 low frontend. `npm audit --omit=dev` confirmó el 21-11-2026 tres moderadas en backend y dos bajas en frontend, con cero altas o críticas.
- Token en `localStorage` (riesgo condicionado a XSS; observación habitual SPA).
- Los dos objetos con datos personales quedaron fuera de las ramas públicas reescritas. Las referencias internas de pull requests siguen en seguimiento.

### Base de datos

- 17 tablas, 21 módulos, 210 ejercicios, 13 preguntas, 24 insignias, 16 recursos confirmados.
- El modelo Sequelize de `Usuario` declara `rango` con el tipo, la nulabilidad y el valor por defecto del esquema existente.
- Foro/biblioteca/notificaciones sin modelo ORM (SQL parametrizado).

### IA

- Clasificador: dominio entero 0–13 validado (F-CLA-400); inválidos → 400; `test_clasificador.py` alineado.
- Gemini: sin PII en payload; timeout y validación de mensaje; operativo en Railway.

### Calidad / accesibilidad

- Build producción OK; bundle JS grande (~4,7–4,8 MB) — observación de peso, no bloquea CU.
- ESLint frontend: **0** errores (tras limpieza y config anti-falso-positivo JSX/`motion`).
- Accesibilidad: `htmlFor`/`id` en login, registro y recuperación. Los módulos admiten teclado. El modal de ascenso enfoca su botón al abrir, mantiene el foco con `Tab` y `Mayús+Tab` y devuelve el foco al cerrar cuando el control anterior sigue disponible.

## 8. Hallazgos — estado al cierre

| ID | Severidad al cierre | Título | Estado |
|---|---|---|---|
| H-001 | Alta → **cerrado** | Rate limit autenticación | Cerrado en prod (429 verificado) |
| H-002 | Alta → **cerrado como alto**; residual histórico aceptado | npm audit | Revisión original: 10 moderate BE + 2 low FE; revisión 21-11-2026: 3 moderadas BE, 2 bajas FE, 0 altas o críticas |
| H-003 | Media → **cerrado** | Historial de fallos al evaluar | Unificado: `evaluarEjercicio` registra error |
| H-004 | Baja (abierta) | Front alterno Vercel → Railway muerto | Fuera del despliegue oficial; observación |
| H-005 | Baja → **cerrado** | Labels / teclado módulos | Corregido en frontend |
| H-006 | Baja → **cerrado** (ESLint); obs. bundle | ESLint / peso JS | ESLint 0; bundle sigue pesado (obs.) |
| H-007 | Observación | IDs hardcodeados en herencia diagnóstico | Deuda menor; no alta |

**Seguimiento abierto: RC-01, datos personales en el historial Git.** El concepto A de la sección siguiente corresponde al cierre original de la bitácora.

## 9. Concepto técnico final

### **A — Conforme**

**Justificación:**

1. Los 15 casos de uso cumplen criterios esenciales en el alcance verificado (local y/o producción oficial).
2. HU-01/05/06 tienen dictamen de regresión explícito.
3. Reproducibilidad y despliegue oficial operativos; H-001 con **429** en Railway; H-002 sin high/critical.
4. Los avisos residuales de uuid y KaTeX, el Vercel alterno y el peso del bundle quedaron como observaciones del cierre original.
