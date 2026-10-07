# Pruebas de aceptación — PMM Interactivo

## 1. Objetivo

Este documento consolida las pruebas de aceptación funcional realizadas sobre **PMM Interactivo**, con el propósito de verificar el cumplimiento de los criterios de aceptación definidos para las historias de usuario de la plataforma.

Las pruebas corresponden a una **validación funcional realizada por el equipo de desarrollo** y no a una evaluación con usuarios finales. La evaluación de usabilidad con usuarios reales se aborda de manera independiente en la sección correspondiente de la monografía.

Las pruebas de aceptación documentadas corresponden a **15 historias de usuario y 32 criterios de aceptación**.

---

## 2. Resumen de resultados

| Resultado | Cantidad |
|---|---:|
| Historias de usuario evaluadas | 15 |
| Historias aprobadas | 13 |
| Historias parcialmente aprobadas | 2 |
| Criterios de aceptación evaluados | 32 |
| Criterios que cumplen | 30 |
| Criterios parcialmente cumplidos | 2 |
| Criterios no cumplidos | 0 |
| Criterios parcialmente cumplidos | CA-05.1 y CA-06.2 |
| Historias parcialmente aprobadas | HU-05 y HU-06 |
| Evidencias referenciadas | Ev. 1–31 |

### Historias parcialmente aprobadas

Las dos historias que no alcanzaron el cumplimiento completo fueron:

- **HU-05 — Ejercicios y retroalimentación**
  - **CA-05.1:** la plataforma diferencia el flujo de respuesta correcta e incorrecta, pero no presenta una etiqueta textual explícita que indique "correcto" o "incorrecto".
- **HU-06 — Retroalimentación mediante IA**
  - **CA-06.2:** el contexto del ejercicio se muestra, pero la respuesta del tutor virtual no hace referencia explícita al nivel del estudiante.

Las mejoras identificadas se conservan como parte de los resultados de la prueba y no se consideran criterios fallidos, sino criterios **parcialmente cumplidos**.

---

## 3. Matriz de pruebas de aceptación

### CA-01 — HU-01: Registro e inicio de sesión

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-01.1 | Validar el formato del correo institucional. | Se registró un correo de Outlook UNIAJC y la plataforma permitió continuar, mostrando "¡Registro exitoso! Revisa tu correo de activación." | Cumple | Ev. 1 | Sin incidentes ni correcciones registradas. |
| CA-01.2 | Impedir el registro de un correo ya asociado. | Al repetir el registro, la plataforma mostró "El correo ya está registrado en la aldea.", evitando la cuenta duplicada. | Cumple | Ev. 2 | Sin incidentes ni correcciones registradas. |
| CA-01.3 | Tras autenticarse, el usuario debe acceder a las funcionalidades protegidas. | Después del inicio de sesión se accedió a la evaluación diagnóstica y luego al panel del estudiante. | Cumple | Ev. 3 | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-02 — HU-02: Recuperación de contraseña

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-02.1 | Enviar un enlace de recuperación al correo registrado. | Se recibió el correo "Recuperación de acceso a PMM Interactivo" con la opción "Restablecer Contraseña". | Cumple | Ev. 4 | Sin incidentes ni correcciones registradas. |
| CA-02.2 | Permitir establecer una nueva contraseña mediante el enlace. | Tras establecer la nueva contraseña, la plataforma mostró "¡Contraseña actualizada! Sello restaurado exitosamente." | Cumple | Ev. 5 | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-03 — HU-03: Evaluación diagnóstica

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-03.1 | La evaluación debe contener 13 preguntas. | Se completó una evaluación de 13 preguntas de selección múltiple. | Cumple | Ev. 6–7 | Sin incidentes ni correcciones registradas. |
| CA-03.2 | Calcular el puntaje y asignar el nivel correspondiente al resultado. | Resultado de 3 aciertos de 13 (23 % de efectividad) y nivel BÁSICO asignado. | Cumple | Ev. 8 | Sin incidentes ni correcciones registradas. |
| CA-03.3 | Impedir la repetición inmediata de la evaluación. | Al regresar al panel tras revisar el diagnóstico, no se presentó una opción para iniciar de nuevo la evaluación. | Cumple | Ev. 9 | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-04 — HU-04: Asignación de módulos

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-04.1 | El panel debe mostrar los módulos correspondientes al nivel obtenido. | Se visualizó el nivel Básico y los módulos Álgebra Básica, Ecuaciones de Primer Grado, Sistemas de Ecuaciones y Geometría Analítica. | Cumple | Ev. 10 | Sin incidentes ni correcciones registradas. |
| CA-04.2 | Los módulos posteriores deben permanecer bloqueados hasta completar el módulo anterior. | Los módulos posteriores aparecieron bloqueados con el mensaje "COMPLETA EL MÓDULO ANTERIOR". | Cumple | Ev. 11 | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-05 — HU-05: Ejercicios y retroalimentación

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-05.1 | Indicar si la respuesta proporcionada es correcta o incorrecta. | La plataforma diferencia el flujo: ante una respuesta correcta continúa con el siguiente ejercicio y ante una incorrecta presenta orientación, pero no muestra una etiqueta explícita de "correcto" o "incorrecto". | Parcial | Ev. 12 | La interfaz no presenta una etiqueta textual explícita para indicar respuestas correctas o incorrectas. **Mejora identificada:** agregar una etiqueta textual explícita de respuesta correcta/incorrecta. |
| CA-05.2 | Ante una respuesta incorrecta, dar orientación o explicación relacionada con el ejercicio. | Se presentó la sección "Oportunidad de aprendizaje" con una explicación sobre términos semejantes y orientación para continuar. | Cumple | Ev. 13 | Sin incidentes ni correcciones registradas. |

**Resultado general:** Parcialmente aprobada.

---

### CA-06 — HU-06: Retroalimentación mediante IA

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-06.1 | El tutor virtual debe orientar ante las preguntas o errores del estudiante. | El tutor virtual explicó el producto de binomios mediante la propiedad distributiva. | Cumple | Ev. 14 | Sin errores en la respuesta generada; el nivel del estudiante no pudo comprobarse visualmente. **Mejora identificada:** incluir en la respuesta la referencia explícita al nivel del estudiante. |
| CA-06.2 | La respuesta debe considerar el nivel del estudiante y el contexto del ejercicio. | Se mostró el contexto "Módulo: Álgebra Básica, Ejercicio 3 de 10", pero la respuesta no hizo referencia explícita al nivel del estudiante. | Parcial | Ev. 15 | Mejora identificada: hacer explícita en la respuesta la consideración del nivel del estudiante. |

**Resultado general:** Parcialmente aprobada.

---

### CA-07 — HU-07: Visualización del progreso

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-07.1 | Mostrar el progreso global y el progreso por módulo. | Se visualizó un progreso global de 0 / 4 módulos y el porcentaje de avance del módulo. | Cumple | Ev. 16–17 | Sin incidentes ni correcciones registradas. |
| CA-07.2 | El progreso debe actualizarse después de completar actividades. | Tras completar una actividad, el progreso global pasó de 0 / 4 a 1 / 4 módulos. | Cumple | No se asigna evidencia adicional en la Tabla 19. | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-08 — HU-08: Guías y materiales

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-08.1 | Los módulos deben disponer de acceso visible a materiales. | Se visualizó la Biblioteca de Aprendizaje con recursos disponibles y opciones como "VER VIDEO". | Cumple | Ev. 18–19 | Sin incidentes ni correcciones registradas. |
| CA-08.2 | El recurso debe corresponder al contenido del módulo. | El recurso "Fundamentos del Álgebra" presentó contenido del módulo Álgebra Básica, incluida factorización. | Cumple | No se asigna evidencia adicional en la Tabla 19. | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-09 — HU-09: Seguimiento docente

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-09.1 | Mostrar información de los estudiantes y su progreso. | El panel mostró identificación, rango, progreso académico y estado de actividad de los estudiantes. | Cumple | Ev. 20–21 | Sin incidentes ni correcciones registradas. |
| CA-09.2 | La información debe estar organizada para facilitar su consulta. | Al aplicar el filtro "Genin (Iniciado)", se filtraron los registros y se mostró el estudiante correspondiente. | Cumple | No se asigna evidencia adicional en la Tabla 19. | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-10 — HU-10: Reporte individual

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-10.1 | Permitir acceder al historial individual del estudiante. | "VER EXPEDIENTE" mostró los datos del estudiante, el resultado diagnóstico y el progreso. | Cumple | Ev. 22 | Sin incidentes ni correcciones registradas. |
| CA-10.2 | El reporte debe mostrar el desempeño por módulo. | Se visualizó el desempeño por módulo, incluido el porcentaje de Álgebra Básica, y el progreso global. | Cumple | No se asigna evidencia adicional en la Tabla 19. | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-11 — HU-11: Errores frecuentes

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-11.1 | Identificar los temas con mayor cantidad de errores. | Se identificaron como zonas de riesgo académico Ecuaciones de Primer Grado, Geometría Analítica y Álgebra Básica. | Cumple | Ev. 23 | Sin incidentes ni correcciones registradas. |
| CA-11.2 | Mostrar la cantidad de intentos fallidos. | Se visualizaron los intentos fallidos de cada tema identificado (valores observados: 2, 1 y 1). | Cumple | No se asigna evidencia adicional en la Tabla 19. | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-12 — HU-12: Búsqueda de estudiantes

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-12.1 | El campo de búsqueda debe permitir introducir un criterio. | Se ingresó el texto "Tay" en el campo de búsqueda. | Cumple | Ev. 24 | Sin incidentes ni correcciones registradas. |
| CA-12.2 | Los resultados deben filtrarse de acuerdo con el criterio introducido. | La plataforma mostró el registro del estudiante relacionado con el criterio introducido. | Cumple | No se asigna evidencia adicional en la Tabla 19. | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-13 — HU-13: Descarga de reportes

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-13.1 | Generar un reporte general. | Se generó el archivo de Excel "Reporte_PMM_21_9_2026.xlsx" con identificación, nombre, correo, rango, puntaje diagnóstico y progreso global. | Cumple | Ev. 25 | Sin incidentes ni correcciones registradas. |
| CA-13.2 | Permitir consultar información individual relevante. | Se visualizó el expediente individual con datos del estudiante, rango, puntaje diagnóstico, progreso global, desempeño por módulo y zonas de riesgo académico. | Cumple | Ev. 26 | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-14 — HU-14: Rangos e insignias

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-14.1 | Las insignias obtenidas deben aparecer en el perfil. | Sección "Insignias desbloqueadas" con 1/24 insignias y la insignia "Genio del Álgebra". | Cumple | Ev. 27–28 | Sin errores en la visualización de las insignias ni del rango actual. Sin correcciones registradas. |
| CA-14.2 | El rango debe actualizarse de acuerdo con las reglas de progresión. | El estudiante estaba en el rango Genin (1/4 módulos) y el siguiente era Chunin. Al completarse los 4 módulos el estudiante es ascendido a Chunin. | Cumple | Ev. 30 | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

### CA-15 — HU-15: Comunidad PMM y adjuntar imágenes

| Criterio | Resultado esperado | Resultado obtenido | Estado | Evidencia | Incidentes / correcciones |
|---|---|---|---|---|---|
| CA-15.1 | Permitir adjuntar imágenes en los formatos establecidos. | Se realizó una publicación en Comunidad PMM con una imagen adjunta de un ejercicio matemático. | Cumple | Ev. 29 | Sin incidentes ni correcciones registradas. |
| CA-15.2 | El autor debe recibir una notificación cuando otro usuario responda a su publicación. | Se recibió la notificación desde una segunda cuenta de prueba. | Cumple | Ev. 31 | Sin incidentes ni correcciones registradas. |

**Resultado general:** Aprobada.

---

## 4. Resultado consolidado

La ejecución de las pruebas de aceptación produjo los siguientes resultados:

- **15 historias de usuario evaluadas.**
- **32 criterios de aceptación evaluados.**
- **30 criterios cumplieron completamente** con el resultado esperado.
- **2 criterios cumplieron parcialmente:** CA-05.1 y CA-06.2.
- **0 criterios fueron clasificados como no cumplidos.**
- **13 historias fueron aprobadas.**
- **2 historias fueron parcialmente aprobadas:** HU-05 y HU-06.
- Se documentaron evidencias numeradas desde **Ev. 1 hasta Ev. 31**.

| Indicador | Resultado |
|---|---:|
| Historias evaluadas | 15 |
| Historias aprobadas | 13 |
| Historias parcialmente aprobadas | 2 |
| Historias no aprobadas | 0 |
| Criterios evaluados | 32 |
| Criterios cumplidos | 30 |
| Criterios parcialmente cumplidos | 2 |
| Criterios no cumplidos | 0 |

---

## 5. Criterios parcialmente cumplidos

### 5.1 CA-05.1 — Identificación explícita de respuestas correctas e incorrectas

**Situación encontrada:**

La plataforma diferencia funcionalmente los dos escenarios:

- cuando la respuesta es correcta, continúa con el siguiente ejercicio;
- cuando la respuesta es incorrecta, presenta orientación al estudiante.

Sin embargo, la interfaz no muestra una etiqueta textual explícita que indique que la respuesta fue **"correcta"** o **"incorrecta"**.

**Estado:** Parcial.

**Mejora identificada:**

Agregar una etiqueta textual explícita para indicar el resultado de la respuesta proporcionada por el estudiante.

---

### 5.2 CA-06.2 — Consideración explícita del nivel del estudiante en la respuesta del tutor virtual

**Situación encontrada:**

El tutor virtual mostró el contexto:

> "Módulo: Álgebra Básica, Ejercicio 3 de 10"

La respuesta explicó el producto de binomios mediante la propiedad distributiva. Sin embargo, la respuesta generada no hizo referencia explícita al nivel del estudiante.

**Estado:** Parcial.

**Mejora identificada:**

Incluir de manera explícita en la respuesta del tutor virtual una referencia al nivel del estudiante cuando dicho nivel forme parte del contexto utilizado para generar la orientación.

---

## 6. Evidencias

Las evidencias de las pruebas se identifican en la monografía mediante la nomenclatura **Ev. 1–31**.

La documentación original indica que las capturas de pantalla asociadas a los criterios de aceptación se encuentran consolidadas en el **Apéndice E — Evidencias de las pruebas de aceptación**, en el orden en que son referenciadas en la Tabla 19.

La correspondencia general de evidencias es:

| Evidencias | Criterios / funcionalidad |
|---|---|
| Ev. 1–3 | CA-01 — Registro e inicio de sesión |
| Ev. 4–5 | CA-02 — Recuperación de contraseña |
| Ev. 6–9 | CA-03 — Evaluación diagnóstica |
| Ev. 10–11 | CA-04 — Asignación de módulos |
| Ev. 12–13 | CA-05 — Ejercicios y retroalimentación |
| Ev. 14–15 | CA-06 — Retroalimentación mediante IA |
| Ev. 16–17 | CA-07 — Visualización del progreso |
| Ev. 18–19 | CA-08 — Guías y materiales |
| Ev. 20–21 | CA-09 — Seguimiento docente |
| Ev. 22 | CA-10 — Reporte individual |
| Ev. 23 | CA-11 — Errores frecuentes |
| Ev. 24 | CA-12 — Búsqueda de estudiantes |
| Ev. 25–26 | CA-13 — Descarga de reportes |
| Ev. 27–28 | CA-14.1 — Insignias |
| Ev. 29 | CA-15.1 — Publicación con imagen |
| Ev. 30 | CA-14.2 — Rango |
| Ev. 31 | CA-15.2 — Notificación |

> Nota: esta matriz conserva la asignación de evidencias indicada en la Tabla 19. Los criterios que no tienen una evidencia individual adicional asignada en dicha tabla no reciben una ruta o archivo inventado en este documento.

---

## 7. Conclusión

**13 de las 15 historias de usuario fueron aprobadas y 2 quedaron parcialmente aprobadas**, sin registrarse historias completamente rechazadas.


---

## 8. Relación con la monografía

Este documento corresponde a la evidencia documental de las **pruebas de aceptación descritas en la Tabla 19 de la monografía**.

La prueba de aceptación corresponde a una validación funcional realizada por el equipo de desarrollo. No debe confundirse con:

- las **pruebas unitarias**, que verifican componentes o comportamientos específicos del software;
- la **validación del clasificador de diagnóstico**;
- la **evaluación de las respuestas del tutor virtual**;
- la **inspección heurística de usabilidad**;
- la **prueba de usabilidad con usuarios reales mediante SUS**.

Cada una de estas evaluaciones constituye una actividad independiente dentro del proceso de validación de PMM Interactivo.
