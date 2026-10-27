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

**No se incluye en el repositorio** porque es un documento con datos sensibles / personales y no forma parte de los entregables técnicos exigidos en la sección 14 del plan del profesor. La trazabilidad monografía → software → prueba queda en `matrices/trazabilidad_documento_software.md` y en la revisión técnica, sin adjuntar el Word.

## Contenido de este paquete

- Dictamen formal y concepto: `REVISION_TECNICA_PMM.md`
- Resultados de pruebas: `RESULTADOS_PRUEBAS_PMM.md`
- Matrices: cobertura, permisos, trazabilidad, inventario
- Evidencias: índices en `evidencias_revision/` (sin secretos, tokens ni PII)

No incluir contraseñas, tokens ni capturas con datos personales en esta carpeta.
