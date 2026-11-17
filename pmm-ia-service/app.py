# ============================================================================
# Archivo: app.py (VERSIÓN PRODUCCIÓN - RAILWAY READY)
# ============================================================================

from flask import Flask, request, jsonify
import hmac
import numpy as np
from sklearn.tree import DecisionTreeClassifier
import os
import sys
import time
from collections import defaultdict

# Windows (cp1252) y CI: salida ASCII-segura para evitar UnicodeEncodeError.
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

app = Flask(__name__)

# 1. ENTRENAMIENTO (0-6 Genin | 7-10 Chunin | 11-13 Jonin)
X_train = np.array([[i] for i in range(14)])
y_train = np.array([0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2])

modelo_ia = DecisionTreeClassifier()
modelo_ia.fit(X_train, y_train)

print("[OK] Motor de IA recalibrado (Railway/local).")

# Rate limit en memoria (una réplica Railway). Defensa ante abuso directo al servicio.
RATE_IA_WINDOW_MS = int(os.environ.get("RATE_IA_WINDOW_MS", str(15 * 60 * 1000)))
RATE_IA_MAX = int(os.environ.get("RATE_IA_MAX", "60"))
_rate_hits = defaultdict(list)


def _respuesta_entrada_invalida(mensaje):
    return jsonify({"mensaje": mensaje}), 400


def _clave_cliente():
    # remote_addr: no se usa X-Forwarded-For (el cliente podría falsificarlo).
    return request.remote_addr or "unknown"


def _credencial_interna_valida():
    secreto_esperado = os.environ.get("IA_SERVICE_SECRET", "")
    secreto_recibido = request.headers.get("X-IA-Service-Secret", "")
    if not secreto_esperado or not secreto_recibido:
        return False

    try:
        secreto_esperado_bytes = secreto_esperado.encode("utf-8")
        secreto_recibido_bytes = secreto_recibido.encode("utf-8")
    except UnicodeEncodeError:
        return False

    return hmac.compare_digest(
        secreto_recibido_bytes,
        secreto_esperado_bytes
    )


def _aplicar_rate_limit():
    """Solo llamadas sin credencial interna válida (abuso directo al servicio)."""
    ahora = time.time()
    ventana_s = max(RATE_IA_WINDOW_MS, 1) / 1000.0
    inicio = ahora - ventana_s
    clave = _clave_cliente()
    vigentes = [t for t in _rate_hits[clave] if t > inicio]
    if len(vigentes) >= RATE_IA_MAX:
        _rate_hits[clave] = vigentes
        resp = jsonify({
            "mensaje": (
                "Demasiadas solicitudes al clasificador. "
                "Espera unos minutos e inténtalo de nuevo."
            )
        })
        resp.status_code = 429
        resp.headers["Retry-After"] = str(int(ventana_s))
        return resp

    vigentes.append(ahora)
    _rate_hits[clave] = vigentes
    return None


def _validar_credencial_interna():
    """Restringe el clasificador a llamadas autenticadas desde el backend."""
    secreto_esperado = os.environ.get("IA_SERVICE_SECRET", "")

    if not secreto_esperado:
        return jsonify({
            "mensaje": "El servicio de IA no tiene configurada la credencial interna."
        }), 503

    if not _credencial_interna_valida():
        return jsonify({
            "mensaje": "Credencial interna inválida o ausente."
        }), 401

    return None


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
    # Con credencial válida el cupo lo controla el backend (por usuario).
    # Aquí solo se frena el abuso directo, sin secreto.
    if not _credencial_interna_valida():
        error_limite = _aplicar_rate_limit()
        if error_limite is not None:
            return error_limite

    error_autorizacion = _validar_credencial_interna()
    if error_autorizacion is not None:
        return error_autorizacion

    try:
        datos = request.get_json(silent=True)
        puntaje, error = _parsear_puntaje_entero(datos)
        if error is not None:
            return error

        prediccion = int(modelo_ia.predict([[puntaje]])[0])

        print(
            f"[IA] Puntaje recibido: {puntaje} | Nivel asignado: {prediccion}"
        )

        return jsonify({
            "nivel_id": prediccion,
            "puntaje_recibido": puntaje,
            "mensaje": "Clasificación exitosa"
        }), 200

    except Exception as e:
        print("[ERROR] Fallo en clasificador IA:", str(e))
        return jsonify({"error": "Error interno al clasificar el puntaje."}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
