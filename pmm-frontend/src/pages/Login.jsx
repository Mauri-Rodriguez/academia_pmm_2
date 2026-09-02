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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full max-w-5xl min-h-[650px]">
                
                {/* === COLUMNA IZQUIERDA: IMAGEN O MASCOTA === */}
                <div className="hidden md:flex md:w-1/2 bg-[#0A3D62] flex-col justify-between p-12 text-white relative overflow-hidden">
                    {/* Texto superior */}
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Bienvenido a</p>
                        <h2 className="text-4xl font-extrabold leading-tight">
                            PMM <span className="text-[#FBE000]">Interactivo</span>
                        </h2>
                    </div>

                    {/* Mascota */}
                    <div className="relative z-10 flex justify-center my-8">
                        {/* Si tienes una imagen de mascota, ponla aquí */}
                        <img 
                            src="/mascota.png" 
                            alt="Mascota PMM" 
                            className="w-72 h-72 object-contain drop-shadow-2xl" 
                        />
                    </div>

                    {/* Texto inferior */}
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Continúa tu progreso</h3>
                        <p className="text-white/80 text-sm">
                            Accede a tus ejercicios y avances en PMM Interactivo
                        </p>
                    </div>

                    {/* Decoración de fondo sutil */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBE000] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* === COLUMNA DERECHA: FORMULARIO === */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-12">
                    <div className="w-full max-w-md">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Iniciar sesión</h1>
                        <p className="text-slate-500 text-sm mb-8">
                            Ingresa con tu correo institucional o personal
                        </p>

                        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-xs font-bold">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Correo electrónico</label>
                                <input 
                                    required 
                                    type="email" 
                                    value={correo} 
                                    onChange={(e) => setCorreo(e.target.value)} 
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white outline-none text-slate-900 transition-all" 
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
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 focus:border-[#0A3D62] focus:bg-white outline-none text-slate-900 transition-all" 
                                    placeholder="••••••••" 
                                />
                                <div className="flex justify-end mt-2">
                                    <Link to="/recuperar-password" className="text-xs text-slate-500 hover:text-[#0A3D62] font-semibold">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-[#0A3D62] text-white font-bold py-3.5 rounded-xl hover:bg-[#083252] transition-all uppercase text-sm tracking-wide shadow-md">
                                {loading ? 'Validando...' : 'Entrar'}
                            </button>
                        </form>

                        <div className="flex items-center my-7">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="px-3 text-xs uppercase text-slate-400 font-bold">o continúa con</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Fallo en la conexión')}
                                use_fedcm_for_prompt={false}
                                theme="outline"
                                size="large"
                                shape="pill"
                            />
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-slate-500 text-sm font-medium">
                                ¿No tienes cuenta? <Link to="/registro" className="text-[#0A3D62] font-bold hover:underline">Regístrate aquí</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;