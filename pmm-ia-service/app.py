# ============================================================================
# Archivo: app.py (VERSIÓN PRODUCCIÓN - RAILWAY READY)
# ============================================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.tree import DecisionTreeClassifier
import os

app = Flask(__name__)
CORS(app)

# 1. ENTRENAMIENTO (0-6 Genin | 7-10 Chunin | 11-13 Jonin)
X_train = np.array([[i] for i in range(14)])
y_train = np.array([0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2])

modelo_ia = DecisionTreeClassifier()
modelo_ia.fit(X_train, y_train)

print("✅ Motor de IA Recalibrado y desplegado en Railway.")


def _respuesta_entrada_invalida(mensaje):
    return jsonify({"mensaje": mensaje}), 400


def _parsear_puntaje_entero(datos):
    """
    Acepta únicamente puntajes enteros entre 0 y 13 (dominio del diagnóstico).
    Devuelve (puntaje, None) o (None, respuesta_flask_400).
    """
    if datos is None:
        return None, _respuesta_entrada_invalida(
            "Se requiere un cuerpo JSON válido con el campo puntaje."
        )

    if not isinstance(datos, dict):
        return None, _respuesta_entrada_invalida(
            "El cuerpo debe ser un objeto JSON."
        )

    if "puntaje" not in datos:
        return None, _respuesta_entrada_invalida(
            "El campo puntaje es obligatorio."
        )

    raw = datos["puntaje"]

    if raw is None:
        return None, _respuesta_entrada_invalida(
            "El puntaje no puede ser nulo."
        )

    if isinstance(raw, bool):
        return None, _respuesta_entrada_invalida(
            "El puntaje debe ser un número entero."
        )

    if isinstance(raw, str) or isinstance(raw, (dict, list)):
        return None, _respuesta_entrada_invalida(
            "El puntaje debe ser un número entero entre 0 y 13."
        )

    if isinstance(raw, int):
        puntaje = raw
    elif isinstance(raw, float):
        if not raw.is_integer():
            return None, _respuesta_entrada_invalida(
                "El puntaje debe ser un número entero entre 0 y 13."
            )
        puntaje = int(raw)
    else:
        return None, _respuesta_entrada_invalida(
            "El puntaje debe ser un número entero entre 0 y 13."
        )

    if puntaje < 0 or puntaje > 13:
        return None, _respuesta_entrada_invalida(
            "El puntaje debe estar entre 0 y 13."
        )

    return puntaje, None


@app.route('/api/ia/recomendar-ruta', methods=['POST'])
def recomendar_ruta():
    try:
        datos = request.get_json(silent=True)
        puntaje, error = _parsear_puntaje_entero(datos)
        if error is not None:
            return error

        prediccion = int(modelo_ia.predict([[puntaje]])[0])

        print(
            f"📊 Puntaje Recibido: {puntaje} | Nivel Asignado: {prediccion}"
        )

        return jsonify({
            "nivel_id": prediccion,
            "puntaje_recibido": puntaje,
            "mensaje": "Clasificación exitosa"
        }), 200

    except Exception as e:
        print("🚨 Error en IA:", str(e))
        return jsonify({"error": "Error interno al clasificar el puntaje."}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
