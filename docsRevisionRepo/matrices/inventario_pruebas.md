# Inventario maestro de pruebas (resumen)

Identificadores alineados a la bitácora operativa (`PLAN_EJECUCION_AUDITORIA_PMM.md`, anexo). Dictámenes formales en `REVISION_TECNICA_PMM.md` / `RESULTADOS_PRUEBAS_PMM.md`. Monografía consultada, no versionada (ver `evidencias_revision/00_linea_base/`).

| ID | Descripción | Estado |
|---|---|---|
| T-LB-01 | Rama/commit/documentos | PASS |
| T-REP-01 | npm ci / Jest / Vite limpios | PASS |
| T-REP-02 | Flask + schema/seed MySQL | PASS |
| T-SEC-01 | Secretos/PII en árbol | PASS c/ residual historial |
| T-SEC-02 | Matriz permisos/IDOR | PASS |
| T-SEC-03 | Validaciones auth/foro/archivos | PASS |
| T-SEC-04 | Rate limit auth | PASS local + PASS prod 2026-10-27 (10×401 luego 429 + Retry-After) |
| T-JEST-01 | 5 suites / 13 casos (post-depuración) | PASS |
| T-HU01…15 | Casos de uso | Ver matriz_cobertura.md |
| T-CLA-01 | Enteros 0–13 | PASS |
| T-CLA-02 | Bordes/inválidos → 400 | PASS (post F-CLA-400) |
| T-GEM-01 | Mocks tutor | PASS |
| T-GEM-02 | Prod tutor Genin | PASS |
| T-BD-01 | Conteos seed/schema | PASS |
| T-ACC-01 | Labels/alt/teclado | PASS (correcciones aplicadas) |
| T-PERF-01 | Latencias locales | PASS |
| T-DEP-01 | Smoke oficial | PASS |
| T-DEP-02 | Flujo Genin prod | PASS |
| T-DEP-03 | Flujo docente prod | PASS |
| T-DEP-04 | Front alterno | NOT APPLICABLE al oficial / obsoleto |
