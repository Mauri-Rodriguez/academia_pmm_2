# Resultados de pruebas — PMM Interactivo

## 1. Entorno y línea base

| Ítem | Valor |
|---|---|
| Fecha consolidación | 2026-10-27 (actualizado post-deploy H-001/H-002) |
| Frontend oficial | `https://academia-pmm-2.vercel.app` |
| Backend oficial | `https://academiapmm2-production.up.railway.app` |
| Local backend | `http://127.0.0.1:3001` |
| Local Flask | `http://127.0.0.1:5000` |
| Cuentas | Ficticias `AUD-*` (sin contraseñas en este documento) |
| Bitácora detallada (anexo) | `PLAN_EJECUCION_AUDITORIA_PMM.md` |
| Monografía | Consultada; **no versionada** (sensible). Hash en `evidencias_revision/00_linea_base/` |
| Concepto | **A — Conforme** |

## 2. Resumen de estados

| Área | PASS | FAIL | BLOCKED | NOT RUN / parcial |
|---|---:|---:|---:|---:|
| Reproducibilidad / Jest | Sí (13 actuales) | 0 | 0 | Histórico “22” documentado |
| Seguridad dinámica básica | Sí (incl. rate limit prod) | 0 altos abiertos | — | — |
| CU/HU 01–15 | 15 esenciales | 0 | 0 | Capturas formales de evidencia visual limitadas |
| Clasificador 0–13 | Sí | 0 (dominio entero) | — | Bordes → 400 (F-CLA-400) |
| Gemini | Mocks + prod parcial | 0 | Semántica agresiva | — |
| Despliegue oficial | Sí | 0 | — | Front alterno fuera de alcance oficial |

## 3. Inventario resumido (por categoría)

| Prefijo | Área | Resultado global |
|---|---|---|
| T-LB | Línea base | PASS |
| T-REP | Reproducibilidad | PASS |
| T-SEC | Seguridad | PASS (H-001/H-002 altos cerrados; residual moderate/low) |
| T-JEST | Jest backend | PASS 13/13 (post-depuración) |
| T-HU01…T-HU15 | Historias | PASS / alineado a monografía |
| T-CLA | Clasificador | PASS dominio 0–13; inválidos → 400 |
| T-GEM | Gemini | PASS mocks; prod orientativo OK |
| T-BD | Base de datos | PASS con observaciones de modelos |
| T-ACC | Accesibilidad | PASS (correcciones aplicadas; sin capturas exhaustivas) |
| T-PERF | Rendimiento básico local | PASS (&lt;100 ms muestra) |
| T-DEP | Despliegue | PASS oficial; alterno obsoleto |

## 4. Resultados por caso de uso

| Caso | Funcional | Negativo | Autorización | Persistencia | Integración | Estado |
|---|---|---|---|---|---|---|
| CU-01 | PASS | PASS | PASS | PASS | PASS | PASS (CA-01.1 parcial doc.) |
| CU-02 | PASS | PASS | N/A | PASS | PASS | PASS |
| CU-03 | PASS | PASS (409) | PASS | PASS | PASS Flask/Node | PASS |
| CU-04 | PASS | PASS 403 | PASS | PASS | PASS | PASS |
| CU-05 | PASS | PASS | PASS | PASS | PASS | PASS (corregido feedback) |
| CU-06 | PASS | PASS validación | PASS | N/A | PASS Gemini | PASS c/ limitación |
| CU-07 | PASS | — | PASS | PASS | PASS | PASS |
| CU-08 | PASS | — | PASS | — | PASS | PASS |
| CU-09 | PASS | — | PASS | — | PASS | PASS |
| CU-10 | PASS | PASS 404/400 | PASS | — | PASS | PASS |
| CU-11 | PASS | — | PASS | — | Registro unificado en evaluar | PASS |
| CU-12 | PASS (filtro cliente) | — | PASS | — | PASS | PASS |
| CU-13 | PASS Excel | — | PASS | — | PASS | PASS |
| CU-14 | PASS | — | PASS | PASS | PASS | PASS |
| CU-15 | PASS | PASS validación | PASS | PASS | PASS | PASS |

## 5. Clasificador — tabla 0–13 y bordes

Ejecutado localmente tras F-CLA-400 (opción A). Dominio válido: entero 0–13. Script `test_clasificador.py` alineado (36/36).

| Puntaje | HTTP | nivel_id | Esperado | Estado |
|---:|---:|---:|---|---|
| 0–6 | 200 | 0 | Genin | PASS |
| 7–10 | 200 | 1 | Chunin | PASS |
| 11–13 | 200 | 2 | Jonin | PASS |
| -1, 14, 999 | 400 | — | Rechazo | PASS |
| null, cadena, objeto, sin campo, body vacío, decimal | 400 | — | Rechazo | PASS |

## 6. Despliegue — flujo autenticado (producción)

### Estudiante Genin (`AUD-EST-GENIN`)

- Login 200 → diagnóstico 4/13 → Genin → módulos Genin visibles.
- Incorrecta/correcta en módulo 1 → progreso **10%** (estado conservado a propósito).
- Módulo 2 y Chunin → 403.
- Tutor → 200 orientación.
- Repetir diagnóstico → 409.

### Docente (`AUD-DOCENTE`)

- Login 200, resumen 43 estudiantes, reporte Genin 200, Excel 200.
- Aislamiento: estudiante 403, self-id 404, inválido 400.

### Rate limit auth (H-001) — post-deploy 2026-10-27

- `POST /api/auth/login` con credenciales inválidas: serie de **401**, luego **429** con `Retry-After`.
- API raíz oficial responde **200**.

## 7. Pruebas transversales

| Prueba | Resultado |
|---|---|
| Jest backend | PASS 13/13 |
| Vite build | PASS |
| ESLint frontend | PASS 0 errores |
| npm audit BE | 0 high/critical; 3 moderate (`uuid`) |
| npm audit FE | 2 low (`katex`) |
| CORS oficial | PASS 204 |
| Rutas sin token | PASS 401 |
| Rate limit login prod | PASS 429 |

## 8. Evidencias

Las evidencias operativas (comandos, matrices HTTP, dictámenes) están en:

- `PLAN_EJECUCION_AUDITORIA_PMM.md` (registro de actualizaciones y etapas)
- `docsRevisionRepo/matrices/*`
- `docs/pruebas/pruebas_aceptacion.md` (aceptación académica previa del equipo)

No se adjuntan tokens, contraseñas ni capturas con datos personales.
