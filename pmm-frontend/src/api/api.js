import axios from 'axios';

const RUTAS_PROTEGIDAS = [
    '/api/diagnostico',
    '/api/estudiante',
    '/api/docente',
    '/api/ejercicios',
    '/api/progreso'
];

// 1. Tomamos la URL (ya sea de Vercel/Railway o de Localhost)
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 2. Exportamos la URL para las fotos (Le quitamos el /api del final de forma segura)
export const BACKEND_URL = rawUrl.replace(/\/$/, '').replace(/\/api$/, '');

// 3. Creamos la instancia de Axios
const api = axios.create({
    baseURL: rawUrl.replace(/\/$/, '') 
});

// 4. INTERCEPTOR DE PETICIÓN: Inyecta el token en cada llamada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 5. INTERCEPTOR DE RESPUESTA: El Escudo Global (Protección 401/403)
api.interceptors.response.use(
    (response) => {
        return response;
    }, 
    (error) => {
        const estado = error.response?.status;
        const rutaSolicitud = error.config?.url || '';
        const esRutaProtegida = RUTAS_PROTEGIDAS.some(
            ruta => rutaSolicitud.startsWith(ruta)
        );
        const haySesion = Boolean(localStorage.getItem('token'));

        if (estado === 401 && esRutaProtegida && haySesion) {
            console.warn("⚠️ [Sistema de Seguridad] Chakra agotado. Expulsando usuario...");
            localStorage.clear();
            alert("Tu sesión ha caducado. Vuelve a identificarte en las puertas de la aldea.");
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
