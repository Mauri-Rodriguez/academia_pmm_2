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

Requisitos: Node.js 20, Python 3.10 o superior y MySQL 8.

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
pip install -r requirements.txt
python app.py
```

**3. Backend**

```bash
cd pmm-backend
npm install
npm run dev
```

Crear un archivo `.env` en `pmm-backend` con:

| Variable | Uso |
|---|---|
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_DIALECT` | Conexión a MySQL (alternativa: `MYSQL_URL`) |
| `JWT_SECRET` | Firma de los tokens de sesión |
| `GEMINI_API_KEY` | API de Gemini (modelo 2.5 Flash-Lite) para el tutor |
| `IA_SERVICE_URL` | URL del microservicio, por ejemplo `http://localhost:5000/api/ia/recomendar-ruta` |
| `FRONTEND_URL` | Dominio del frontend (CORS y enlaces de correo) |
| `DOMINIOS_DOCENTES` | Dominios de correo que reciben el rol docente |
| `RESEND_API_KEY` | Envío de correos de verificación y recuperación |
| `GOOGLE_CLIENT_ID` | Inicio de sesión con Google |
| `PORT`, `UPLOADS_DIR` | Puerto y carpeta de imágenes del foro |

**4. Frontend**

```bash
cd pmm-frontend
npm install
npm run dev
```

Variable en `pmm-frontend/.env`: `VITE_API_URL=http://localhost:3001` (sin `/api`).

## Pruebas

```bash
cd pmm-backend
npm test
```

Resultado esperado: 5 suites y 22 pruebas aprobadas. La evidencia de las pruebas de aceptación está en `docs/pruebas/pruebas_aceptacion.md`.

## Despliegue

Frontend en Vercel (raíz `pmm-frontend`, preset Vite, `npm ci`, `npm run build`, salida `dist`, Node 22) con `VITE_API_URL` apuntando al backend. Backend, base de datos y microservicio de IA en Railway. Las rutas de React Router están cubiertas por `pmm-frontend/vercel.json`.
