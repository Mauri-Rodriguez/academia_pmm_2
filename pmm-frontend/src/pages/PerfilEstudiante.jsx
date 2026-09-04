import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api, { BACKEND_URL } from '../api/api';

const PerfilEstudiante = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [subiendoFoto, setSubiendoFoto] = useState(false);

    // Lógica intacta: Genera un color consistente basado en el nombre
    const generarColorAvatar = (nombre = "Ninja") => {
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
                    todas_insignias: resDash.data?.todas_insignias || []
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

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-10 flex flex-col items-center relative overflow-hidden">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FBE000]/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#0A3D62]/5 blur-[100px] rounded-full -z-10"></div>

            <button
                onClick={() => navigate('/estudiante/dashboard')}
                className="self-start mb-6 text-[#0A3D62] hover:text-[#2E5AAC] transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al Panel
            </button>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                {/* 🚩 COLUMNA IZQUIERDA: PERFIL Y ESTADÍSTICAS */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tarjeta de Perfil con Patrón de Diseño Obligatorio */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl border-t-4 border-[#FBE000] p-6 md:p-8 text-center relative overflow-hidden">
                        
                        {/* Mascota decorativa sutil */}
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

                    {/* Tarjeta de Estadísticas Rápidas */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 md:p-8">
                        <h4 className="text-[10px] text-slate-500 uppercase font-black mb-4 tracking-widest flex items-center gap-2">
                            <span>📊</span> Nivel de Dominio
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
                </div>

                {/* 🚩 COLUMNA DERECHA: RÉCORDS E HITOS (DINÁMICO DESDE BD) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl border-t-4 border-[#FBE000] p-6 md:p-8 h-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <h4 className="text-base md:text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <span>🏆</span> Registro de Hitos
                                </h4>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Tu colección de insignias académicas</p>
                            </div>
                            <div className="bg-[#0A3D62]/5 px-4 py-2 rounded-full border border-[#0A3D62]/10">
                                <span className="text-[#0A3D62] font-black text-[10px] md:text-xs tracking-widest">
                                    {datos.insignias_obtenidas.length} / {datos.todas_insignias.length} DESBLOQUEADAS
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {datos.todas_insignias.length > 0 ? (
                                datos.todas_insignias.map(insignia => {
                                    const ganada = datos.insignias_obtenidas.some(i => i.id_insignia === insignia.id_insignia);
                                    
                                    return (
                                        <motion.div 
                                            key={insignia.id_insignia}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group
                                                ${ganada 
                                                    ? 'bg-[#FBE000]/5 border-[#FBE000] hover:bg-[#FBE000]/10 hover:shadow-md' 
                                                    : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110
                                                ${ganada ? 'bg-[#FBE000]/20 border-2 border-[#FBE000]' : 'bg-slate-200 border-2 border-slate-300 grayscale'}`}>
                                                {ganada ? '🏅' : '🔒'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className={`text-xs md:text-sm font-black uppercase tracking-wider mb-1 truncate ${ganada ? 'text-[#0A3D62]' : 'text-slate-500'}`}>
                                                    {insignia.nombre_insignia}
                                                </h5>
                                                <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                                    {insignia.descripcion}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="text-center p-8 col-span-full bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    <img src="/idea.png" alt="Sin insignias" className="w-16 h-16 object-contain mx-auto mb-3 opacity-50" />
                                    <p className="text-slate-500 text-sm font-medium">Aún no hay insignias registradas.</p>
                                    <p className="text-slate-400 text-xs mt-1">¡Completa módulos para desbloquear tus primeros logros!</p>
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