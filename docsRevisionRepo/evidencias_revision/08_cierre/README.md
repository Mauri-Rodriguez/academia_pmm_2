# Evidencias — 08 cierre

## Concepto

**A — Conforme** (regla del profesor: 15 CU esenciales + sin hallazgos altos/críticos pendientes).

## Cierres verificados relevantes

| Ítem | Evidencia resumida |
|---|---|
| H-001 rate limit | Prod Railway 2026-10-27: fallos de login → serie 401 y luego **429** + `Retry-After` |
| H-002 deps high | Eliminado `nodemailer` no usado; `npm audit` BE sin high/critical; residual moderate `uuid` / low FE `katex` |
| Clasificador F-CLA-400 | Inválidos/fuera de rango → 400; `test_clasificador.py` alineado |

## Seguimiento posterior — 15 de noviembre de 2026

- Jest: 5 suites/22 casos originales + 5 suites/22 casos de seguridad = 10 suites/44 casos aprobados.
- Python: 36 casos funcionales + 5 de seguridad = 41/41.
- `npm audit --omit=dev`: cero vulnerabilidades reportadas en backend y frontend.
- El registro de riesgos conserva la decisión docente y la fecha de próxima revisión.
| ESLint FE | 0 errores |
| Código muerto | Retirado tras contraste FE↔BE |
| HU-11 historial | Registro unificado al evaluar ejercicio |

Detalle narrativo: `REVISION_TECNICA_PMM.md`, `RESULTADOS_PRUEBAS_PMM.md` y registro en `PLAN_EJECUCION_AUDITORIA_PMM.md`.
