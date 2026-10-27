# ============================================================================
# test_clasificador.py
# Pruebas del clasificador Flask alineadas con F-CLA-400:
# enteros 0–13 → 200; inválidos / fuera de rango → 400.
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
print("PRUEBAS DEL CLASIFICADOR IA (F-CLA-400)")
print("=" * 75)


# ============================================================================
# 3. Funciones auxiliares
# ============================================================================

def probar_valido(puntaje, esperado_nivel, esperado_nombre, descripcion):
    response = client.post(
        "/api/ia/recomendar-ruta",
        json={"puntaje": puntaje}
    )

    datos = response.get_json()
    nivel = datos.get("nivel_id") if datos else None
    estado_http = response.status_code

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


def probar_rechazo(descripcion, **kwargs):
    """Espera HTTP 400 con campo mensaje (F-CLA-400)."""
    response = client.post("/api/ia/recomendar-ruta", **kwargs)
    datos = response.get_json()

    correcto = (
        response.status_code == 400
        and isinstance(datos, dict)
        and "mensaje" in datos
    )

    print(
        f"{descripcion:<35} | "
        f"HTTP: {response.status_code:<3} | "
        f"{'APROBADO' if correcto else 'FALLIDO'}"
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

    if probar_valido(
        puntaje,
        esperado_nivel,
        esperado_nombre,
        f"Puntaje {puntaje}"
    ):
        aprobadas += 1

    totales += 1


# ============================================================================
# 5. PRUEBAS DE DECIMALES → 400
# ============================================================================

print("\n--- PUNTAJES DECIMALES (rechazo 400) ---")

casos_decimales = [0.5, 6.5, 6.9, 7.5, 9.5, 10.5, 12.5]

for puntaje in casos_decimales:
    if probar_rechazo(f"Decimal {puntaje}", json={"puntaje": puntaje}):
        aprobadas += 1
    totales += 1


# ============================================================================
# 6. PRUEBAS DE PUNTAJES MAYORES A 13 → 400
# ============================================================================
# F-CLA-400 (opción A): fuera de 0–13 se rechaza; ya no aplica >13 → Genin.
# ============================================================================

print("\n--- PUNTAJES MAYORES A 13 (rechazo 400) ---")

casos_mayores = [14, 15, 20, 50, 100, 999]

for puntaje in casos_mayores:
    if probar_rechazo(f"Fuera de rango {puntaje}", json={"puntaje": puntaje}):
        aprobadas += 1
    totales += 1


# ============================================================================
# 7. PRUEBAS DE PUNTAJES NEGATIVOS → 400
# ============================================================================

print("\n--- PUNTAJES NEGATIVOS (rechazo 400) ---")

casos_negativos = [-1, -5, -100]

for puntaje in casos_negativos:
    if probar_rechazo(f"Negativo {puntaje}", json={"puntaje": puntaje}):
        aprobadas += 1
    totales += 1


# ============================================================================
# 8. AUSENCIA DE PUNTAJE → 400
# ============================================================================

print("\n--- AUSENCIA DE PUNTAJE ---")

if probar_rechazo("JSON sin puntaje", json={}):
    aprobadas += 1
totales += 1


# ============================================================================
# 9. TEXTO NUMÉRICO → 400 (solo enteros JSON, no coerción de string)
# ============================================================================

print("\n--- TEXTO NUMÉRICO ---")

if probar_rechazo('Texto numérico "7"', json={"puntaje": "7"}):
    aprobadas += 1
totales += 1


# ============================================================================
# 10. TEXTO INVÁLIDO → 400
# ============================================================================

print("\n--- DATOS INVÁLIDOS ---")

if probar_rechazo('Texto inválido "abc"', json={"puntaje": "abc"}):
    aprobadas += 1
totales += 1

if probar_rechazo("puntaje null", json={"puntaje": None}):
    aprobadas += 1
totales += 1

if probar_rechazo("puntaje objeto", json={"puntaje": {"x": 1}}):
    aprobadas += 1
totales += 1


# ============================================================================
# 11. JSON VACÍO / AUSENTE → 400
# ============================================================================

print("\n--- JSON VACÍO / AUSENTE ---")

if probar_rechazo("Petición sin JSON"):
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

# Código de salida para CI / scripts
raise SystemExit(0 if aprobadas == totales else 1)
