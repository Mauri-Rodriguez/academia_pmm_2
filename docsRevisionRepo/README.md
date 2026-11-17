# Entregables de la auditoría técnica — PMM Interactivo

Estructura alineada al plan del profesor (`PLAN_TRABAJO_AUDITORIA_TECNICA_PMM.md`).  
**Concepto técnico final: A — Conforme** (detalle en `REVISION_TECNICA_PMM.md`).

```text
docsRevisionRepo/
├── README.md
├── REVISION_TECNICA_PMM.md
├── RESULTADOS_PRUEBAS_PMM.md
├── matrices/
│   ├── inventario_pruebas.md
│   ├── matriz_cobertura.md
│   ├── matriz_permisos.md
│   └── trazabilidad_documento_software.md
└── evidencias_revision/
    ├── 00_linea_base/
    └── 08_cierre/
```

## Documentos relacionados en la raíz del repositorio

| Archivo | Rol | ¿Versionado? |
|---|---|---|
| `PLAN_TRABAJO_AUDITORIA_TECNICA_PMM.md` | Plan rector del profesor | Sí |
| `PLAN_EJECUCION_AUDITORIA_PMM.md` | Bitácora operativa del equipo (etapas, smokes, registro) | Sí — **anexo**; no sustituye REVISION/RESULTADOS |
| Monografía final `.docx` | Base académica de trazabilidad | **No** (ver abajo) |

## Monografía — consultada, no versionada

La auditoría **sí tomó como base** la monografía final:

- Nombre de referencia: `TRABAJO-DE-GRADO - Duran, Rodriguez, Valencia. docx - Entrega 13-14 octubre.docx`
- SHA-256 registrado en la bitácora: `E74F94FBB2A3A7D8A74E22A77718C11BF8BE0D75F996346D814BC87DB812D927`
- Versión actualizada tras concepto docente (no versionada): `TRABAJO-DE-GRADO - Duran, Rodriguez, Valencia - Actualizada 15 noviembre 2026.docx`
- SHA-256 de la versión actualizada: `20161D03C71A52A91A59D5D5DCEDE1589CA786DDB8010069FE22FBC8AA74E146`

**No se incluye en el repositorio** porque es un documento con datos sensibles / personales y no forma parte de los entregables técnicos exigidos en la sección 14 del plan del profesor. La trazabilidad monografía → software → prueba queda en `matrices/trazabilidad_documento_software.md` y en la revisión técnica, sin adjuntar el Word.

## Contenido de este paquete

- Dictamen formal y concepto: `REVISION_TECNICA_PMM.md`
- Resultados de pruebas: `RESULTADOS_PRUEBAS_PMM.md`
- Registro de riesgos: `REGISTRO_RIESGOS_RESIDUALES_2026-11-15.md`
- Regresión de seguridad: `matrices/matriz_regresion_seguridad_post_auditoria.md`
- Matrices: cobertura, permisos, trazabilidad, inventario
- Evidencias: índices en `evidencias_revision/` (sin secretos, tokens ni PII)

Las decisiones y riesgos residuales se consolidan en los documentos anteriores
y en el registro fechado del 15 de noviembre de 2026:

- JWT en `localStorage`: se mantiene para esta entrega con vigencia de dos horas,
  payload mínimo, cierre de sesión ante `401`, CSP y headers defensivos. La
  migración a cookies `HttpOnly`, `Secure` y `SameSite` queda como mejora futura.
- Dependencias npm: el riesgo moderado/bajo histórico fue aceptado temporalmente
  por concepto docente. La revisión `npm audit --omit=dev` del 15-11-2026 reportó
  cero advisories en backend y frontend sin modificar lockfiles. Se mantiene
  vigilancia y no se usa `npm audit fix --force`.
- Pruebas posteriores a la auditoría: se preservan 5 suites/22 casos originales
  y se añaden 5 suites/22 casos de seguridad; resultado total Jest 10/44. El
  clasificador conserva 36 casos funcionales y añade 5 de seguridad (41/41).

No incluir contraseñas, tokens ni capturas con datos personales en esta carpeta.

## CI y protección de ramas

El workflow `.github/workflows/test.yml` ejecuta backend, frontend y Python (`npm ci`, Node 22, Python 3.13) y publica artefactos por commit (Jest JSON, `dist`, salida del clasificador).
Para **bloquear integración** hace falta configurar en GitHub: *Settings → Branches → Branch protection → Require status checks to pass* (jobs `backend`, `frontend`, `python-ia`). El YAML solo no activa ese bloqueo.
