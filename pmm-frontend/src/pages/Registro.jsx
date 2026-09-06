import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        correo: '',
        password: '',
        confirmarPassword: '',
    });
    
    // 🚩 NUEVO: Estado para el consentimiento legal
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [detectedRole, setDetectedRole] = useState('');
    const navigate = useNavigate();

    const DOMINIOS_DOCENTES = ['profesores.uniajc.edu.co', 'admon.uniajc.edu.co'];
    const DOMINIOS_PERMITIDOS = [
        ...DOMINIOS_DOCENTES,
        'estudiante.uniajc.edu.co', 
        'gmail.com', 'outlook.com', 'hotmail.com'
    ];

    useEffect(() => {
        if (formData.confirmarPassword !== '') {
            setPasswordMatch(formData.password === formData.confirmarPassword);
        } else {
            setPasswordMatch(true);
        }

        const dominio = formData.correo.split('@')[1]?.toLowerCase();
        if (DOMINIOS_DOCENTES.includes(dominio)) {
            setDetectedRole('Docente/Administrativo');
        } else if (dominio && DOMINIOS_PERMITIDOS.includes(dominio)) {
            setDetectedRole('Estudiante');
        } else {
            setDetectedRole('');
        }
    }, [formData, DOMINIOS_DOCENTES, DOMINIOS_PERMITIDOS]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getPasswordStrength = () => {
        const pass = formData.password;
        if (pass.length === 0) return { label: '', color: 'bg-gray-200', width: '0%' };
        if (pass.length < 6) return { label: 'Contraseña débil', color: 'bg-red-500', width: '33%' };
        if (pass.length < 10) return { label: '¡Buen camino!', color: 'bg-yellow-400', width: '66%' };
        return { label: '¡Nivel Pro!', color: 'bg-green-500', width: '100%' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 🚩 VALIDACIÓN LEGAL: Bloquear registro si no acepta términos
        if (!aceptaTerminos) {
            return setMensaje({ texto: 'Debes aceptar los Términos y la Política de Privacidad para continuar.', tipo: 'error' });
        }
        if (!passwordMatch) return setMensaje({ texto: 'Las contraseñas no coinciden.', tipo: 'error' });
        if (formData.password.length < 6) return setMensaje({ texto: 'La contraseña debe tener mínimo 6 caracteres.', tipo: 'error' });

        const dominio = formData.correo.split('@')[1]?.toLowerCase();
        if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
            return setMensaje({ texto: 'Este dominio no tiene acceso a la plataforma.', tipo: 'error' });
        }

        setLoading(true);
        try {
            await api.post('/api/auth/register', {
                nombre_completo: formData.nombre_completo,
                correo: formData.correo,
                password: formData.password,
                acepta_politica_privacidad: true // 🚩 Se envía al backend como evidencia de consentimiento
            });

            setMensaje({ texto: '¡Registro exitoso! Revisa tu correo de activación.', tipo: 'success' });
            setTimeout(() => navigate('/'), 4000);
        } catch (err) {
            setMensaje({ 
                texto: err.response?.data?.mensaje || 'Fallo en el registro.', 
                tipo: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-md border-t-4 border-[#FBE000]">
                
                {/* Mascota */}
                <div className="flex justify-center mb-6">
                    <img src="/icono mascota app.png" alt="Mascota PMM" className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg" />
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A3D62] uppercase tracking-wide">
                        Crear <span className="text-[#2E5AAC]">Cuenta</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Empieza tu aventura en PMM Interactivo
                    </p>
                </div>

                {mensaje.texto && (
                    <div className={`p-3 mb-6 text-xs font-bold border-l-4 rounded-r-lg ${
                        mensaje.tipo === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'
                    }`}>
                        {mensaje.tipo === 'success' ? '✅ ' : '⚠️ '} {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                        <input name="nombre_completo" required type="text" value={formData.nombre_completo} onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white outline-none text-slate-900 transition-all" placeholder="Ej. Taylor Valencia" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Correo</label>
                            {detectedRole && <span className="text-[10px] bg-[#0A3D62] text-white px-2 py-0.5 rounded-full font-bold uppercase">Rol: {detectedRole}</span>}
                        </div>
                        <input name="correo" required type="email" value={formData.correo} onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white outline-none text-slate-900 transition-all" placeholder="usuario@uniajc.edu.co" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Contraseña</label>
                            <input name="password" required type="password" value={formData.password} onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white outline-none text-slate-900 transition-all" placeholder="••••••••" />
                            <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-500 rounded-full ${strength.color}`} style={{ width: strength.width }}></div>
                            </div>
                            <p className="text-[10px] mt-1 text-right font-bold text-slate-400 uppercase">{strength.label}</p>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Confirmar</label>
                            <input name="confirmarPassword" required type="password" value={formData.confirmarPassword} onChange={handleChange}
                                className={`w-full bg-slate-50 border rounded-xl p-3.5 outline-none transition-all ${
                                    passwordMatch ? 'border-slate-300 focus:border-[#0A3D62] focus:bg-white text-slate-900' : 'border-red-500 bg-red-50 text-red-900'
                                }`} placeholder="••••••••" />
                            {!passwordMatch && <p className="text-[10px] text-red-600 font-bold mt-1 uppercase">No coinciden</p>}
                        </div>
                    </div>

                    {/* 🚩 SECCIÓN LEGAL: Consentimiento explícito (Ley 1581 de 2012) */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                required
                                checked={aceptaTerminos}
                                onChange={(e) => setAceptaTerminos(e.target.checked)}
                                className="mt-1 w-4 h-4 text-[#0A3D62] border-slate-300 rounded focus:ring-[#0A3D62] cursor-pointer" 
                            />
                            <span className="text-[11px] text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                                He leído y acepto los{' '}
                                <Link to="/terminos" className="text-[#0A3D62] font-bold underline hover:text-[#2E5AAC]">Términos y Condiciones</Link>{' '}
                                y la{' '}
                                <Link to="/privacidad" className="text-[#0A3D62] font-bold underline hover:text-[#2E5AAC]">Política de Privacidad</Link>. 
                                Autorizo el tratamiento de mis datos personales para fines académicos, de personalización con IA y seguimiento de progreso.
                            </span>
                        </label>
                    </div>

                    <button type="submit" disabled={loading || !passwordMatch || !aceptaTerminos}
                        className="w-full bg-[#0A3D62] text-white font-bold py-3.5 rounded-xl hover:bg-[#083252] transition-all uppercase text-sm tracking-wide shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Registrando...' : 'Confirmar Registro'}
                    </button>

                    {/* Insignias por desbloquear */}
                    <div className="flex justify-center gap-6 mt-2">
                        <div className="text-center">
                            <span className="text-2xl grayscale opacity-40">🏆</span>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Principiante</p>
                        </div>
                        <div className="text-center">
                            <span className="text-2xl grayscale opacity-40">🚀</span>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Avanzado</p>
                        </div>
                        <div className="text-center">
                            <span className="text-2xl grayscale opacity-40">👑</span>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Maestro</p>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                    <Link to="/" className="text-sm text-slate-500 hover:text-[#0A3D62] font-semibold transition-colors">
                        ¿Ya tienes cuenta? <span className="text-[#0A3D62] font-bold">Inicia sesión</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Registro;