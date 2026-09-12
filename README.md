# academia_pmm_2
Mejorar frontend de PMM INTERACTIVO

## Despliegue del frontend en Vercel

El workflow `.github/workflows/vercel.yml` despliega `pmm-frontend` en
produccion cuando cambian el frontend o el workflow en `main` o `master`.
Tambien se puede ejecutar desde Actions > Desplegar frontend en Vercel >
Run workflow; la rama seleccionada se publicara en produccion.

1. En el proyecto de Vercel correspondiente a `VERCEL_PROJECT_ID`, configura:
   - Root Directory: `pmm-frontend`.
   - Framework Preset: `Vite`.
   - Install Command: `npm ci`.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
   - Node.js: `22.x`.
2. En GitHub > Settings > Secrets and variables > Actions, agrega los secrets
   `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` y `VERCEL_TOKEN`. Los IDs deben pertenecer
   al mismo proyecto/equipo y el token debe tener acceso a ese proyecto.
3. En Vercel > Settings > Environment Variables, configura `VITE_API_URL` para
   Production con el origen HTTPS publico del backend, por ejemplo
   `https://api.ejemplo.com`, sin agregar `/api` (las peticiones ya lo incluyen).
   Esta variable se incorpora
   al JavaScript durante la compilacion; no debe contener credenciales.
4. Publica estos cambios en `main`/`master` o ejecuta el workflow manualmente
   desde una rama que contenga este archivo. La URL aparecera en el resumen
   de la ejecucion de GitHub Actions.

Los comandos de Vercel se ejecutan desde la raiz del repositorio y utilizan
el Root Directory configurado en Vercel. `vercel pull` descarga la configuracion
y variables de produccion, `vercel build` compila y `vercel deploy --prebuilt`
publica el resultado. Las rutas de React Router ya estan cubiertas por
`pmm-frontend/vercel.json`.

Este workflow publica solo el frontend. El backend Express, MySQL y el servicio
Python de IA requieren servicios desplegados por separado. Configura
`FRONTEND_URL` en el backend con el dominio del frontend para permitir CORS y
generar los enlaces de correo. Sin `VITE_API_URL`, el frontend utiliza localhost.
Si usas Google OAuth, autoriza tambien el dominio de Vercel en el cliente de Google.

Si el proyecto tiene habilitados despliegues automaticos mediante la integracion
Git de Vercel, desactivalos si quieres que GitHub Actions sea el unico mecanismo
de despliegue. Este workflow es independiente del workflow de pruebas del backend.

Referencia: [GitHub Actions con Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel).
