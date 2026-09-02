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
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md border-t-4 border-[#FBE000]">
                
                {/* Mascota Pequeña */}
                <div className="flex justify-center mb-6">
                    <img src="/mascota.png" alt="Mascota PMM" className="w-24 h-24 object-contain" />
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#0A3D62] uppercase tracking-wide">
                        Recuperar Contraseña
                    </h2>
                    <div className="h-0.5 bg-[#FBE000] w-24 mx-auto my-3 rounded-full"></div>
                    <p className="text-slate-500 text-sm">
                        No te preocupes, te ayudamos a recuperar tu acceso.
                    </p>
                </div>

                {mensaje.texto && (
                    <div className={`p-3 mb-6 text-xs font-bold border-l-4 ${
                        mensaje.tipo === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'
                    }`}>
                        {mensaje.tipo === 'success' ? '✅ ' : '⚠️ '} {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Correo Electrónico
                        </label>
                        <input 
                            required 
                            type="email" 
                            value={correo} 
                            onChange={(e) => setCorreo(e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white outline-none text-slate-900 transition-all" 
                            placeholder="usuario@uniajc.edu.co" 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading || mensaje.tipo === 'success'} 
                        className={`w-full bg-[#0A3D62] text-white font-bold py-3.5 rounded-xl hover:bg-[#083252] transition-all uppercase text-sm tracking-wide shadow-md hover:shadow-lg ${
                            (loading || mensaje.tipo === 'success') ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <Link to="/" className="text-sm text-slate-500 hover:text-[#0A3D62] font-semibold transition-colors">
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SolicitarRecuperacion;