import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/api';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const DOMINIOS_PERMITIDOS = [
        'uniajc.edu.co',
        'estudiante.uniajc.edu.co',
        'profesores.uniajc.edu.co',
        'admon.uniajc.edu.co',
        'gmail.com',
        'outlook.com',
        'hotmail.com'
    ];

    const guardarSesion = (token, usuario, requiereDiagnostico) => {
        localStorage.clear();
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        if (usuario.rol === 'docente') {
            navigate('/docente/dashboard');
            return;
        }   

        if (usuario && (usuario.nombre || usuario.nombre_completo)) {
            const nombreCompleto = usuario.nombre || usuario.nombre_completo;
            const primerNombre = nombreCompleto.split(' ')[0];
            localStorage.setItem('user_name', primerNombre);
        } else {
            localStorage.setItem('user_name', usuario.rol === 'docente' ? 'Docente' : 'Estudiante');
        }

        if (requiereDiagnostico === false) {
            navigate('/estudiante/dashboard');
        } else {
            navigate('/estudiante/diagnostico');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const res = await api.post('/api/auth/google-login', {
                token: credentialResponse.credential
            });
            guardarSesion(res.data.token, res.data.usuario, res.data.requiereDiagnostico);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'El sello de Google no es válido.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            return setError('El formato del correo es inválido.');
        }

        const dominio = correo.split('@')[1]?.toLowerCase();
        if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
            return setError(`Dominio no autorizado. Usa: ${DOMINIOS_PERMITIDOS.join(', ')}`);
        }

        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', { correo, password });
            guardarSesion(res.data.token, res.data.usuario, res.data.requiereDiagnostico);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error en las credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8">
            {/* 🚩 CAMBIO: flex-col en móvil, md:flex-row en escritorio. min-h-auto en móvil, md:min-h-[650px] en escritorio */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl md:min-h-[650px]">
                
                {/* === COLUMNA IZQUIERDA: MARCA Y MASCOTA === */}
                {/* 🚩 CAMBIO: Visible en móvil pero más compacta (justify-center, min-h-[300px]). En escritorio vuelve a su tamaño original. */}
                <div className="w-full md:w-1/2 bg-[#0A3D62] flex flex-col justify-center md:justify-between p-8 md:p-12 text-white relative overflow-hidden min-h-[300px] md:min-h-0">
                    
                    {/* Texto superior */}
                    <div className="relative z-10 mb-6 md:mb-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Bienvenido a</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                            PMM <span className="text-[#FBE000]">Interactivo</span>
                        </h2>
                    </div>

                    {/* Mascota (Escala según el dispositivo) */}
                    <div className="relative z-10 flex justify-center my-4 md:my-8">
                        <img 
                            src="/mascota.png" 
                            alt="Mascota PMM" 
                            className="w-40 h-40 md:w-72 md:h-72 object-contain drop-shadow-2xl transition-all duration-500" 
                        />
                    </div>

                    {/* Texto inferior (Oculto en móvil muy pequeño para ahorrar espacio, visible en md) */}
                    <div className="relative z-10 hidden md:block">
                        <h3 className="text-2xl font-bold mb-2">Continúa tu progreso</h3>
                        <p className="text-white/80 text-sm">
                            Accede a tus ejercicios y avances en PMM Interactivo
                        </p>
                    </div>

                    {/* Decoración de fondo sutil */}
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[#FBE000] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* === COLUMNA DERECHA: FORMULARIO === */}
                {/* 🚩 CAMBIO: Padding reducido en móvil (p-6) y normal en escritorio (md:p-12) */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-md">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Iniciar sesión</h1>
                        <p className="text-slate-500 text-sm mb-6 md:mb-8">
                            Ingresa con tu correo institucional o personal
                        </p>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-xs md:text-sm font-bold rounded-r-lg flex items-start gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Correo electrónico</label>
                                <input 
                                    required 
                                    type="email" 
                                    value={correo} 
                                    onChange={(e) => setCorreo(e.target.value)} 
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 md:p-3.5 focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/10 outline-none text-slate-900 transition-all" 
                                    placeholder="usuario@uniajc.edu.co" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
                                <input 
                                    required 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 md:p-3.5 focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/10 outline-none text-slate-900 transition-all" 
                                    placeholder="••••••••" 
                                />
                                <div className="flex justify-end mt-2">
                                    <Link to="/recuperar-password" className="text-xs text-slate-500 hover:text-[#0A3D62] font-semibold transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-[#0A3D62] text-white font-bold py-3 md:py-3.5 rounded-xl hover:bg-[#083252] transition-all uppercase text-sm tracking-wide shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Validando...
                                    </span>
                                ) : 'Entrar'}
                            </button>
                        </form>

                        <div className="flex items-center my-6 md:my-7">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="px-3 text-[10px] md:text-xs uppercase text-slate-400 font-bold">o continúa con</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        <div className="flex justify-center w-full">
                            {/* Contenedor responsive para el botón de Google */}
                            <div className="w-full flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Fallo en la conexión con Google.')}
                                    use_fedcm_for_prompt={false}
                                    theme="outline"
                                    size="large"
                                    shape="pill"
                                    width="100%"
                                />
                            </div>
                        </div>

                        <div className="text-center mt-6 md:mt-8">
                            <p className="text-slate-500 text-sm font-medium">
                                ¿No tienes cuenta? <Link to="/registro" className="text-[#0A3D62] font-bold hover:underline transition-all">Regístrate aquí</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;