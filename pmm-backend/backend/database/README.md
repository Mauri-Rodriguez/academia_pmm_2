# Base de datos de PMM Interactivo
 
Esta carpeta contiene los scripts para reproducir la base de datos de la plataforma en un servidor MySQL 8.
 
| Archivo | Contenido |
|---|---|
| `schema.sql` | Estructura de las tablas (sin datos). |
| `seed_data.sql` | Contenido académico de la plataforma: módulos, ejercicios, preguntas del diagnóstico, insignias y biblioteca de recursos. No incluye datos de usuarios, foro, progreso ni resultados. |
 
## Cómo restaurarla
 
1. Crear la base de datos vacía:
```sql
CREATE DATABASE pmm_interactivo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```
 
2. Cargar primero la estructura y después el contenido:
```bash
mysql -u <usuario> -p pmm_interactivo < pmm-backend/backend/database/schema.sql
mysql -u <usuario> -p pmm_interactivo < pmm-backend/backend/database/seed_data.sql
```
 
3. Configurar las variables de entorno del backend (ver `README_LOCAL.md`) apuntando a esa base de datos.
## Contenido que se carga
 
| Tabla | Registros |
|---|---|
| `modulos` | 21 (Genin: 4, Chunin: 9, Jonin: 8) |
| `ejercicios` | 210 (Genin: 40, Chunin: 90, Jonin: 80) |
| `preguntas_diagnostico` | 13 |
| `insignias` | 24 |
| `biblioteca_pergaminos` | 16 |

## Notas
 
- No quitar las lineas de encabezado de los archivos `.sql` que desactivan temporalmente las llaves foráneas: `seed_data.sql` inserta los ejercicios antes que los módulos.
- Los scripts no contienen datos personales, credenciales ni claves.
- Los usuarios de prueba se crean registrándose desde la plataforma.
