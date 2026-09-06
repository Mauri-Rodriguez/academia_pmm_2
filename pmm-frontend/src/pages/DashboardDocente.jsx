import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Activity, ChevronRight, Loader2, FileDown, RefreshCw, LogOut, LayoutDashboard } from 'lucide-react';
import api from '../api/api';

const DashboardDocente = () => {
    const navigate = useNavigate();
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [descargando, setDescargando] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroNivel, setFiltroNivel] = useState('');
    
    // 🚩 Estados para modales (Bienvenida y Salida Segura)
    const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
    const [mostrarModalSalida, setMostrarModalSalida] = useState(false);

    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
    const nombreUsuario = usuarioGuardado.nombre_completo || 'Docente';

    useEffect(() => {
        const yaVioBienvenida = localStorage.getItem('docente_onboarding_visto');
        if (!yaVioBienvenida) {
            setMostrarBienvenida(true);
        }
    }, []);

    const cerrarBienvenida = () => {
        setMostrarBienvenida(false);
        localStorage.setItem('docente_onboarding_visto', 'true');
    };

    const traerDatos = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/docente/resumen-estudiantes');
            setEstudiantes(res.data.reporte || []);
        } catch (error) {
            console.error("❌ Error en la red de monitoreo:", error);
            if (error.response?.status === 403) navigate('/');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        traerDatos();
    }, [traerDatos]);

    const descargarExcel = async () => {
        try {
            setDescargando(true);
            const response = await api.get('/api/docente/descargar-excel', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Reporte_PMM_${new Date().toLocaleDateString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("❌ Error en extracción de datos:", error);
        } finally {
            setDescargando(false);
        }
    };

    const evaluarConexion = (fechaISO, estado) => {
        if (estado === 'Inactivo') {
            return { texto: 'Inactivo', estilo: 'border-rose-500/30 text-rose-600 bg-rose-50', dot: 'bg-rose-500' };
        }
        if (!fechaISO) {
            return { texto: 'Sin Registro', estilo: 'border-slate-500/30 text-slate-600 bg-slate-50', dot: 'bg-slate-500' };
        }
        try {
            const hoyStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
            const fechaValida = fechaISO.includes('T') ? fechaISO : fechaISO.replace(' ', 'T') + 'Z';
            const ultimaConexion = new Date(fechaValida);
            const ultimaStr = ultimaConexion.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });

            if (hoyStr === ultimaStr) {
                return { texto: 'Activo', estilo: 'border-emerald-500/30 text-emerald-600 bg-emerald-50', dot: 'bg-emerald-500 animate-pulse' };
            }
            const utcHoy = new Date(`${hoyStr}T00:00:00Z`);
            const utcUltima = new Date(`${ultimaStr}T00:00:00Z`);
            const diferenciaDias = Math.round((utcHoy - utcUltima) / (1000 * 60 * 60 * 24));

            if (diferenciaDias <= 0) {
                 return { texto: 'Activo', estilo: 'border-emerald-500/30 text-emerald-600 bg-emerald-50', dot: 'bg-emerald-500 animate-pulse' };
            } else if (diferenciaDias > 0 && diferenciaDias <= 3) {
                return { texto: `Hace ${diferenciaDias}d`, estilo: 'border-amber-500/30 text-amber-600 bg-amber-50', dot: 'bg-amber-500' };
            } else {
                return { texto: `Inactivo ${diferenciaDias}d`, estilo: 'border-rose-500/30 text-rose-600 bg-rose-50', dot: 'bg-rose-500' };
            }
        } catch (e) {
            return { texto: 'Error Fecha', estilo: 'border-slate-500/30 text-slate-600 bg-slate-50', dot: 'bg-slate-500' };
        }
    };

    const estudiantesFiltrados = estudiantes.filter(est => {
        const nombre = est.nombre?.toLowerCase() || '';
        const rango = est.rango_ia_asignado?.toLowerCase() || '';
        const coincideBusqueda = nombre.includes(busqueda.toLowerCase());
        const coincideNivel = filtroNivel === '' || rango.includes(filtroNivel.toLowerCase());
        return coincideBusqueda && coincideNivel;
    });

    const alertasDesercion = estudiantes.filter(est => {
        const conexion = evaluarConexion(est.ultima_conexion, est.estado);
        return conexion.texto.includes('Inactivo');
    }).length;

    const calcularEfectividadPromedio = () => {
        if (!estudiantes || estudiantes.length === 0) return "0.0%";
        const sumaAvance = estudiantes.reduce((acumulador, est) => {
            const avanceStr = (est.avance_promedio || '0').toString().replace('%', '');
            const avanceNum = parseFloat(avanceStr) || 0;
            return acumulador + avanceNum;
        }, 0);
        const promedio = sumaAvance / estudiantes.length;
        return `${promedio.toFixed(1)}%`;
    };

    const efectividadPromedio = calcularEfectividadPromedio();

    if (loading) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            <img src="/pensando.png" alt="Cargando datos" className="w-32 h-32 object-contain animate-bounce mb-4" />
            <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Cargando censo de estudiantes...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans selection:bg-[#FBE000]/30 relative">
            
            {/* 🚩 MODAL DE BIENVENIDA (Heurística #10: Ayuda y documentación) */}
            <AnimatePresence>
                {mostrarBienvenida && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl border-t-4 border-t-[#FBE000]"
                        >
                            <div className="flex justify-center mb-6">
                                <img src="/mascota.png" alt="Bienvenida" className="w-24 h-24 object-contain drop-shadow-lg" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold text-[#0A3D62] text-center mb-4 uppercase tracking-tight">
                                ¡Bienvenido, Docente {nombreUsuario.split(' ')[0]}!
                            </h3>
                            <div className="space-y-4 text-sm text-slate-600 leading-relaxed mb-8">
                                <p>Este es tu <strong>Panel de Control Docente</strong>. Desde aquí puedes:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#FBE000] text-lg">★</span>
                                        <span>Monitorear el <strong>progreso académico</strong> y el rango de cada estudiante en tiempo real.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#FBE000] text-lg">★</span>
                                        <span>Identificar <strong>alertas de deserción</strong> (estudiantes inactivos por más de 3 días).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#FBE000] text-lg">★</span>
                                        <span>Usar el buscador o filtros para encontrar expedientes específicos rápidamente.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#FBE000] text-lg">★</span>
                                        <span><strong>Exportar reportes</strong> en Excel para análisis externos.</span>
                                    </li>
                                </ul>
                            </div>
                            <button 
                                onClick={cerrarBienvenida}
                                className="w-full bg-[#0A3D62] text-white font-bold py-3.5 rounded-xl hover:bg-[#083252] transition-all uppercase text-xs tracking-widest shadow-md active:scale-95"
                            >
                                Entendido, comenzar a monitorear
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 🚩 MODAL DE CONFIRMACIÓN DE SALIDA (Heurística #3: Control y libertad) */}
            <AnimatePresence>
                {mostrarModalSalida && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl max-w-md w-full text-center shadow-2xl border-t-4 border-t-[#FBE000]"
                        >
                            <img src="/idea.png" alt="Confirmar salida" className="w-20 h-20 object-contain mx-auto mb-4 opacity-80" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">¿Deseas salir del Panel Docente?</h3>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                Tu progreso y los reportes generados se guardan automáticamente. ¿Estás seguro de que deseas finalizar tu jornada?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => setMostrarModalSalida(false)}
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
                                    Sí, salir del Panel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 🚩 SIDEBAR INSTITUCIONAL (Solo Desktop) */}
            <aside 
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white border-r border-slate-200 flex flex-col p-6 hidden lg:flex z-50 
                ${isExpanded ? 'w-72 shadow-2xl' : 'w-24'}`}
            >
                <div className="mb-12 flex flex-col items-center relative">
                    <div className={`transition-all duration-500 rounded-2xl mb-4 border-2 flex items-center justify-center bg-slate-100 border-[#0A3D62]/20 ${isExpanded ? 'w-16 h-16' : 'w-12 h-12'}`}>
                        <span className="font-bold text-[#0A3D62] text-2xl">{nombreUsuario.charAt(0)}</span>
                    </div>
                    {isExpanded && (
                        <div className="text-center animate-in fade-in duration-500">
                            <h3 className="text-[#0A3D62] font-bold text-xs uppercase tracking-widest">{nombreUsuario}</h3>
                            <p className="text-[9px] font-black text-[#FBE000] mt-1 tracking-[0.3em]">DOCENTE / TUTOR</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 space-y-4">
                    <button onClick={() => navigate('/docente/dashboard')} className="flex items-center gap-4 w-full p-3 rounded-xl bg-[#FBE000]/10 text-[#0A3D62] border border-[#FBE000] transition-all">
                        <Activity size={20} />
                        {isExpanded && <span className="text-[10px] font-bold tracking-widest uppercase">Monitoreo Global</span>}
                    </button>
                </nav>

                {/* 🚩 Botón de salida con terminología correcta (Heurística #2) */}
                <button 
                    onClick={() => setMostrarModalSalida(true)} 
                    className="mt-auto flex items-center gap-4 p-3 text-red-500/60 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase font-bold text-[10px] tracking-widest"
                >
                    <LogOut size={18} />
                    {isExpanded && <span>Salir del Panel</span>}
                </button>
            </aside>

            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto relative pb-24 lg:pb-12">
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-1/2 bg-[#FBE000]/10 blur-[120px] rounded-full -z-10"></div>
                
                {/* 🚩 HEADER CON MASCOTA Y BOTÓN MÓVIL */}
                <header className="mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <img src="/mascota.png" alt="Mascota PMM" className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-lg hidden sm:block" />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-[2px] w-8 bg-[#FBE000]"></div>
                                    <span className="text-[#0A3D62] font-bold text-[10px] tracking-[0.3em] uppercase opacity-80">Panel de Control Docente</span>
                                </div>
                                <h1 className="text-2xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight">
                                    Monitoreo de <span className="text-[#0A3D62]">Estudiantes</span>
                                </h1>
                                <p className="mt-2 text-slate-500 text-xs md:text-base font-medium">
                                    Supervisa el progreso, la asistencia y el rendimiento académico en tiempo real.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            {/* 🚩 Botón de Salida visible SOLO en móvil (Heurística #2 y #3) */}


                            <button onClick={traerDatos} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all group shadow-sm">
                                <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''} text-[#0A3D62] group-hover:text-[#2E5AAC]`} />
                            </button>
                            <button 
                                onClick={descargarExcel} 
                                disabled={descargando} 
                                className="flex items-center gap-2 md:gap-3 bg-[#0A3D62] text-white px-4 md:px-6 py-3 rounded-xl hover:bg-[#083252] transition-all text-[10px] font-black tracking-widest uppercase disabled:opacity-50 shadow-md"
                            >
                                {descargando ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                                <span className="hidden sm:inline">Exportar Reporte</span>
                                <span className="sm:hidden">Excel</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* 🚩 TARJETAS DE ESTADÍSTICAS CON MASCOTAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                    <div className="bg-white border border-slate-200 p-4 md:p-6 rounded-3xl shadow-xl flex items-center justify-between border-t-4 border-t-[#0A3D62]">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Censo Total</p>
                            <p className="text-2xl md:text-3xl font-black text-[#0A3D62]">{estudiantes.length}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 md:p-6 rounded-3xl shadow-xl flex items-center justify-between border-t-4 border-t-emerald-500">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Efectividad Promedio</p>
                            <p className="text-2xl md:text-3xl font-black text-emerald-600">{efectividadPromedio}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 md:p-6 rounded-3xl shadow-xl flex items-center justify-between border-t-4 border-t-rose-500">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Alerta de Deserción</p>
                            <p className="text-2xl md:text-3xl font-black text-rose-600">{alertasDesercion}</p>
                        </div>
                    </div>
                </div>

                {/* 🚩 FILTROS DE PRECISIÓN */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A3D62] transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar estudiante por nombre..."
                            className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10 transition-all shadow-sm"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <select 
                        className="bg-white border border-slate-200 rounded-xl px-6 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10 cursor-pointer shadow-sm"
                        value={filtroNivel}
                        onChange={(e) => setFiltroNivel(e.target.value)}
                    >
                        <option value="">Filtrar por Rango</option>
                        <option value="Genin">Genin (Iniciado)</option>
                        <option value="Chunin">Chunin (Guerrero)</option>
                        <option value="Jonin">Jonin (Maestro)</option>
                        <option value="Kage">Kage (Leyenda)</option>
                    </select>
                </div>

                {/* 🚩 TABLA DE ALTO IMPACTO (Responsive) */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold border-b border-slate-200">
                                <tr>
                                    <th className="p-3 md:p-6">Estudiante</th>
                                    <th className="p-3 md:p-6">Rango Jerárquico</th>
                                    <th className="p-3 md:p-6 text-center">Progreso Académico</th>
                                    <th className="p-3 md:p-6 text-center">Estado Actividad</th>
                                    <th className="p-3 md:p-6 text-right">Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {estudiantesFiltrados.map((est) => {
                                    const conexion = evaluarConexion(est.ultima_conexion, est.estado);
                                    
                                    return (
                                        <tr key={est.id_estudiante} className="hover:bg-slate-50 transition-colors group">
                                            <td className="p-3 md:p-6">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0A3D62]/10 border border-[#0A3D62]/20 flex items-center justify-center font-bold text-[#0A3D62] text-xs md:text-sm flex-shrink-0">
                                                        {est.nombre?.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-[#0A3D62] transition-colors truncate">{est.nombre}</p>
                                                        <p className="text-[9px] md:text-[10px] text-slate-500 truncate">{est.correo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 md:p-6">
                                                <span className={`text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full border tracking-widest uppercase inline-block ${
                                                    est.rango_ia_asignado?.includes('Kage') ? 'border-[#0A3D62]/30 text-[#0A3D62] bg-[#0A3D62]/10' :
                                                    est.rango_ia_asignado?.includes('Jonin') ? 'border-emerald-500/30 text-emerald-600 bg-emerald-50' :
                                                    est.rango_ia_asignado?.includes('Chunin') ? 'border-amber-500/30 text-amber-600 bg-amber-50' :
                                                    'border-rose-500/30 text-rose-600 bg-rose-50'
                                                }`}>
                                                    {est.rango_ia_asignado || 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="p-3 md:p-6">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <span className="text-[9px] md:text-[10px] font-bold text-slate-700">{est.avance_promedio || '0%'}</span>
                                                    <div className="w-16 md:w-24 h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                        <div 
                                                            className="h-full bg-[#0A3D62] transition-all duration-1000" 
                                                            style={{ width: typeof est.avance_promedio === 'number' ? `${est.avance_promedio}%` : (est.avance_promedio || '0%') }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 md:p-6">
                                                <div className="flex justify-center">
                                                    <span className={`flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[9px] font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full border tracking-widest uppercase ${conexion.estilo}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${conexion.dot}`}></span>
                                                        <span className="hidden sm:inline">{conexion.texto}</span>
                                                        <span className="sm:hidden">{conexion.texto.split(' ')[0]}</span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3 md:p-6 text-right">
                                                <button 
                                                    onClick={() => navigate(`/docente/reporte-estudiante/${est.id_estudiante}`)}
                                                    className="bg-[#0A3D62] hover:bg-[#083252] text-white transition-all text-[8px] md:text-[9px] font-black uppercase tracking-widest py-2 px-3 md:px-5 rounded-xl shadow-sm active:scale-95 flex items-center gap-1 md:gap-2 ml-auto"
                                                >
                                                    <span className="hidden sm:inline">Ver Expediente</span>
                                                    <span className="sm:hidden">Ver</span>
                                                    <ChevronRight size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {estudiantesFiltrados.length === 0 && (
                        <div className="p-8 md:p-16 text-center">
                            <img src="/pensando.png" alt="Sin registros" className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto mb-4 opacity-60" />
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">No se encontraron estudiantes con estos criterios</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 🚩 NAVEGACIÓN MÓVIL (BOTTOM BAR) */}
            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-slate-200 flex justify-around p-2 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => navigate('/docente/dashboard')}
                    className="flex flex-col items-center p-2 rounded-xl transition-all duration-300 text-[#0A3D62] bg-[#FBE000]/20 scale-105"
                    aria-label="Monitoreo"
                >
                    <LayoutDashboard className="text-xl mb-0.5" size={20} />
                    <span className="text-[8px] font-black tracking-widest uppercase">Monitoreo</span>
                </button>
                {/* 🚩 Botón de salida móvil con terminología correcta */}
                <button
                    onClick={() => setMostrarModalSalida(true)}
                    className="flex flex-col items-center p-2 rounded-xl transition-all duration-300 text-red-500 hover:bg-red-50"
                    aria-label="Salir del Panel"
                >
                    <LogOut className="text-xl mb-0.5" size={20} />
                    <span className="text-[8px] font-black tracking-widest uppercase">Salir</span>
                </button>
            </nav>
        </div>
    );
};

export default DashboardDocente;