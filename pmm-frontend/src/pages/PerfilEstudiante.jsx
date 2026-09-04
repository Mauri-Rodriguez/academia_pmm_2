import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api, { BACKEND_URL } from '../api/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

// 🚩 HELPER: Tooltip de Ayuda Contextual (Heurística #10)
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

const PerfilEstudiante = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [subiendoFoto, setSubiendoFoto] = useState(false);

    const generarColorAvatar = (nombre = "Estudiante") => {
        const colores = ['#0A3D62', '#2E5AAC', '#FBE000', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
        let hash = 0;
        for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
        return colores[Math.abs(hash) % colores.length];
    };

    const obtenerUrlImagen = (ruta) => {
        if (!ruta) return null;
        if (ruta.startsWith('http')) return ruta;
        return `${BACKEND_URL}${ruta.startsWith('/') ? '' : '/'}${ruta}`;
    };

    useEffect(() => {
        const inicializarPerfil = async () => {
            try {
                const [resUser, resDash] = await Promise.all([
                    api.get('/api/estudiante/perfil/datos').catch(() => ({ data: {} })),
                    api.get('/api/estudiante/dashboard').catch(() => ({ data: {} }))
                ]);

                const dashStats = resDash.data?.estadisticas || {};
                const puntajeIA = dashStats.puntaje || 0;
                const efectividadReal = Math.round((puntajeIA / 13) * 100) || 0;
                const misionesCompletas = dashStats.modulos_completados || 0;

                setDatos({
                    nombre_completo: resUser.data?.nombre_completo || resUser.data?.nombre || localStorage.getItem('user_name') || 'Estudiante',
                    correo: resUser.data?.correo || resUser.data?.email || localStorage.getItem('user_email') || 'correo@academia.edu',
                    rango_actual: dashStats.rango_actual || 'Genin (Iniciado)',
                    puntaje_total: puntajeIA,
                    ejercicios_completados: misionesCompletas,
                    efectividad: efectividadReal,
                    racha_dias: dashStats.racha_dias || 0,
                    insignias_obtenidas: resDash.data?.insignias_obtenidas || [],
                    todas_insignias: resDash.data?.todas_insignias || [],
                    // 🚩 CORRECCIÓN: Guardamos la ruta para calcular el progreso real por tema
                    ruta_ia_asignada: resDash.data?.ruta_ia_asignada || [] 
                });

                if (resUser.data?.foto_perfil) {
                    setFotoPerfil(resUser.data.foto_perfil);
                    localStorage.setItem('user_avatar', resUser.data.foto_perfil);
                } else if (localStorage.getItem('user_avatar')) {
                    setFotoPerfil(localStorage.getItem('user_avatar'));
                }

            } catch (err) {
                console.error("Error crítico de red al inicializar perfil:", err);
            } finally {
                setLoading(false);
            }
        };
        inicializarPerfil();
    }, []);

    const handleSubirFoto = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const formData = new FormData();
        formData.append('avatar', archivo);
        setSubiendoFoto(true);

        try {
            const res = await api.post('/api/estudiante/perfil/avatar', formData);
            setFotoPerfil(res.data.url);
            localStorage.setItem('user_avatar', res.data.url);
        } catch (err) {
            console.error(err);
            alert("Error al actualizar la imagen en el servidor.");
        } finally {
            setSubiendoFoto(false);
        }
    };

    if (loading || !datos) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            <img src="/pensando.png" alt="Cargando perfil" className="w-32 h-32 object-contain animate-bounce mb-4" />
            <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Preparando tu perfil...</div>
        </div>
    );

    // 🚩 LÓGICA FRONTEND: Separar insignias ganadas de las pendientes
    const insigniasGanadas = datos.todas_insignias.filter(insignia => 
        datos.insignias_obtenidas.some(i => i.id_insignia === insignia.id_insignia)
    );
    
    const insigniasPendientes = datos.todas_insignias.filter(insignia => 
        !datos.insignias_obtenidas.some(i => i.id_insignia === insignia.id_insignia)
    );

    const siguienteHito = insigniasPendientes.length > 0 ? insigniasPendientes[0] : null;

    // 🚩 CORRECCIÓN TOTAL: DATOS 100% REALES PARA EL RADAR (CERO Math.random)
    const temasRadar = [
        { tema: 'Álgebra', idModulo: 1 },
        { tema: 'Ecuaciones', idModulo: 2 },
        { tema: 'Recta', idModulo: 3 },
        { tema: 'Trigonometría', idModulo: 4 },
        { tema: 'Límites', idModulo: 5 },
        { tema: 'Derivadas', idModulo: 6 },
        { tema: 'Integrales', idModulo: 7 }
    ];

    const datosRadar = temasRadar.map(t => {
        // Buscamos el módulo real en la ruta de aprendizaje del estudiante
        const moduloEnRuta = datos.ruta_ia_asignada?.find(m => m.id_modulo === t.idModulo);
        
        // Si el estudiante ganó la insignia de este módulo → 100% de dominio
        const ganada = insigniasGanadas.some(i => i.id_insignia === t.idModulo);
        
        // Si no la ganó, usamos el progreso REAL del módulo (0% si no lo ha empezado)
        const progresoReal = moduloEnRuta?.porcentaje_avance || 0;
        
        return {
            tema: t.tema,
            dominio: ganada ? 100 : progresoReal
        };
    });

    // 🚩 CORRECCIÓN TOTAL: DATOS 100% REALES PARA EL HEATMAP (CERO Math.random)
    const generarHeatmap = () => {
        const dias = [];
        const hoy = new Date();
        const racha = datos.racha_dias || 0;
        
        for (let i = 29; i >= 0; i--) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() - i);
            
            // Si el día está dentro de la racha real → activo (nivel 3 = estudió)
            // Si está fuera → inactivo (nivel 0 = no estudió)
            const diasDesdeHoy = i;
            const esDiaActivo = diasDesdeHoy < racha;
            
            dias.push({
                fecha: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                actividad: esDiaActivo ? 3 : 0 
            });
        }
        return dias;
    };

    const heatmapData = generarHeatmap();

    const getColorActividad = (nivel) => {
        if (nivel === 0) return 'bg-slate-100 border border-slate-200';
        if (nivel === 1) return 'bg-[#FBE000]/40';
        if (nivel === 2) return 'bg-[#FBE000]/70';
        return 'bg-[#FBE000]';
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-10 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FBE000]/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#0A3D62]/5 blur-[100px] rounded-full -z-10"></div>

            <button
                onClick={() => navigate('/estudiante/dashboard')}
                className="self-start mb-6 text-[#0A3D62] hover:text-[#2E5AAC] transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al Panel
            </button>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                {/* 🚩 COLUMNA IZQUIERDA: PERFIL Y ESTADÍSTICAS */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl border-t-4 border-[#FBE000] p-6 md:p-8 text-center relative overflow-hidden">
                        <img src="/mascota.png" alt="Estudiando" className="absolute -bottom-4 -right-4 w-24 h-24 object-contain opacity-20 pointer-events-none" />

                        <div className="relative group mx-auto w-32 h-32 mb-6">
                            <div
                                className="w-full h-full rounded-full flex items-center justify-center border-4 border-[#FBE000] shadow-lg overflow-hidden relative cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                onClick={() => fileInputRef.current.click()}
                                style={{ backgroundColor: !fotoPerfil ? generarColorAvatar(datos.nombre_completo) : 'transparent' }}
                            >
                                {fotoPerfil ? (
                                    <img src={obtenerUrlImagen(fotoPerfil)} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl text-white font-black drop-shadow-md">
                                        {datos.nombre_completo.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-[#0A3D62]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-[10px] text-white font-bold uppercase tracking-widest text-center px-2">Cambiar Foto</span>
                                </div>
                            </div>
                            {subiendoFoto && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-3 border-[#0A3D62] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleSubirFoto} />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 leading-tight uppercase tracking-tight">{datos.nombre_completo}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">{datos.correo}</p>

                        <div className="mt-6 px-4 py-2 bg-[#FBE000]/10 border border-[#FBE000] text-[#0A3D62] text-[10px] font-black uppercase tracking-[0.2em] rounded-full inline-block shadow-sm">
                            Nivel: {datos.rango_actual}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 md:p-8">
                        <h4 className="text-[10px] text-slate-500 uppercase font-black mb-4 tracking-widest flex items-center gap-2">
                            <span>📊</span> Nivel de Dominio
                            <InfoTooltip text="Tu efectividad se calcula combinando tu puntaje inicial en el diagnóstico y los módulos que has completado exitosamente." />
                        </h4>
                        
                        <div className="flex justify-between items-center text-slate-800 mb-2">
                            <span className="text-xs font-bold text-slate-500">Efectividad Global</span>
                            <span className="text-[#0A3D62] font-black text-xl">{datos.efectividad}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-6 border border-slate-200">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${datos.efectividad}%` }} 
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-[#0A3D62]" 
                            />
                        </div>
                        
                        <div className="flex justify-between border-t border-slate-100 pt-5">
                            <div className="text-center w-1/2 border-r border-slate-100">
                                <p className="text-2xl font-black text-[#2E5AAC]">{datos.puntaje_total}</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Puntos IA</p>
                            </div>
                            <div className="text-center w-1/2">
                                <p className="text-2xl font-black text-[#2E5AAC]">{datos.ejercicios_completados}</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Módulos</p>
                            </div>
                        </div>
                    </div>

                    {/* 🚩 Calendario de Constancia (Heatmap con datos reales) */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6">
                        <h4 className="text-[10px] text-slate-500 uppercase font-black mb-4 tracking-widest flex items-center gap-2">
                            <span>🔥</span> Constancia (Últimos 30 días)
                            <InfoTooltip text="Cada cuadro representa un día. Los tonos más intensos indican mayor actividad de estudio basada en tu racha actual." />
                        </h4>
                        <div className="grid grid-cols-10 gap-1.5">
                            {heatmapData.map((dia, i) => (
                                <div 
                                    key={i} 
                                    className={`w-full aspect-square rounded-sm transition-all hover:scale-125 cursor-help ${getColorActividad(dia.actividad)}`}
                                    title={`${dia.fecha}: ${dia.actividad === 0 ? 'Sin actividad' : 'Día activo en racha'}`}
                                ></div>
                            ))}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-3 text-[9px] text-slate-400">
                            <span>Menos</span>
                            <div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200"></div>
                            <div className="w-3 h-3 rounded-sm bg-[#FBE000]/40"></div>
                            <div className="w-3 h-3 rounded-sm bg-[#FBE000]/70"></div>
                            <div className="w-3 h-3 rounded-sm bg-[#FBE000]"></div>
                            <span>Más</span>
                        </div>
                    </div>
                </div>

                {/* 🚩 COLUMNA DERECHA: ANÁLISIS DE DESEMPEÑO */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 🚩 Tarjeta de "Próximo Hito" */}
                    {siguienteHito && (
                        <div className="bg-[#0A3D62]/5 border border-[#0A3D62]/10 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-2xl grayscale flex-shrink-0">
                                🔒
                            </div>
                            <div className="flex-1">
                                <h5 className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Tu próximo objetivo</h5>
                                <h4 className="text-base md:text-lg font-bold text-[#0A3D62] mb-1">{siguienteHito.nombre_insignia}</h4>
                                <p className="text-xs text-slate-600 italic">"{siguienteHito.descripcion}"</p>
                            </div>
                        </div>
                    )}

                    {/* 🚩 Radar de Competencias (Con datos reales de progreso) */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl border-t-4 border-t-[#FBE000] p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <h4 className="text-base md:text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <span>🎯</span> Radar de Competencias
                                </h4>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Tu dominio real por tema matemático</p>
                            </div>
                            <InfoTooltip text="Este gráfico muestra tu nivel de dominio en cada área basado en tu progreso real en los módulos. ¡Trabaja en las áreas más pequeñas para equilibrar tu perfil!" />
                        </div>

                        <div className="w-full h-72 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={datosRadar}>
                                    <PolarGrid stroke="#E2E8F0" />
                                    <PolarAngleAxis dataKey="tema" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                                    <Radar 
                                        name="Dominio" 
                                        dataKey="dominio" 
                                        stroke="#0A3D62" 
                                        fill="#0A3D62" 
                                        fillOpacity={0.3}
                                        strokeWidth={2}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#FFFFFF', 
                                            border: '1px solid #E2E8F0', 
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }} 
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 🚩 Insignias Desbloqueadas (Compacto) */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl border-t-4 border-t-[#FBE000] p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <h4 className="text-base md:text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <span>🏆</span> Insignias Desbloqueadas
                                </h4>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Tu colección de méritos académicos</p>
                            </div>
                            <div className="bg-[#FBE000]/10 px-4 py-2 rounded-full border border-[#FBE000]">
                                <span className="text-[#0A3D62] font-black text-[10px] md:text-xs tracking-widest">
                                    {insigniasGanadas.length} / {datos.todas_insignias.length} OBTENIDAS
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {insigniasGanadas.length > 0 ? (
                                insigniasGanadas.map(insignia => (
                                    <motion.div 
                                        key={insignia.id_insignia}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-2xl border bg-[#FBE000]/5 border-[#FBE000] hover:bg-[#FBE000]/10 hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-[#FBE000]/20 border-2 border-[#FBE000] flex items-center justify-center text-2xl shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                            🏅
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-xs md:text-sm font-black uppercase tracking-wider mb-1 text-[#0A3D62] truncate">
                                                {insignia.nombre_insignia}
                                            </h5>
                                            <p className="text-[10px] md:text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                                                {insignia.descripcion}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center p-8 col-span-full bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    <img src="/idea.png" alt="Sin insignias" className="w-16 h-16 object-contain mx-auto mb-3 opacity-50" />
                                    <p className="text-slate-500 text-sm font-medium">Aún no has desbloqueado insignias.</p>
                                    <p className="text-slate-400 text-xs mt-1">¡Completa tu primer módulo para obtener tu primer logro!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PerfilEstudiante;