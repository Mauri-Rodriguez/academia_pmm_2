# PMM Interactivo (academia_pmm_2)

Plataforma web con inteligencia artificial para apoyar el aprendizaje de las matemáticas en la Institución Universitaria Antonio José Camacho. Trabajo de grado, Ingeniería de Sistemas, 2026.

Versión desplegada: https://academia-pmm-2.vercel.app/

## Estructura

| Carpeta | Contenido |
|---|---|
| `pmm-frontend` | Aplicación React, Vite y Tailwind |
| `pmm-backend` | API Node.js, Express y Sequelize |
| `pmm-ia-service` | Microservicio Flask con scikit-learn (clasificador del diagnóstico) |
| `pmm-backend/backend/database` | Esquema y datos iniciales de MySQL |
| `docs/pruebas` | Evidencia de las pruebas de aceptación |

## Instalación local

Requisitos: Node.js 20, **Python 3.13.x** (alineado con Railway `3.13.16`) y MySQL 8.

**1. Base de datos**

```sql
CREATE DATABASE pmm_interactivo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

```bash
mysql -u <usuario> -p pmm_interactivo < pmm-backend/backend/database/schema.sql
mysql -u <usuario> -p pmm_interactivo < pmm-backend/backend/database/seed_data.sql
```

Carga 21 módulos, 210 ejercicios, 13 preguntas del diagnóstico, 24 insignias y 16 recursos. No incluye usuarios ni datos personales. Los usuarios se crean registrándose desde la plataforma.

**2. Microservicio de IA** (puerto 5000 por defecto)

```bash
cd pmm-ia-service
# Preferible: Python 3.13 (ver runtime.txt). En Windows usar py -3.13
py -3.13 -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python test_clasificador.py
python app.py
```

`requirements.txt` está fijado con hashes (`pip-compile` desde `requirements.in`).

**3. Backend**

```bash
cd pmm-backend
npm install
npm run dev
```

Crear el entorno a partir de los ejemplos versionados (sin secretos):

```bash
cp pmm-backend/.env.example pmm-backend/.env
cp pmm-frontend/.env.example pmm-frontend/.env
# opcional:
cp pmm-ia-service/.env.example pmm-ia-service/.env
```

| Variable | Uso |
|---|---|
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_DIALECT` | Conexión a MySQL (alternativa: `MYSQL_URL`) |
| `JWT_SECRET` | Firma de los tokens de sesión |
| `GEMINI_API_KEY` | API de Gemini (modelo 2.5 Flash-Lite) para el tutor |
| `IA_SERVICE_URL` | URL base del microservicio, por ejemplo `http://127.0.0.1:5000` (sin `/api/ia/recomendar-ruta`, porque el backend agrega esa ruta) |
| `FRONTEND_URL` | Dominio del frontend (CORS y enlaces de correo). Producción: `https://academia-pmm-2.vercel.app` |
| `CORS_ORIGINS` | Orígenes exactos permitidos (coma-separados). En prod no incluir localhost |
| `DOMINIOS_DOCENTES` | Dominios de correo que reciben el rol docente |
| `RESEND_API_KEY` | Envío de correos de verificación y recuperación |
| `GOOGLE_CLIENT_ID` | Inicio de sesión con Google |
| `PORT`, `UPLOADS_DIR` | Puerto y carpeta de imágenes del foro |
| `LOG_LEVEL` | `error` \| `warn` \| `info` \| `debug` (default `info`) |
| `RATE_TUTOR_MAX`, `RATE_UPLOAD_MAX`, `RATE_REPORTE_MAX`, `RATE_REPORTE_WINDOW_MS` | Límites de rutas costosas (ver `.env.example`) |

Contraseñas: mínimo 6 caracteres y máximo **72 bytes UTF-8** (límite de bcrypt). JWT de sesión: **2 horas**. En desarrollo sin Resend, los enlaces van a `.local/dev-mailbox/` (no enrutable).

CI: `.github/workflows/test.yml` (backend, frontend, Python) publica artefactos por commit. El **bloqueo de merge** requiere Branch protection en GitHub (required status checks).

**4. Frontend**

```bash
cd pmm-frontend
npm install
npm run dev
```

Variable en `pmm-frontend/.env` (ver `.env.example`): `VITE_API_URL=http://localhost:3001` (sin `/api`).

## Pruebas

```bash
cd pmm-backend
npm test
```

Resultado esperado: 5 suites y 22 pruebas aprobadas. La evidencia de las pruebas de aceptación está en `docs/pruebas/pruebas_aceptacion.md`.

## Despliegue

Frontend en Vercel (raíz `pmm-frontend`, preset Vite, `npm ci`, `npm run build`, salida `dist`, Node 22) con `VITE_API_URL` apuntando al backend. Backend, base de datos y microservicio de IA en Railway. Las rutas de React Router están cubiertas por `pmm-frontend/vercel.json`.
