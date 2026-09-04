import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const SolicitarRecuperacion = () => {
    const [correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        if (!correo) {
            return setMensaje({ texto: 'Por favor, ingresa tu correo.', tipo: 'error' });
        }

        setLoading(true);
        try {
            const res = await api.post('/api/auth/forgot-password', { correo });
            setMensaje({ texto: res.data.mensaje, tipo: 'success' });
            setCorreo('');
        } catch (err) {
            setMensaje({ 
                texto: err.response?.data?.mensaje || 'Error al solicitar la recuperación.', 
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

                {/* Mascota: /idea.png representa perfectamente la ayuda/solución */}
                <div className="flex justify-center mb-6">
                    <img src="/idea.png" alt="Ayuda" className="w-24 h-24 object-contain drop-shadow-sm" />
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold text-[#0A3D62] uppercase tracking-wide">
                        Recuperar Contraseña
                    </h2>
                    <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                        Ingresa tu correo institucional o personal y te enviaremos un enlace para restablecer tu acceso de forma segura.
                    </p>
                </div>

                {/* Alertas de Estado (Heurística #1 y #9) */}
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
                            Correo Electrónico
                        </label>
                        <input 
                            required 
                            type="email" 
                            value={correo} 
                            onChange={(e) => setCorreo(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/10 outline-none text-slate-900 transition-all placeholder:text-slate-400" 
                            placeholder="usuario@uniajc.edu.co" 
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
                                Enviando...
                            </>
                        ) : 'Enviar Enlace de Recuperación'}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                    <Link to="/" className="text-sm text-slate-500 hover:text-[#0A3D62] font-semibold transition-colors flex items-center justify-center gap-2 group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SolicitarRecuperacion;