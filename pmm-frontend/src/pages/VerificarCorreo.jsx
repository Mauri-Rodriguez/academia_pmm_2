import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const VerificarCorreo = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [estado, setEstado] = useState('validando'); // validando, exito, error
    
    // 🛡️ Guardia: Evita el doble render de React 18 en modo estricto
    const peticionEnviada = useRef(false);

    useEffect(() => {
        const confirmar = async () => {
            if (peticionEnviada.current) return;
            peticionEnviada.current = true;

            try {
                await api.get(`/api/auth/verificar/${token}`);
                setEstado('exito');
                setTimeout(() => navigate('/'), 4000); // Redirige al login después de 4 segundos
            } catch (error) {
                console.error("Error de verificación:", error.response?.data || error);
                setEstado('error');
            }
        };

        if (token) confirmar();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl border-t-4 border-[#FBE000] p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden">
                
                {/* Decoración de fondo sutil */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBE000]/10 blur-[60px] rounded-full -z-10"></div>

                {/* ESTADO: VALIDANDO */}
                {estado === 'validando' && (
                    <div className="flex flex-col items-center">
                        <img src="/pensando.png" alt="Verificando" className="w-32 h-32 object-contain animate-bounce mb-6" />
                        <h2 className="text-xl font-bold text-[#0A3D62] mb-2">Verificando tu cuenta...</h2>
                        <p className="text-sm text-slate-500">Por favor, espera un momento mientras confirmamos tus datos.</p>
                    </div>
                )}

                {/* ESTADO: ÉXITO */}
                {estado === 'exito' && (
                    <div className="flex flex-col items-center">
                        <img src="/correcto.png" alt="Verificado" className="w-32 h-32 object-contain mb-6" />
                        <h2 className="text-2xl font-extrabold text-[#0A3D62] mb-2">¡Cuenta Verificada!</h2>
                        <p className="text-sm text-slate-600 mb-6">
                            Tu registro ha sido completado exitosamente. Serás redirigido al inicio de sesión en unos segundos.
                        </p>
                        {/* Barra de progreso visual (Heurística #1: Visibilidad del estado) */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="bg-[#0A3D62] h-full rounded-full transition-all duration-[4000ms] ease-linear"
                                style={{ width: '100%' }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* ESTADO: ERROR */}
                {estado === 'error' && (
                    <div className="flex flex-col items-center">
                        <img src="/incorrecto.png" alt="Error" className="w-32 h-32 object-contain mb-6" />
                        <h2 className="text-2xl font-extrabold text-red-600 mb-2">Enlace Inválido o Expirado</h2>
                        <p className="text-sm text-slate-600 mb-8">
                            El enlace de verificación no es válido, ya fue utilizado o ha caducado. Por favor, solicita un nuevo registro.
                        </p>
                        <Link 
                            to="/registro" 
                            className="w-full bg-[#0A3D62] text-white font-bold py-3.5 rounded-xl hover:bg-[#083252] transition-all uppercase text-sm tracking-wider shadow-md hover:shadow-lg active:scale-95"
                        >
                            Volver a Registrarme
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificarCorreo;