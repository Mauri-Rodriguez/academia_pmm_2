import api, { BACKEND_URL } from '../api/api';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CampanaNotificaciones from '../components/CampanaNotificaciones';

// 🚩 HELPER: Tooltip de Ayuda Contextual (Heurísticas #6 y #10)
const InfoTooltip = ({ text }) => (
    <div className="group relative inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 cursor-help ml-1 transition-colors group-hover:text-[#0A3D62]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 p-3 bg-slate-800 text-white text-[11px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed scale-95 group-hover:scale-100">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

const DashboardEstudiante = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingIA, setLoadingIA] = useState(true);
    const [errores, setErrores] = useState([]);
    const [sugerenciaIA, setSugerenciaIA] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [mostrarModalLogout, setMostrarModalLogout] = useState(false);

    const [nombreUsuario, setNombreUsuario] = useState(localStorage.getItem('user_name') || 'Estudiante');
    const [fotoPerfil, setFotoPerfil] = useState(localStorage.getItem('user_avatar') || null);

    const [onboardingActivo, setOnboardingActive] = useState(location.state?.nuevoIngreso || false);
    const [pasoOnboarding, setPasoOnboarding] = useState(0);

    const cargarDatosDashboard = useCallback(async () => {
        try {
            const [resDash, resErrores, resPerfil] = await Promise.all([
                api.get('/api/estudiante/dashboard'),
                api.get('/api/estudiante/errores-recientes'),
                api.get('/api/estudiante/perfil/datos')
            ]);

            setDatos(resDash.data);
            setErrores(resErrores.data);

            if (resPerfil.data?.nombre_completo || resPerfil.data?.nombre) {
                const nombreCompleto = resPerfil.data.nombre_completo || resPerfil.data.nombre;
                const primerNombre = nombreCompleto.split(' ')[0];
                setNombreUsuario(primerNombre);
                localStorage.setItem('user_name', primerNombre);
            }
            if (resPerfil.data?.foto_perfil) {
                setFotoPerfil(resPerfil.data.foto_perfil);
                localStorage.setItem('user_avatar', resPerfil.data.foto_perfil);
            }

            if (resDash.data?.estadisticas?.rango_actual) {
                localStorage.setItem('user_rank', resDash.data.estadisticas.rango_actual);
            }

            setLoading(false);
            obtenerPrediccionIA();
        } catch (err) {
            console.error("Error al cargar dashboard:", err);
            if (err.response?.status === 403) {
                navigate('/estudiante/diagnostico');
            } else {
                navigate('/');
            }
            setLoading(false);
        }
    }, [navigate]);

    const obtenerPrediccionIA = async () => {
        try {
            const resIA = await api.get('/api/estudiante/sugerencia-ia');
            setSugerenciaIA(resIA.data);
        } catch (err) {
            console.error("Error silencioso en IA");
        } finally {
            setLoadingIA(false);
        }
    };

    useEffect(() => {
        cargarDatosDashboard();
    }, [cargarDatosDashboard]);

    const getEstiloNivel = (nivelStr) => {
        const n = nivelStr?.toLowerCase() || '';
        if (n.includes('genin') || n.includes('bajo')) return { color: 'text-rose-500', shadow: 'shadow-rose-500/20', border: 'border-rose-500/30', bg: 'bg-rose-500/10', bar: 'bg-rose-500', label: 'BÁSICO' };
        if (n.includes('chunin') || n.includes('intermedio') || n.includes('guerrero')) return { color: 'text-amber-500', shadow: 'shadow-amber-500/20', border: 'border-amber-500/30', bg: 'bg-amber-500/10', bar: 'bg-amber-500', label: 'INTERMEDIO' };
        if (n.includes('jonin') || n.includes('alto') || n.includes('maestro')) return { color: 'text-emerald-500', shadow: 'shadow-emerald-500/20', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', label: 'AVANZADO' };
        return { color: 'text-[#0A3D62]', shadow: 'shadow-[#0A3D62]/20', border: 'border-[#0A3D62]/30', bg: 'bg-[#0A3D62]/10', bar: 'bg-[#0A3D62]', label: 'EXPERTO' };
    };

    const obtenerUrlImagen = (ruta) => {
        if (!ruta) return null;
        if (ruta.startsWith('http')) return ruta;
        return `${BACKEND_URL}${ruta.startsWith('/') ? '' : '/'}${ruta}`;
    };

    const insigniasHeredadasDetalle = (datos?.insignias_obtenidas || []).map(obtenida => {
        return datos?.todas_insignias?.find(i => i.id_insignia === obtenida.id_insignia);
    }).filter(Boolean);

    const avanzarOnboarding = () => {
        if (pasoOnboarding < insigniasHeredadasDetalle.length) {
            setPasoOnboarding(pasoOnboarding + 1);
        } else {
            cerrarOnboarding();
        }
    };

    const cerrarOnboarding = () => {
        setOnboardingActive(false);
        window.history.replaceState({}, document.title);
    };

    const isActivePath = (path) => location.pathname === path;

    if (loading) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            <img src="/pensando.png" alt="Cargando" className="w-32 h-32 object-contain animate-bounce mb-4" />
            <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Cargando tu progreso...</div>
        </div>
    );

    const configGlobal = getEstiloNivel(datos?.estadisticas?.rango_actual);
    const puntajeIA = datos?.estadisticas?.puntaje || 0;
    const misionesCompletas = datos?.estadisticas?.modulos_completados || 0;
    const totalMisiones = datos?.estadisticas?.total_misiones || 1;

    const efectividadInicial = Math.round((puntajeIA / 13) * 100);
    const efectividadActual = Math.round((misionesCompletas / totalMisiones) * 100);
    const heightInicial = Math.max(efectividadInicial, 2);
    const heightActual = Math.max(efectividadActual, 2);

    const rutaUnica = datos?.ruta_ia_asignada?.filter((modulo, index, self) =>
        index === self.findIndex((m) => m.id_modulo === modulo.id_modulo)
    ) || [];

    // 🚩 NUEVO 1: Lógica para determinar el siguiente rango (Gamificación)
    const getNextRank = (currentRank) => {
        const r = currentRank?.toLowerCase() || '';
        if (r.includes('genin') || r.includes('básico') || r.includes('iniciado')) return 'Chunin (Guerrero)';
        if (r.includes('chunin') || r.includes('intermedio') || r.includes('guerrero')) return 'Jonin (Maestro)';
        if (r.includes('jonin') || r.includes('avanzado') || r.includes('maestro')) return 'Kage (Leyenda)';
        return 'Experto';
    };
    const siguienteRango = getNextRank(datos?.estadisticas?.rango_actual);

    // 🚩 NUEVO 2: Detectar el módulo en el que el estudiante se quedó (Quick Resume)
    const moduloEnProgreso = rutaUnica.find(m => m.porcentaje_avance > 0 && m.porcentaje_avance < 100) || rutaUnica.find(m => m.porcentaje_avance === 0) || rutaUnica[0];

    const navItems = [
        { label: 'INICIO', path: '/estudiante/dashboard', icon: '📊' },
        { label: 'PERFIL', path: '/estudiante/perfil', icon: '👤' },
        { label: 'BIBLIOTECA', path: '/estudiante/biblioteca', icon: '📚' },
        { label: 'RANKING', path: '/estudiante/ranking', icon: '🏆' },
        { label: 'FORO', path: '/estudiante/foro', icon: '👥' },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans overflow-hidden selection:bg-[#FBE000]/30">

            {/* 🚩 MODAL DE ONBOARDING */}
            <AnimatePresence>
                {onboardingActivo && datos && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white border border-[#FBE000] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
                        >
                            {pasoOnboarding === 0 ? (
                                <div className="space-y-6">
                                    <img src="/motivacion.png" alt="Mascota" className="w-28 h-28 mx-auto object-contain animate-bounce" />
                                    <h2 className="text-2xl font-bold text-[#0A3D62]">¡Bienvenido a PMM Interactivo!</h2>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Este es tu panel de control. Aquí encontrarás tu ruta de aprendizaje personalizada, estadísticas de avance y recomendaciones para mejorar.
                                    </p>
                                    <button
                                        onClick={avanzarOnboarding}
                                        className="w-full bg-[#0A3D62] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#083252] transition-all shadow-lg"
                                    >
                                        {insigniasHeredadasDetalle.length > 0 ? 'Ver tus logros iniciales →' : 'Comenzar mi Aventura'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <motion.div
                                        key={pasoOnboarding}
                                        initial={{ rotateY: 90, opacity: 0 }}
                                        animate={{ rotateY: 0, opacity: 1 }}
                                        transition={{ type: "spring", duration: 0.8 }}
                                        className="w-24 h-24 mx-auto bg-slate-100 border-4 border-[#FBE000] rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <img src="/logro.png" alt="Nuevo nivel" className="w-16 h-16 object-contain" />
                                    </motion.div>

                                    <h2 className="text-xl font-bold text-[#0A3D62]">
                                        {insigniasHeredadasDetalle[pasoOnboarding - 1]?.nombre_insignia}
                                    </h2>
                                    <p className="text-xs text-slate-500 italic px-4 min-h-[40px]">
                                        "{insigniasHeredadasDetalle[pasoOnboarding - 1]?.descripcion}"
                                    </p>

                                    <button
                                        onClick={avanzarOnboarding}
                                        className="w-full bg-[#FBE000] text-[#0A3D62] font-bold py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-md"
                                    >
                                        {pasoOnboarding < insigniasHeredadasDetalle.length ? 'Ver siguiente logro' : 'Ir al Inicio'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 🚩 ASIDE / SIDEBAR (DESKTOP) */}
            <aside
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white border-r border-slate-200 flex flex-col p-6 hidden md:flex z-50 
                ${isExpanded ? 'w-72 shadow-2xl' : 'w-24'}`}
            >
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setMostrarModalLogout(true);
                    }}
                    className="mb-8 group flex items-center gap-4 p-3 text-red-500/60 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase font-bold text-[10px] tracking-widest w-full"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
                    <span className={`${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} transition-all duration-500 whitespace-nowrap`}>
                        CERRAR SESIÓN
                    </span>
                </button>

                <div className="mb-12 text-center relative">
                    <div
                        onClick={() => navigate('/estudiante/perfil')}
                        className={`transition-all duration-500 rounded-2xl mx-auto mb-4 border-2 flex items-center justify-center cursor-pointer relative bg-slate-100 overflow-hidden 
                        ${configGlobal.border} ${isExpanded ? 'w-16 h-16 rotate-[360deg]' : 'w-12 h-12'}`}
                    >
                        {fotoPerfil ? (
                            <img src={obtenerUrlImagen(fotoPerfil)} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className={`font-bold transition-all ${isExpanded ? 'text-2xl' : 'text-lg'} ${configGlobal.color}`}>
                                {nombreUsuario.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <p className={`text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-500 
                        ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'} ${configGlobal.color}`}>
                        {configGlobal.label}
                    </p>
                </div>

                <nav className="flex-1 space-y-4">
                    {navItems.map((item) => {
                        const isActive = isActivePath(item.path);
                        return (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                                    isActive ? 'bg-[#FBE000]/10 border border-[#FBE000]' : 'hover:bg-slate-50'
                                }`}
                            >
                                <span className="text-xl group-hover:scale-125 transition-transform">{item.icon}</span>
                                <span className={`font-bold text-[10px] tracking-widest transition-all duration-500 whitespace-nowrap
                                    ${isActive ? 'text-[#0A3D62]' : ''}
                                    ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* 🚩 NAVEGACIÓN MÓVIL (BOTTOM BAR) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-slate-200 flex justify-around p-2 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => {
                    const isActive = isActivePath(item.path);
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                                isActive ? 'text-[#0A3D62] bg-[#FBE000]/20 scale-105' : 'text-slate-400 hover:text-[#0A3D62]'
                            }`}
                            aria-label={item.label}
                        >
                            <span className="text-xl mb-0.5">{item.icon}</span>
                            <span className="text-[8px] font-black tracking-widest uppercase">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* 🚩 CONTENIDO PRINCIPAL */}
            <main className="flex-1 p-5 md:p-10 lg:p-16 overflow-y-auto relative pb-28 md:pb-16">
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-1/2 bg-[#FBE000]/10 blur-[100px] rounded-full -z-10"></div>

                <header className="mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 relative flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="pr-24 md:pr-0">
                        <div className="flex items-center gap-3 md:gap-4 mb-2">
                            <div className={`h-[2px] w-8 md:w-12 ${configGlobal.bar}`}></div>
                            <span className="text-[#0A3D62] font-bold text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-70">Nivel: {configGlobal.label}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tighter leading-tight">
                            ¡Hola, <span className={`${configGlobal.color}`}>{nombreUsuario}</span>! 👋
                        </h1>
                        
                        {/* 🚩 MEJORA 1: Barra de Progreso hacia el Siguiente Rango (Heurística #1 y Gamificación) */}
                        <div className="mt-4 max-w-md">
                            <div className="flex justify-between items-end mb-1.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Progreso hacia <span className="text-[#0A3D62] font-black">{siguienteRango}</span>
                                </span>
                                <span className="text-[10px] font-black text-[#0A3D62]">{misionesCompletas} / {totalMisiones} Módulos</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${Math.min(100, Math.round((misionesCompletas / Math.max(totalMisiones, 1)) * 100))}%` }} 
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-[#FBE000] to-[#0A3D62] rounded-full" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 md:relative flex items-center gap-2 md:gap-4 z-50">
                        <div className="bg-white rounded-full border border-slate-200 shadow-lg p-1">
                            <CampanaNotificaciones />
                        </div>
                        <button
                            onClick={() => setMostrarModalLogout(true)}
                            className="md:hidden flex flex-col items-center justify-center text-red-500/60 hover:text-red-500 transition-all active:scale-95 bg-red-50 w-10 h-10 rounded-xl border border-red-100"
                        >
                            <span className="text-xl leading-none">🚪</span>
                        </button>
                    </div>
                </header>

                {/* 🚩 SECCIÓN 1: SUGERENCIA IA */}
                <div className="mb-8 md:mb-10">
                    {loadingIA ? (
                        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl animate-pulse flex flex-col md:flex-row items-center gap-6">
                            <img src="/MASCOTA CABEZA.png" alt="IA pensando" className="w-20 h-20 object-contain" />
                            <div className="flex-1 w-full space-y-3">
                                <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                                <div className="h-4 w-full bg-slate-100 rounded"></div>
                            </div>
                        </div>
                    ) : sugerenciaIA && sugerenciaIA.tema && (
                        <div className={`bg-white border p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl transition-all duration-500
                            ${sugerenciaIA.nivel_alerta === 'critico' ? 'border-red-200' : 'border-[#FBE000]'}`}>
                            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 relative z-10">
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border flex items-center justify-center flex-shrink-0
                                    ${sugerenciaIA.nivel_alerta === 'critico' ? 'bg-red-50 border-red-200' : 'bg-[#FBE000]/10 border-[#FBE000]'}`}>
                                    <img src="/MASCOTA CABEZA.png" alt="Idea IA" className="w-12 h-12 object-contain" />
                                </div>
                                <div className="flex-1 text-center lg:text-left w-full">
                                    <h4 className={`font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 ${sugerenciaIA.nivel_alerta === 'critico' ? 'text-red-500' : 'text-[#0A3D62]'}`}>
                                        {sugerenciaIA.nivel_alerta === 'critico' ? 'Oportunidad de Mejora' : 'Recomendación del Tutor IA'}
                                    </h4>
                                    <h3 className="text-lg md:text-xl text-slate-900 font-bold mb-2">Tema enfocado: <span className="italic">{sugerenciaIA.tema}</span></h3>
                                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed italic">
                                        "{sugerenciaIA.mensaje}"
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(sugerenciaIA.nivel_alerta === 'critico' ? '/estudiante/historial-errores' : '/estudiante/biblioteca')}
                                    className={`w-full lg:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap shadow-lg
                                        ${sugerenciaIA.nivel_alerta === 'critico' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#0A3D62] text-white hover:bg-[#083252]'}`}
                                >
                                    {sugerenciaIA.accion}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 🚩 MEJORA 2: Tarjeta "Retoma tu Racha" (Quick Resume - Heurísticas #6 y #7) */}
                {moduloEnProgreso && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 md:mb-10 bg-gradient-to-r from-[#0A3D62] to-[#2E5AAC] p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                        onClick={() => navigate(`/estudiante/modulo/${moduloEnProgreso.id_modulo}`)}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FBE000] mb-1">🚀 Retoma tu racha</p>
                                <h3 className="text-xl md:text-2xl font-bold mb-2">{moduloEnProgreso.nombre_modulo}</h3>
                                <p className="text-sm text-white/80">Estabas en el {moduloEnProgreso.porcentaje_avance}% de completado. ¡No pierdas el impulso!</p>
                            </div>
                            <button className="bg-[#FBE000] text-[#0A3D62] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md flex items-center gap-2 flex-shrink-0 active:scale-95">
                                Continuar <span>→</span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* 🚩 SECCIÓN 2: LOGROS ACADÉMICOS */}
                <div className="mb-8 md:mb-10 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-xl relative">
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6 md:mb-8 relative z-10 gap-4 text-center sm:text-left">
                        <div>
                            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest">Panel de Logros</h3>
                            <p className="text-[9px] text-slate-400 uppercase mt-1 tracking-widest font-bold">Tu progreso en la plataforma</p>
                        </div>
                        <div className="bg-[#FBE000]/10 px-4 py-2 rounded-full border border-[#FBE000]">
                            <span className="text-[#0A3D62] font-bold text-[9px] md:text-[10px] tracking-widest">
                                {datos?.insignias_obtenidas?.length || 0} / {datos?.todas_insignias?.length || 0} OBTENIDOS
                            </span>
                        </div>
                    </div>

                    <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x pb-4 md:pb-0 scrollbar-hide">
                        {datos?.todas_insignias?.map((insignia) => {
                            const ganada = datos?.insignias_obtenidas?.some(i => i.id_insignia === insignia.id_insignia);
                            return (
                                <div key={insignia.id_insignia} className="group relative flex flex-col items-center snap-center shrink-0 w-20 md:w-auto">
                                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 
                                        ${ganada
                                            ? 'border-[#FBE000] bg-[#FBE000]/10 shadow-lg shadow-[#FBE000]/20'
                                            : 'border-slate-200 bg-slate-50 opacity-50 grayscale'}`}>
                                        <span className="text-2xl md:text-3xl filter drop-shadow-sm">
                                            {ganada ? '🏅' : '🔒'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-600 text-center mt-2 line-clamp-2 md:hidden">
                                        {insignia.nombre_insignia}
                                    </p>
                                    <div className="hidden md:block mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-center absolute -bottom-16 bg-slate-900 p-3 rounded-xl border border-[#FBE000]/30 shadow-2xl z-50 pointer-events-none w-32">
                                        <p className="text-[9px] font-black uppercase text-[#FBE000] leading-tight">{insignia.nombre_insignia}</p>
                                        <p className="text-[8px] text-slate-300 uppercase mt-1 leading-tight">{insignia.descripcion}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 🚩 SECCIÓN 3: ESTADÍSTICAS RÁPIDAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10 md:mb-12">
                    <div className="bg-white border border-slate-200 rounded-3xl relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md border-t-4 border-t-red-500">
                        <div className="p-5 md:p-6 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-2">
                                    <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold">Racha de Estudio</p>
                                    <InfoTooltip text="Mide los días consecutivos que has ingresado a la plataforma. ¡Mantenerla activa demuestra tu compromiso!" />
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-red-500 leading-none mb-1">
                                    {datos?.estadisticas?.racha_dias || 0}
                                </p>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium">Días consecutivos</p>
                            </div>
                            <div className="flex-shrink-0">
                                <img src="/robot con llama.png" alt="Racha" className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md border-t-4 border-t-[#2E5AAC]">
                        <div className="p-5 md:p-6 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-2">
                                    <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold">Desempeño Inicial</p>
                                    <InfoTooltip text="Porcentaje de aciertos obtenido en tu examen diagnóstico de 13 preguntas." />
                                </div>
                                <p className={`text-3xl md:text-4xl font-black leading-none mb-1 ${configGlobal.color}`}>
                                    {efectividadInicial}%
                                </p>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium">Puntaje diagnóstico</p>
                            </div>
                            <div className="flex-shrink-0">
                                <img src="/pensando.png" alt="Diagnóstico" className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md border-t-4 border-t-emerald-500">
                        <div className="p-5 md:p-6 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Nivel Actual</p>
                                <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none mb-1 truncate">
                                    {configGlobal.label}
                                </p>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium">Rango académico</p>
                            </div>
                            <div className="flex-shrink-0">
                                <img src="/mascota.png" alt="Nivel" className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md border-t-4 border-t-[#0A3D62]">
                        <div className="p-5 md:p-6 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Progreso Total</p>
                                <p className="text-3xl md:text-4xl font-black text-[#0A3D62] leading-none mb-1">
                                    {misionesCompletas}
                                    <span className="text-slate-300 text-xl md:text-2xl font-bold ml-1">/{datos?.estadisticas?.total_misiones}</span>
                                </p>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium">Módulos completados</p>
                            </div>
                            <div className="flex-shrink-0">
                                <img src="/subir nivel robot.png" alt="Progreso" className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🚩 SECCIÓN 4: ANÁLISIS DE EVOLUCIÓN */}
                <div className="mb-10 md:mb-16 bg-white border border-slate-200 p-6 md:p-10 rounded-3xl shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:justify-between mb-10 gap-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Análisis de Evolución</h3>
                            <InfoTooltip text="Comparación entre tu puntaje inicial en el diagnóstico y tu rendimiento actual basado en los módulos completados." />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <span className={`w-2 h-2 rounded-full ${efectividadActual >= efectividadInicial ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span className="text-sm font-semibold text-slate-700">
                                {efectividadActual >= efectividadInicial ? 'Tendencia positiva' : 'Rendimiento estable'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-end">
                        <div className="flex-1 w-full relative h-64 md:h-72 flex items-end justify-center gap-16 md:gap-24 border-b border-slate-200 pb-2">
                            <div className="absolute inset-0 z-0">
                                {[100, 75, 50, 25, 0].map(val => (
                                    <div key={val} className="absolute w-full border-t border-slate-100" style={{ bottom: `${val}%` }}>
                                        <span className="absolute -right-8 text-[10px] font-medium text-slate-400 hidden lg:block">
                                            {val}%
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="relative z-10 w-20 md:w-28 h-full flex flex-col justify-end items-center">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightInicial}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="w-full bg-slate-200 rounded-t-lg relative"
                                >
                                    <span className="absolute -top-6 left-0 w-full text-center text-xs font-semibold text-slate-500">
                                        {efectividadInicial}%
                                    </span>
                                </motion.div>
                                <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Inicial</p>
                            </div>

                            <div className="relative z-10 w-20 md:w-28 h-full flex flex-col justify-end items-center">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightActual}%` }}
                                    transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
                                    className="w-full bg-[#0A3D62] rounded-t-lg relative"
                                >
                                    <span className="absolute -top-6 left-0 w-full text-center text-sm font-bold text-[#0A3D62]">
                                        {efectividadActual}%
                                    </span>
                                </motion.div>
                                <p className="mt-4 text-xs font-bold text-[#0A3D62] uppercase tracking-wide">Actual</p>
                            </div>
                        </div>

                        <div className="w-full lg:w-80 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-10">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-[#0A3D62]/5 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0A3D62]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resumen de Progreso</span>
                            </div>
                            
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                Has completado <span className="font-bold text-slate-900">{misionesCompletas}</span> módulos. Tu dominio del tema ha evolucionado de manera consistente.
                            </p>
                            
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <div className="flex justify-between items-baseline mb-3">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Incremento neto</span>
                                    <span className={`text-3xl font-black ${configGlobal.color}`}>
                                        +{Math.max(0, efectividadActual - efectividadInicial)}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${configGlobal.bar} transition-all duration-1000 ease-out`} 
                                        style={{ width: `${Math.min(100, Math.max(0, (efectividadActual - efectividadInicial) * 1.5))}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🚩 SECCIÓN 5: BITÁCORA DE ERRORES */}
                {errores.length > 0 && (
                    <div className="mb-8 md:mb-10 bg-orange-50 border border-orange-200 p-5 md:p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <img src="/idea.png" alt="Sugerencia de mejora" className="w-16 h-16 object-contain" />
                            <div>
                                <h4 className="text-[#0A3D62] font-bold text-[10px] md:text-xs uppercase tracking-widest">Oportunidades de Refuerzo</h4>
                                <p className="text-[9px] md:text-[11px] text-slate-600 mt-1">
                                    Hemos detectado <span className="font-bold text-[#0A3D62]">{errores.length}</span> temas donde puedes reforzar tu conocimiento. ¡Tú puedes!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/estudiante/historial-errores')}
                            className="w-full md:w-auto bg-[#0A3D62] hover:bg-[#083252] text-white px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>Repasar Temas</span>
                            <span>→</span>
                        </button>
                    </div>
                )}

                {/* 🚩 SECCIÓN 6: RUTA DE APRENDIZAJE */}
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h3 className="font-bold text-xs md:text-sm text-slate-900 uppercase tracking-widest">Ruta de Aprendizaje</h3>
                    <div className="h-px flex-1 mx-4 md:mx-8 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                    {rutaUnica.map((modulo, index) => {
                        const estiloModulo = getEstiloNivel(modulo.nivel);
                        const misionBloqueada = index > 0 && (rutaUnica[index - 1].porcentaje_avance < 100);

                        return (
                            <div
                                key={modulo.id_modulo}
                                onClick={() => !misionBloqueada && navigate(`/estudiante/modulo/${modulo.id_modulo}`)}
                                className={`group relative p-6 md:p-8 rounded-3xl transition-all duration-500 shadow-lg overflow-hidden border
                                    ${misionBloqueada
                                        ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60 grayscale'
                                        : 'bg-white border-slate-200 cursor-pointer hover:bg-slate-50 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-2xl'}`}
                            >
                                {misionBloqueada && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[1px]">
                                        <span className="text-2xl md:text-3xl mb-2">🔒</span>
                                        <p className="text-[8px] md:text-[10px] font-bold text-red-400 tracking-[0.2em] uppercase">Completa el módulo anterior</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4 md:mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[8px] md:text-[9px] text-slate-400 font-bold tracking-widest uppercase">Módulo {index + 1}</span>
                                            <span className={`text-[6px] md:text-[7px] px-2 py-0.5 rounded-full border font-bold ${estiloModulo.border} ${estiloModulo.color} bg-slate-50`}>
                                                {estiloModulo.label}
                                            </span>
                                        </div>
                                        <h4 className="text-lg md:text-2xl font-bold text-slate-900 group-hover:text-[#0A3D62] transition-colors tracking-tight">{modulo.nombre_modulo}</h4>
                                    </div>
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center font-bold text-[10px] md:text-xs transition-all duration-500 flex-shrink-0 ml-2
                                        ${modulo.porcentaje_avance === 100 ? 'bg-emerald-50 text-emerald-500 border-emerald-200' : 'text-slate-400'}`}>
                                        {modulo.porcentaje_avance === 100 ? '✓' : index + 1}
                                    </div>
                                </div>

                                <p className="text-[10px] md:text-xs text-slate-500 mb-6 md:mb-10 leading-relaxed line-clamp-2 italic">
                                    {modulo.descripcion || "Contenido académico disponible para este módulo..."}
                                </p>

                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Progreso</span>
                                        <span className={`text-[10px] md:text-xs font-bold ${estiloModulo.color}`}>{modulo.porcentaje_avance || 0}%</span>
                                    </div>
                                    <div className="h-1.5 md:h-2 w-full bg-slate-100 rounded-full p-[1px] md:p-[2px]">
                                        <div
                                            className={`h-full rounded-full transition-all duration-[1.5s] ease-out relative ${estiloModulo.bar} ${estiloModulo.shadow}`}
                                            style={{ width: `${modulo.porcentaje_avance || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {!misionBloqueada && (
                                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        <span className={`text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase ${estiloModulo.color}`}>Ingresar al Módulo</span>
                                        <span className="text-lg md:text-xl">📚</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* 🚩 MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN */}
            <AnimatePresence>
                {mostrarModalLogout && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl max-w-md w-full text-center shadow-2xl border-t-4 border-t-[#FBE000]"
                        >
                            <img src="/idea.png" alt="Confirmar salida" className="w-20 h-20 object-contain mx-auto mb-4 opacity-80" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">¿Deseas cerrar sesión?</h3>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                Tu progreso está guardado de forma segura. ¿Estás seguro de que deseas salir de la plataforma?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => setMostrarModalLogout(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all text-sm uppercase tracking-wider"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={() => {
                                        localStorage.clear();
                                        navigate('/');
                                    }}
                                    className="flex-1 bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-100 transition-all text-sm uppercase tracking-wider"
                                >
                                    Sí, cerrar sesión
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default DashboardEstudiante;