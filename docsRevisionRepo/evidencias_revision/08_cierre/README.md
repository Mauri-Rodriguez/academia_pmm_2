# Evidencias — 08 cierre

## Concepto

**A — Conforme** en la bitácora de cierre original. El seguimiento de RC-01 registra la reescritura de las ramas públicas y la limpieza de referencias internas de GitHub aún pendiente.

## Cierres verificados relevantes

| Ítem | Evidencia resumida |
|---|---|
| H-001 rate limit | Prod Railway 2026-10-27: fallos de login → serie 401 y luego **429** + `Retry-After` |
| H-002 deps high | Eliminado `nodemailer` no usado; `npm audit` BE sin high/critical; residual moderate `uuid` / low FE `katex` |
| Clasificador F-CLA-400 | Inválidos/fuera de rango → 400; `test_clasificador.py` alineado |

## Seguimiento posterior — 15 al 21 de noviembre de 2026

- Jest: 5 suites/22 casos originales + 5 suites/22 casos de seguridad = 10 suites/44 casos aprobados.
- Revisión de registro del 21 de noviembre: 6 casos adicionales, total de 50/50 en 10 suites. La configuración efectiva de `DOMINIOS_DOCENTES` en Railway queda por verificar antes del despliegue.
- Python: 36 casos funcionales + 5 de seguridad = 41/41.
- Auditoría de producción repetida el 21-11-2026: 3 moderadas en backend, 2 bajas en frontend, 0 altas y 0 críticas. Ver [resultados](../../RESULTADOS_PRUEBAS_PMM.md).
- La fecha de próxima revisión del riesgo de dependencias queda por definir por el equipo.
- ESLint del frontend aprobado con cero errores. Se retiró código muerto y se unificó el registro del historial al evaluar ejercicios (HU-11).

Detalle narrativo: `REVISION_TECNICA_PMM.md`, `RESULTADOS_PRUEBAS_PMM.md` y registro en `PLAN_EJECUCION_AUDITORIA_PMM.md`.

## Saneamiento de historial Git (RC-01)

- El 21 de noviembre se verificaron los respaldos privados con `git bundle verify` y SHA-256. El alcance se amplió de dos a tres rutas al confirmarse que una de ellas guardaba la misma fotografía con un segundo nombre.
- `git-filter-repo` retiró las tres rutas y los dos objetos asociados. El espejo aprobó `git fsck` y la comparación de los árboles de las cinco ramas preservó los demás archivos. Se inventariaron cero etiquetas y 57 pull requests afectados.
- GitHub aceptó el reemplazo atómico de las cinco ramas. La verificación posterior confirmó los nuevos commits, incluidos `42825bd` para `develop` y `d5f35db` para `main`. Queda dar seguimiento a las referencias internas de GitHub, al reclonado de los integrantes y al Apéndice I.
- Un clon nuevo de GitHub aprobado por `git fsck` presentó cero coincidencias con las tres rutas y los dos objetos originales. GitHub aún anunciaba las 57 referencias internas antiguas de pull requests. [Procedimiento de limpieza de GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository#fully-removing-the-data-from-github)

Correspondencias para las referencias académicas afectadas. Los enlaces a ejecuciones históricas de CI conservan el identificador de su ejecución original.

| Referencia | Commit anterior | Commit saneado |
| --- | --- | --- |
| Línea base de la revisión del 6 de noviembre | `ae9bf1e` | `dd6bd5b` |
| Ajustes de fases 1 y 2 | `97a0bfb` | `8abaf37` |
| Integración en `develop` | `5f1eb66` | `42825bd` |
| Integración en `main` | `00b80ee` | `d5f35db` |
