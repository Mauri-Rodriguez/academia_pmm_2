import axios from 'axios';

// 🛡️ MODO DINÁMICO
const rawUrl =
    import.meta.env.VITE_API_URL || 'http://localhost:3001';

const baseUrlClean = rawUrl.replace(/\/$/, '');

export const BACKEND_URL = baseUrlClean.replace(/\/api$/, '');

const api = axios.create({
    baseURL: baseUrlClean
});

// ============================================================
// 1️⃣ INTERCEPTOR DE PETICIÓN
// ============================================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================================
// 2️⃣ INTERCEPTOR DE RESPUESTA
// ============================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status = error.response?.status;

        console.error('❌ Error API:', {
            status,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data
        });

        // ========================================================
        // SOLO 401 → posible sesión/token no válido
        // ========================================================

        if (status === 401) {
            if (window.location.pathname !== '/') {
                console.warn(
                    '⚠️ [Sistema de Seguridad] Token no autorizado.'
                );

                localStorage.clear();

                alert(
                    'Tu sesión ya no es válida. Vuelve a identificarte en las puertas de la aldea.'
                );

                window.location.href = '/';
            }
        }

        // ========================================================
        // 403 → PROHIBIDO / SIN PERMISOS
        // NO borrar sesión.
        // ========================================================

        if (status === 403) {
            console.warn(
                '⚠️ [Sistema de Seguridad] Acceso prohibido:',
                error.response?.data
            );
        }

        return Promise.reject(error);
    }
);

export default api;