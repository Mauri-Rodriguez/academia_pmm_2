# ============================================================================
# test_app.py
# Pruebas del clasificador Flask
# ============================================================================

from app import app


# ============================================================================
# 1. Configuración del cliente de pruebas
# ============================================================================

client = app.test_client()


# ============================================================================
# 2. Encabezado
# ============================================================================

print("=" * 75)
print("PRUEBAS DEL CLASIFICADOR IA")
print("=" * 75)


# ============================================================================
# 3. Función auxiliar
# ============================================================================

def probar(puntaje, esperado_nivel, esperado_nombre, descripcion):
    response = client.post(
        "/api/ia/recomendar-ruta",
        json={"puntaje": puntaje}
    )

    datos = response.get_json()

    nivel = datos.get("nivel_id") if datos else None
    estado_http = response.status_code

    # El puntaje recibido debe conservar el valor original
    puntaje_recibido = (
        datos.get("puntaje_recibido")
        if datos
        else None
    )

    correcto = (
        estado_http == 200
        and nivel == esperado_nivel
        and puntaje_recibido == puntaje
        and datos.get("mensaje") == "Clasificación exitosa"
    )

    estado = "APROBADO" if correcto else "FALLIDO"

    print(
        f"{descripcion:<35} | "
        f"HTTP: {estado_http:<3} | "
        f"Nivel: {str(nivel):<5} | "
        f"Esperado: {esperado_nombre:<6} | "
        f"{estado}"
    )

    if not correcto:
        print(f"   Respuesta: {datos}")

    return correcto


# ============================================================================
# 4. PRUEBAS DE LOS 14 PUNTAJES VÁLIDOS
# ============================================================================

print("\n--- PUNTAJES VÁLIDOS 0-13 ---")

aprobadas = 0
totales = 0

for puntaje in range(14):

    if puntaje <= 6:
        esperado_nivel = 0
        esperado_nombre = "Genin"

    elif puntaje <= 10:
        esperado_nivel = 1
        esperado_nombre = "Chunin"

    else:
        esperado_nivel = 2
        esperado_nombre = "Jonin"

    if probar(
        puntaje,
        esperado_nivel,
        esperado_nombre,
        f"Puntaje {puntaje}"
    ):
        aprobadas += 1

    totales += 1


# ============================================================================
# 5. PRUEBAS DE DECIMALES
# ============================================================================

print("\n--- PUNTAJES DECIMALES ---")

casos_decimales = [
    (0.5, 0, "Genin"),
    (6.5, 0, "Genin"),
    (6.9, 0, "Genin"),
    (7.5, 1, "Chunin"),
    (9.5, 1, "Chunin"),
    (10.5, 2, "Jonin"),
    (12.5, 2, "Jonin"),
]

for puntaje, esperado_nivel, esperado_nombre in casos_decimales:

    if probar(
        puntaje,
        esperado_nivel,
        esperado_nombre,
        f"Decimal {puntaje}"
    ):
        aprobadas += 1

    totales += 1


# ============================================================================
# 6. PRUEBAS DE PUNTAJES MAYORES A 13
# ============================================================================
# teniendo en cuenta al file app.py:
#
# if puntaje_original > 13:
#     puntaje_validado = 0
#
# Por tanto, cualquier puntaje > 13 debe devolver Genin (0).
# ============================================================================

print("\n--- PUNTAJES MAYORES A 13 ---")

casos_mayores = [
    14,
    15,
    20,
    50,
    100,
    999,
]

for puntaje in casos_mayores:

    if probar(
        puntaje,
        0,
        "Genin",
        f"Fuera de rango {puntaje}"
    ):
        aprobadas += 1

    totales += 1


# ============================================================================
# 7. PRUEBAS DE PUNTAJES NEGATIVOS
# ============================================================================
#  app.py NO rechaza valores negativos.
# El árbol los clasificará como Genin porque están por debajo del primer corte.
# ============================================================================

print("\n--- PUNTAJES NEGATIVOS ---")

casos_negativos = [
    -1,
    -5,
    -100,
]

for puntaje in casos_negativos:

    if probar(
        puntaje,
        0,
        "Genin",
        f"Negativo {puntaje}"
    ):
        aprobadas += 1

    totales += 1


# ============================================================================
# 8. PRUEBA SIN PUNTAJE
# ============================================================================
# datos.get('puntaje', 0)
#
# Si no existe "puntaje", app.py utiliza 0.
# ============================================================================

print("\n--- AUSENCIA DE PUNTAJE ---")

response = client.post(
    "/api/ia/recomendar-ruta",
    json={}
)

datos = response.get_json()

correcto = (
    response.status_code == 200
    and datos.get("nivel_id") == 0
    and datos.get("puntaje_recibido") == 0
    and datos.get("mensaje") == "Clasificación exitosa"
)

print(
    f"{'JSON sin puntaje':<35} | "
    f"HTTP: {response.status_code:<3} | "
    f"Nivel: {datos.get('nivel_id') if datos else None:<5} | "
    f"{'APROBADO' if correcto else 'FALLIDO'}"
)

if correcto:
    aprobadas += 1

totales += 1


# ============================================================================
# 9. PRUEBA DE TEXTO NUMÉRICO
# ============================================================================
# float("7") funciona correctamente.
# ============================================================================

print("\n--- TEXTO NUMÉRICO ---")

response = client.post(
    "/api/ia/recomendar-ruta",
    json={"puntaje": "7"}
)

datos = response.get_json()

correcto = (
    response.status_code == 200
    and datos.get("nivel_id") == 1
    and datos.get("puntaje_recibido") == 7.0
)

print(
    f"{'Texto numérico \"7\"':<35} | "
    f"HTTP: {response.status_code:<3} | "
    f"Nivel: {datos.get('nivel_id') if datos else None:<5} | "
    f"{'APROBADO' if correcto else 'FALLIDO'}"
)

if correcto:
    aprobadas += 1

totales += 1


# ============================================================================
# 10. PRUEBA DE TEXTO INVÁLIDO
# ============================================================================
# float("abc") genera una excepción.
# app.py debe devolver HTTP 500.
# ============================================================================

print("\n--- DATOS INVÁLIDOS ---")

response = client.post(
    "/api/ia/recomendar-ruta",
    json={"puntaje": "abc"}
)

datos = response.get_json()

correcto = (
    response.status_code == 500
    and "error" in datos
)

print(
    f"{'Texto inválido \"abc\"':<35} | "
    f"HTTP: {response.status_code:<3} | "
    f"{'APROBADO' if correcto else 'FALLIDO'}"
)

if correcto:
    aprobadas += 1

totales += 1


# ============================================================================
# 11. PRUEBA DE JSON SIN CONTENIDO
# ============================================================================

print("\n--- JSON VACÍO / AUSENTE ---")

response = client.post(
    "/api/ia/recomendar-ruta"
)

datos = response.get_json()

# Dependiendo de la configuración de Flask, request.get_json()
# puede generar un error y entrar al except.

correcto = response.status_code in [400, 500]

print(
    f"{'Petición sin JSON':<35} | "
    f"HTTP: {response.status_code:<3} | "
    f"{'APROBADO' if correcto else 'FALLIDO'}"
)

if correcto:
    aprobadas += 1

totales += 1


# ============================================================================
# 12. RESUMEN
# ============================================================================

print("\n" + "=" * 75)
print("RESUMEN DE PRUEBAS")
print("=" * 75)

print(f"Pruebas aprobadas : {aprobadas}")
print(f"Pruebas totales   : {totales}")
print(f"Pruebas fallidas  : {totales - aprobadas}")

porcentaje = (aprobadas / totales) * 100

print(f"Cobertura de casos probados: {porcentaje:.2f}%")

if aprobadas == totales:
    print("\nRESULTADO FINAL: TODAS LAS PRUEBAS APROBADAS")
else:
    print("\nRESULTADO FINAL: EXISTEN PRUEBAS FALLIDAS")

print("=" * 75)