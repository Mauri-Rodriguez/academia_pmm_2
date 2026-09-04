import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        // 🛡️ Validaciones de seguridad (Heurística #5: Prevención de errores)
        if (password.length < 6) {
            return setMensaje({ texto: 'La nueva contraseña debe tener al menos 6 caracteres.', tipo: 'error' });
        }
        if (password !== confirmarPassword) {
            return setMensaje({ texto: 'Las contraseñas no coinciden. Por favor, verifícalas.', tipo: 'error' });
        }

        setLoading(true);
        try {
            const res = await api.post(`/api/auth/reset-password/${token}`, { nuevaPassword: password });
            setMensaje({ texto: res.data.mensaje, tipo: 'success' });
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setMensaje({ 
                texto: err.response?.data?.mensaje || 'El enlace ha expirado o no es válido. Solicita uno nuevo.', 
                tipo: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-md border-t-4 border-[#FBE000] relative overflow-hidden">
                
                {/* Decoración de fondo sutil */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBE000]/10 blur-[60px] rounded-full -z-10"></div>

                {/* Mascota: /idea.png representa la solución y el restablecimiento */}
                <div className="flex justify-center mb-6">
                    <img src="/idea.png" alt="Restablecer acceso" className="w-24 h-24 object-contain drop-shadow-sm" />
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold text-[#0A3D62] uppercase tracking-wide">
                        Restablecer Contraseña
                    </h2>
                    <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                        Ingresa y confirma tu nueva contraseña para recuperar el acceso seguro a tu cuenta.
                    </p>
                </div>

                {/* Alertas de Estado (Heurística #1 y #9: Claras y sin animaciones distractores como pulse) */}
                {mensaje.texto && (
                    <div className={`p-4 mb-6 text-sm font-medium rounded-xl flex items-start gap-3 border ${
                        mensaje.tipo === 'success' 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <span className="text-lg flex-shrink-0">{mensaje.tipo === 'success' ? '✅' : '⚠️'}</span>
                        <span>{mensaje.texto}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Nueva Contraseña
                        </label>
                        <input 
                            required 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/10 outline-none text-slate-900 transition-all placeholder:text-slate-400" 
                            placeholder="Mínimo 6 caracteres" 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Confirmar Contraseña
                        </label>
                        <input 
                            required 
                            type="password" 
                            value={confirmarPassword} 
                            onChange={(e) => setConfirmarPassword(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/10 outline-none text-slate-900 transition-all placeholder:text-slate-400" 
                            placeholder="Repite tu contraseña" 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading || mensaje.tipo === 'success'} 
                        className={`w-full bg-[#0A3D62] text-white font-bold py-3.5 rounded-xl hover:bg-[#083252] transition-all uppercase text-sm tracking-wide shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                            (loading || mensaje.tipo === 'success') ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </>
                        ) : 'Restablecer Contraseña'}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-sm text-slate-500 hover:text-[#0A3D62] font-semibold transition-colors flex items-center justify-center gap-2 group mx-auto"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al inicio de sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;