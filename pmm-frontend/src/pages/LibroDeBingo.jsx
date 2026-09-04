import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const LibroDeBingo = () => {
    const [ranking, setRanking] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await api.get('/api/estudiante/ranking');
                setRanking(res.data);
            } catch (err) {
                console.error("Error al cargar el ranking:", err);
            }
        };
        fetchRanking();
    }, []);

    // Helper para traducir rangos del backend a términos académicos (Regla de Oro)
    const getEstiloNivel = (nivelStr) => {
        const n = nivelStr?.toLowerCase() || '';
        if (n.includes('genin') || n.includes('bajo')) return { label: 'BÁSICO', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
        if (n.includes('chunin') || n.includes('intermedio') || n.includes('guerrero')) return { label: 'INTERMEDIO', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
        if (n.includes('jonin') || n.includes('alto') || n.includes('maestro')) return { label: 'AVANZADO', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
        return { label: 'EXPERTO', color: 'text-[#0A3D62]', bg: 'bg-[#0A3D62]/10', border: 'border-[#0A3D62]/20' };
    };

    // Helper para definir los estilos del Podio en tema claro
    const getEstilosPodio = (index) => {
        if (index === 0) return "bg-[#FBE000]/10 border-[#FBE000] border-t-4 border-t-[#FBE000] shadow-lg shadow-[#FBE000]/10";
        if (index === 1) return "bg-white border-slate-200 border-t-4 border-t-slate-300 shadow-md";
        if (index === 2) return "bg-white border-orange-200 border-t-4 border-t-orange-300 shadow-md";
        return "bg-white border-slate-200 border-t-4 border-t-slate-200 shadow-sm hover:shadow-md";
    };

    if (ranking === null || ranking.length === 0) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
                <img src="/pensando.png" alt="Cargando ranking" className="w-32 h-32 object-contain animate-bounce mb-4" />
                <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Cargando tabla de honor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-10 lg:p-16 relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FBE000]/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#0A3D62]/5 blur-[100px] rounded-full -z-10"></div>
            
            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* BOTÓN VOLVER */}
                <button 
                    onClick={() => navigate('/estudiante/dashboard')}
                    className="mb-8 flex items-center gap-2 text-[#0A3D62] hover:text-[#2E5AAC] transition-all font-bold text-[10px] uppercase tracking-[0.2em] group"
                >
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    Volver al Panel
                </button>

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
                    <div className="flex items-start gap-4">
                        <img src="/subir nivel robot.png" alt="Celebrando" className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-lg hidden sm:block" />
                        <div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase leading-tight">
                                Ranking <span className="text-[#0A3D62]">Académico</span>
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm font-medium tracking-wide">
                                Reconocimiento a los estudiantes más destacados de la plataforma.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 md:p-4 rounded-2xl shadow-sm flex items-center gap-3 self-start md:self-auto">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Estado del Sistema</p>
                            <p className="text-xs text-green-600 font-bold">● ACTUALIZADO EN TIEMPO REAL</p>
                        </div>
                    </div>
                </div>
                
                {/* ENCABEZADO DE TABLA (Solo visible en desktop) */}
                <div className="hidden md:grid grid-cols-12 px-8 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 mb-2">
                    <div className="col-span-2">Posición</div>
                    <div className="col-span-5">Estudiante</div>
                    <div className="col-span-3">Nivel de Dominio</div>
                    <div className="col-span-2 text-right">Módulos</div>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {ranking.map((estudiante, index) => {
                        const estiloNivel = getEstiloNivel(estudiante.rango);
                        
                        return (
                            <div 
                                key={estudiante.id_usuario || index} 
                                className={`p-4 md:px-8 md:py-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 group ${getEstilosPodio(index)}`}
                            >
                                {/* 📱 LAYOUT MÓVIL (Flexbox para evitar solapamientos) */}
                                <div className="flex flex-col gap-3 md:hidden">
                                    {/* Fila 1: Posición + Nombre + Módulos */}
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <span className="text-2xl font-black text-slate-300 flex-shrink-0">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                            </span>
                                            <p className="font-bold text-base text-slate-900 truncate">
                                                {estudiante.nombre_completo}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-3">
                                            <p className="text-xl font-black text-[#0A3D62] leading-none">
                                                {estudiante.misiones_completas || 0}
                                            </p>
                                            <p className="text-[8px] text-slate-400 uppercase font-bold">Módulos</p>
                                        </div>
                                    </div>
                                    
                                    {/* Fila 2: Badge de Nivel y Destacado */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`inline-block text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full border ${estiloNivel.bg} ${estiloNivel.color} ${estiloNivel.border}`}>
                                            {estiloNivel.label}
                                        </span>
                                        {index <= 2 && (
                                            <span className="inline-block text-[9px] font-black tracking-widest text-yellow-700 bg-[#FBE000]/20 px-2.5 py-1 rounded-full border border-[#FBE000]/40">
                                                TOP 3 DESTACADO
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 💻 LAYOUT DESKTOP (Grid de 12 columnas) */}
                                <div className="hidden md:grid md:grid-cols-12 md:items-center md:gap-0">
                                    {/* POSICIÓN */}
                                    <div className="col-span-2 font-black text-3xl flex items-center">
                                        <span className="font-serif italic">
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </span>
                                    </div>

                                    {/* NOMBRE */}
                                    <div className="col-span-5 flex flex-col justify-center min-w-0">
                                        <p className="font-bold text-lg text-slate-900 group-hover:text-[#0A3D62] transition-colors truncate">
                                            {estudiante.nombre_completo}
                                        </p>
                                        {index <= 2 && (
                                            <span className="inline-block mt-1.5 w-max text-[9px] font-black tracking-widest text-yellow-700 bg-[#FBE000]/20 px-2 py-0.5 rounded-full border border-[#FBE000]/40">
                                                TOP 3 DESTACADO
                                            </span>
                                        )}
                                    </div>

                                    {/* RANGO */}
                                    <div className="col-span-3 flex items-center">
                                        <span className={`inline-block text-[10px] tracking-widest font-bold px-3 py-1.5 rounded-full border ${estiloNivel.bg} ${estiloNivel.color} ${estiloNivel.border}`}>
                                            {estiloNivel.label}
                                        </span>
                                    </div>

                                    {/* MISIONES */}
                                    <div className="col-span-2 text-right flex flex-col items-end justify-center">
                                        <p className="text-2xl font-black text-[#0A3D62] leading-none">
                                            {estudiante.misiones_completas || 0}
                                        </p>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-tighter font-bold mt-1">Completados</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ESTADO VACÍO (Por si la API devuelve array vacío) */}
                {ranking.length === 0 && (
                    <div className="bg-white border-2 border-dashed border-slate-300 p-12 md:p-20 text-center rounded-3xl shadow-sm mt-8">
                        <img src="/estudiando.png" alt="Sin registros" className="w-24 h-24 object-contain mx-auto mb-4 opacity-70" />
                        <p className="text-slate-700 font-bold uppercase text-sm tracking-widest mb-2">El ranking está en construcción</p>
                        <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                            Completa tus primeros módulos para aparecer en la tabla de honor y competir con tus compañeros.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibroDeBingo;